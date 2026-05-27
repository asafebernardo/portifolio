/** Profile photo (`public/profile-photo.png`). PNG with transparency is supported. */
export const DEFAULT_PROFILE_PHOTO = '/profile-photo.png'

export function resolveProfilePhoto(profilePhoto?: string): string {
  const trimmed = profilePhoto?.trim()
  return trimmed || DEFAULT_PROFILE_PHOTO
}
