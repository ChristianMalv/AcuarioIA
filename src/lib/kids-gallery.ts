export type Artwork = {
  id: string
  name: string
  dataUrl: string
  createdAt: number
}

const STORAGE_KEY = 'acuario-kids-obras'
const MAX_ARTWORKS = 30

export const ARTWORKS_EVENT = 'acuario-kids-obras-changed'

export function getArtworks(): Artwork[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveArtwork(dataUrl: string): Artwork {
  const list = getArtworks()
  const now = new Date()
  const artwork: Artwork = {
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: `Obra del ${now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} ${now.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })}`,
    dataUrl,
    createdAt: now.getTime(),
  }
  const next = [artwork, ...list].slice(0, MAX_ARTWORKS)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(ARTWORKS_EVENT))
  return artwork
}

export function deleteArtwork(id: string) {
  const next = getArtworks().filter((a) => a.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(ARTWORKS_EVENT))
}
