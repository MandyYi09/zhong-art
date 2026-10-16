/** Keep public files tied to the current release, even when filenames are unchanged. */
export function publicAsset(path: string, query: Record<string, string> = {}) {
  const params = new URLSearchParams(query)
  if (import.meta.env.VITE_RELEASE_VERSION) params.set('v', import.meta.env.VITE_RELEASE_VERSION)
  const suffix = params.toString()
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}${suffix ? `?${suffix}` : ''}`
}
