/**
 * API HTTP de upload de imagens (JPEG) para public/uploads ou UPLOAD_DIR.
 * POST /api/upload — corpo JSON { prefix: "profile"|"project", base64: string }
 *
 * Variáveis: PORT, UPLOAD_DIR, UPLOAD_SECRET, UPLOAD_PUBLIC_PREFIX
 */
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { mergeSiteRuntimeManifest } from './merge-site-runtime.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10)
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(repoRoot, 'public', 'uploads')
const UPLOAD_SECRET = process.env.UPLOAD_SECRET ?? ''
/** Prefixo público antes de /uploads/… (ex.: /portfolio quando o site está num subcaminho). */
const UPLOAD_PUBLIC_PREFIX = (process.env.UPLOAD_PUBLIC_PREFIX ?? '').replace(/\/$/, '')

const MAX_BODY_BYTES = 15 * 1024 * 1024

function isJpeg(buf) {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
}

function publicUploadUrl(filename) {
  const base = UPLOAD_PUBLIC_PREFIX
  const tail = `/uploads/${filename}`
  if (!base) return tail
  return `${base}${tail}`.replace(/\/{2,}/g, '/')
}

function sendJson(res, status, body) {
  res.status(status).type('application/json').send(JSON.stringify(body))
}

const app = express()
app.disable('x-powered-by')

app.use(express.json({ limit: `${Math.floor(MAX_BODY_BYTES / (1024 * 1024))}mb` }))

app.post('/api/upload', (req, res) => {
  if (UPLOAD_SECRET) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${UPLOAD_SECRET}`) {
      sendJson(res, 401, { error: 'Não autorizado.' })
      return
    }
  }

  const parsed = req.body
  if (!parsed || typeof parsed !== 'object') {
    sendJson(res, 400, { error: 'Payload inválido.' })
    return
  }

  const { prefix, base64, projectId } = parsed
  if (prefix !== 'profile' && prefix !== 'project') {
    sendJson(res, 400, { error: 'prefix deve ser "profile" ou "project".' })
    return
  }
  if (typeof base64 !== 'string' || base64.length === 0) {
    sendJson(res, 400, { error: 'base64 em falta.' })
    return
  }

  let buf
  try {
    buf = Buffer.from(base64, 'base64')
  } catch {
    sendJson(res, 400, { error: 'Base64 inválido.' })
    return
  }

  if (!isJpeg(buf)) {
    sendJson(res, 400, { error: 'Só são aceites ficheiros JPEG.' })
    return
  }

  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    const name = `${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}.jpeg`
    const filePath = path.join(UPLOAD_DIR, name)
    fs.writeFileSync(filePath, buf)
    const urlPath = publicUploadUrl(name)
    mergeSiteRuntimeManifest(UPLOAD_DIR, urlPath, {
      prefix,
      projectId: typeof projectId === 'string' ? projectId : undefined,
    })
    sendJson(res, 200, { url: urlPath })
  } catch {
    sendJson(res, 500, { error: 'Não foi possível gravar o ficheiro.' })
  }
})

app.get('/api/health', (_req, res) => {
  res.status(200).type('application/json').send(JSON.stringify({ ok: true }))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[upload-api] listening on ${PORT}, UPLOAD_DIR=${UPLOAD_DIR}`)
})
