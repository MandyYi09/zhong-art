import { randomUUID } from 'node:crypto'

// This loader lives in the HTML so even a cached document finds the latest build.
export async function loadLatestRelease(fallback, base) {
  const root = new URL(base, window.location.origin)
  let current = fallback.version
  let checking = false
  let edited = false

  async function latest() {
    const url = new URL('version.json', root)
    url.searchParams.set('_', `${Date.now()}-${Math.random()}`)
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw new Error('Version check unavailable')
    const release = await response.json()
    const validAsset = value => typeof value === 'string' && /^assets\/[\w./-]+$/.test(value) && !value.includes('..')
    if (typeof release.version !== 'string' || !validAsset(release.entry) || !Array.isArray(release.styles) || !release.styles.every(validAsset)) {
      throw new Error('Invalid release')
    }
    return release
  }

  function mount(release, retry = true) {
    const styles = release.styles.map(file => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = new URL(file, root).href
      document.head.append(link)
      return link
    })
    const script = document.createElement('script')
    script.type = 'module'
    script.crossOrigin = 'anonymous'
    script.src = new URL(release.entry, root).href
    script.onerror = () => {
      if (retry && release.entry !== fallback.entry) {
        styles.forEach(link => link.remove())
        script.remove()
        current = fallback.version
        mount(fallback, false)
      }
    }
    document.head.append(script)
    current = release.version
  }

  try { mount(await latest()) } catch { mount(fallback) }

  async function checkForUpdate() {
    if (checking || edited || document.visibilityState !== 'visible' || navigator.onLine === false) return
    checking = true
    try {
      const release = await latest()
      if (edited || document.visibilityState !== 'visible') return
      if (release.version !== current) {
        // Avoid reload loops if a deployment is only partially available.
        const key = 'zhong-art-auto-update'
        try {
          if (sessionStorage.getItem(key) === release.version) return
          sessionStorage.setItem(key, release.version)
        } catch { return }
        window.location.reload()
      }
    } catch { /* A temporary network failure should leave the page usable. */ }
    finally { checking = false }
  }

  document.addEventListener('input', event => {
    if (event.target?.matches('textarea, input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), [contenteditable="true"]')) edited = true
  })
  window.addEventListener('focus', checkForUpdate)
  window.addEventListener('pageshow', checkForUpdate)
  document.addEventListener('visibilitychange', checkForUpdate)
  window.setInterval(checkForUpdate, 60000)
}

export function versionedHtml(html, version, base) {
  const script = /<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/
  const entry = html.match(script)?.[1]
  if (!entry?.startsWith(base)) throw new Error('Missing Pages entry script')
  const styles = []
  html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (tag, href) => {
    if (!href.startsWith(`${base}assets/`)) return tag
    styles.push(href.slice(base.length))
    return ''
  })
  const release = { version, entry: entry.slice(base.length), styles }
  const data = JSON.stringify(release).replace(/</g, '\\u003c')
  const loader = `<script type="module" data-release-loader>(${loadLatestRelease.toString()})(${data}, ${JSON.stringify(base)});</script>`
  return { html: html.replace(script, () => loader), release }
}

export function pagesEntry() {
  let base
  const version = process.env.GITHUB_SHA || randomUUID()
  return {
    name: 'pages-latest-release',
    enforce: 'post',
    config() { return { define: { 'import.meta.env.VITE_RELEASE_VERSION': JSON.stringify(version) } } },
    configResolved(config) { base = config.base },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset') throw new Error('Missing Pages HTML')
        const result = versionedHtml(String(index.source), version, base)
        index.source = result.html
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(result.release) })
      },
    },
  }
}
