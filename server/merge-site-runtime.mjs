/**
 * Atualiza `uploads/site-runtime.json` com URLs públicas das imagens gravadas no disco,
 * para o site voltar a aplicá-las mesmo sem localStorage (ex.: após limpar cookies/dados).
 */
import fs from 'node:fs'
import path from 'node:path'

export function mergeSiteRuntimeManifest(uploadDir, publicUrl, { prefix, projectId }) {
  fs.mkdirSync(uploadDir, { recursive: true })
  const manifestPath = path.join(uploadDir, 'site-runtime.json')

  let data = {}
  try {
    if (fs.existsSync(manifestPath)) {
      data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    }
  } catch {
    data = {}
  }

  if (!data.projectImages || typeof data.projectImages !== 'object') {
    data.projectImages = {}
  }

  if (prefix === 'profile') {
    data.profilePhoto = publicUrl
  } else if (prefix === 'project' && typeof projectId === 'string' && projectId.trim()) {
    data.projectImages[projectId.trim()] = publicUrl
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
