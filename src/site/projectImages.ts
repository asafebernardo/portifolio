import { resolvePublicUrl } from '../lib/publicUrl'
import type { ProjectEntry } from './types'

/** Normalized image URLs for a project (`images[]` or legacy `image`). */
export function getProjectImages(project: ProjectEntry): string[] {
  const fromList = project.images?.map((u) => resolvePublicUrl(u.trim())).filter(Boolean) ?? []
  if (fromList.length > 0) return fromList
  const single = project.image?.trim()
  return single ? [resolvePublicUrl(single)] : []
}
