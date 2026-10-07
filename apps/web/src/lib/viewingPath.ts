import type { ClueKey } from './paintingClues'
import { paintingFiles, type PaintingId } from './paintings'

export type PathEntry = { paintingId: PaintingId; clue: ClueKey; note?: string }
const storageKey = 'yitang-viewing-path-v1'
const clueKeys: ClueKey[] = ['head', 'hands', 'robe']

export function readViewingPath(): PathEntry[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(saved)) return []
    const seen = new Set<string>()
    return saved.filter((item): item is PathEntry => {
      if (!item || typeof item !== 'object') return false
      const entry = item as Partial<PathEntry>
      if (!paintingFiles.includes(entry.paintingId as PaintingId) || !clueKeys.includes(entry.clue as ClueKey)) return false
      const key = `${entry.paintingId}:${entry.clue}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).map(entry => ({ paintingId: entry.paintingId, clue: entry.clue, note: typeof entry.note === 'string' ? entry.note : undefined }))
  } catch { return [] }
}

export function addToViewingPath(...entries: PathEntry[]): PathEntry[] {
  const path = readViewingPath()
  for (const entry of entries) {
    const previous = path.find(saved => saved.paintingId === entry.paintingId && saved.clue === entry.clue)
    if (previous) {
      if (entry.note) previous.note = entry.note
    } else path.push(entry)
  }
  localStorage.setItem(storageKey, JSON.stringify(path))
  return path
}

export function updateViewingPathNote(paintingId: PaintingId, clue: ClueKey, note: string): PathEntry[] {
  const path = readViewingPath()
  const entry = path.find(saved => saved.paintingId === paintingId && saved.clue === clue)
  if (entry) {
    entry.note = note.trim()
    localStorage.setItem(storageKey, JSON.stringify(path))
  }
  return path
}

export function removeFromViewingPath(entry: PathEntry): PathEntry[] {
  const path = readViewingPath().filter(saved => saved.paintingId !== entry.paintingId || saved.clue !== entry.clue)
  localStorage.setItem(storageKey, JSON.stringify(path))
  return path
}
