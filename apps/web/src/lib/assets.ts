/** Prefix public files with the Vite base path for GitHub project Pages. */
export function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
