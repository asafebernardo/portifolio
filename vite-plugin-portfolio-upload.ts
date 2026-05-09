import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const ROUTE = '/__portfolio-upload'
const MAX_BODY_BYTES = 15 * 1024 * 1024

function isJpeg(buf: Buffer): boolean {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(JSON.parse(raw))
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function uploadMiddleware(root: string) {
  const publicDir = path.join(root, 'public')
  const uploadsDir = path.join(publicDir, 'uploads')

  return async (req, res, next) => {
    const url = req.url?.split('?')[0] ?? ''
    if (url !== ROUTE || req.method !== 'POST') {
      next()
      return
    }

    let parsed: unknown
    try {
      parsed = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { error: 'Corpo JSON inválido ou demasiado grande.' })
      return
    }

    if (!parsed || typeof parsed !== 'object') {
      sendJson(res, 400, { error: 'Payload inválido.' })
      return
    }

    const { prefix, base64 } = parsed as { prefix?: unknown; base64?: unknown }
    if (prefix !== 'profile' && prefix !== 'project') {
      sendJson(res, 400, { error: 'prefix deve ser "profile" ou "project".' })
      return
    }
    if (typeof base64 !== 'string' || base64.length === 0) {
      sendJson(res, 400, { error: 'base64 em falta.' })
      return
    }

    let buf: Buffer
    try {
      buf = Buffer.from(base64, 'base64')
    } catch {
      sendJson(res, 400, { error: 'Base64 inválido.' })
      return
    }

    if (!isJpeg(buf)) {
      sendJson(res, 400, { error: 'Só são aceites JPEG após processamento no cliente.' })
      return
    }

    try {
      fs.mkdirSync(uploadsDir, { recursive: true })
      const name = `${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}.jpeg`
      const filePath = path.join(uploadsDir, name)
      fs.writeFileSync(filePath, buf)
      const urlPath = `/uploads/${name}`
      sendJson(res, 200, { url: urlPath })
    } catch {
      sendJson(res, 500, { error: 'Não foi possível gravar em public/uploads/.' })
    }
  }
}

export function portfolioUploadPlugin(): Plugin {
  return {
    name: 'portfolio-upload',
    configureServer(server) {
      server.middlewares.use(uploadMiddleware(server.config.root))
    },
    configurePreviewServer(server) {
      server.middlewares.use(uploadMiddleware(server.config.root))
    },
  }
}
