import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { loadLatestRelease, versionedHtml } from './pages-entry.mjs'

const old = { version: 'old', entry: 'assets/old.js', styles: ['assets/old.css'] }
const next = { version: 'new', entry: 'assets/new.js', styles: ['assets/new.css'] }

async function browser(responses) {
  const handlers = {}
  const elements = []
  const requests = []
  const stored = new Map()
  const state = { reloads: 0 }
  const context = {
    URL, AbortSignal, setTimeout, clearTimeout,
    navigator: { onLine: true },
    sessionStorage: { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value) },
    document: {
      visibilityState: 'visible',
      createElement: tag => ({ tag, remove() { this.removed = true } }),
      head: { append: element => elements.push(element) },
      addEventListener: (name, handler) => { handlers[name] = handler },
    },
    window: {
      location: { origin: 'https://example.test', reload() { state.reloads++ } },
      addEventListener: (name, handler) => { handlers[name] = handler },
      setInterval: handler => { handlers.interval = handler },
    },
    fetch: async (url, options) => {
      requests.push({ url, options })
      const result = await responses.shift()
      if (result instanceof Error) throw result
      return { ok: true, json: async () => result }
    },
  }
  vm.createContext(context)
  await vm.runInContext(`(${loadLatestRelease.toString()})(${JSON.stringify(old)}, '/zhong-art/')`, context)
  return { context, handlers, elements, requests, state, stored }
}

test('a cached HTML document loads the newest script and stylesheet without changing the address', async () => {
  const page = await browser([next])
  assert.equal(page.elements[0].href, 'https://example.test/zhong-art/assets/new.css')
  assert.equal(page.elements[1].src, 'https://example.test/zhong-art/assets/new.js')
  assert.equal(page.requests[0].options.cache, 'no-store')
  assert.equal(page.requests[0].url.pathname, '/zhong-art/version.json')
  assert.ok(page.requests[0].url.searchParams.has('_'))
  assert.equal(page.state.reloads, 0)
})

test('network failures and malformed manifests fall back to the build in the document', async () => {
  for (const response of [new Error('offline'), { ...next, entry: 'https://other.test/app.js' }]) {
    const page = await browser([response])
    assert.equal(page.elements[1].src, 'https://example.test/zhong-art/assets/old.js')
  }
})

test('a partially propagated asset falls back and only reloads once for the same release', async () => {
  const page = await browser([next, next, next])
  page.elements[1].onerror()
  assert.equal(page.elements.at(-1).src, 'https://example.test/zhong-art/assets/old.js')
  await page.handlers.focus()
  await page.handlers.interval()
  assert.equal(page.state.reloads, 1)
})

test('open tabs check on return and automatically reload a newer release', async () => {
  const page = await browser([old, old, next])
  await page.handlers.focus()
  assert.equal(page.state.reloads, 0)
  await page.handlers.interval()
  assert.equal(page.state.reloads, 1)
})

test('background tabs, offline users, and users entering text are left undisturbed', async () => {
  const page = await browser([old, next])
  page.context.document.visibilityState = 'hidden'
  await page.handlers.interval()
  page.context.document.visibilityState = 'visible'
  page.context.navigator.onLine = false
  await page.handlers.focus()
  page.context.navigator.onLine = true
  page.handlers.input({ target: { matches: () => true } })
  await page.handlers.focus()
  assert.equal(page.requests.length, 1)
  assert.equal(page.state.reloads, 0)
})

test('build output keeps fonts and replaces stale entry and CSS tags with the version loader', () => {
  const html = '<head><script type="module" crossorigin src="/zhong-art/assets/old.js"></script><link rel="stylesheet" crossorigin href="/zhong-art/assets/old.css"><link href="https://fonts.googleapis.com/css2" rel="stylesheet"></head>'
  const result = versionedHtml(html, 'old', '/zhong-art/')
  assert.deepEqual(result.release, old)
  assert.ok(result.html.includes('data-release-loader'))
  assert.ok(result.html.includes('https://fonts.googleapis.com/css2'))
  assert.ok(!result.html.includes('src="/zhong-art/assets/old.js"'))
  assert.ok(!result.html.includes('href="/zhong-art/assets/old.css"'))
  assert.throws(() => versionedHtml('<head></head>', 'old', '/zhong-art/'))
})


test('a stalled version check mounts the fallback within the startup budget', async () => {
  const start = Date.now()
  const page = await browser([new Promise(() => {})])
  assert.equal(page.elements.at(-1).src, 'https://example.test/zhong-art/assets/old.js')
  assert.ok(Date.now() - start < 2000, 'startup must not wait for the five-second network timeout')
})

test('a late manifest does not mount a second application', async () => {
  let resolve
  const response = new Promise(done => { resolve = done })
  const page = await browser([response])
  resolve(next)
  await new Promise(done => setTimeout(done, 0))
  assert.equal(page.elements.filter(element => element.tag === 'script').length, 1)
  assert.equal(page.elements.at(-1).src, 'https://example.test/zhong-art/assets/old.js')
})
