/** Move saved collections from historical namespaces without retaining a brand name. */
export function readStoredValue(key: string, kind: 'collection' | 'path' | 'note'): string | null {
  try {
    let current = localStorage.getItem(key)
    const suffix = key.replace(/^shuilu/, '')
    const previousKeys: string[] = []
    for (let index = 0; index < localStorage.length; index++) {
      const candidate = localStorage.key(index)
      if (candidate && candidate !== key && candidate.endsWith(suffix)) previousKeys.push(candidate)
    }
    for (const previousKey of previousKeys) {
      const previous = localStorage.getItem(previousKey)
      if (previous === null) continue
      let merged: string
      if (kind === 'note') {
        merged = !current || current === previous ? previous : !previous ? current : `${previous}\n\n${current}`
      } else {
        let oldItems: unknown, newItems: unknown
        try { oldItems = JSON.parse(previous); newItems = JSON.parse(current || '[]') } catch { continue }
        if (!Array.isArray(oldItems) || !Array.isArray(newItems)) continue
        if (kind === 'collection') {
          if (![...oldItems, ...newItems].every(item => typeof item === 'string')) continue
          merged = JSON.stringify([...new Set([...oldItems, ...newItems])])
        } else {
          const entries = new Map<string, Record<string, unknown>>()
          const items = [...oldItems, ...newItems]
          if (!items.every(item => item && typeof item === 'object' && typeof item.paintingId === 'string' && ['head', 'hands', 'robe'].includes(item.clue))) continue
          for (const item of items) {
            const id = `${item.paintingId}:${item.clue}`
            const saved = entries.get(id)
            entries.set(id, { ...saved, ...item, note: item.note || saved?.note })
          }
          merged = JSON.stringify([...entries.values()])
        }
      }
      // Remove an old key only after its merged contents have been saved successfully.
      localStorage.setItem(key, merged)
      if (localStorage.getItem(key) === merged) localStorage.removeItem(previousKey)
      current = merged
    }
    return current
  } catch {
    try { return localStorage.getItem(key) } catch { return null }
  }
}
