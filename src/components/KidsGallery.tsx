'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download, Trash2, Brush, X, ImageOff } from 'lucide-react'
import { ARTWORKS_EVENT, deleteArtwork, getArtworks, type Artwork } from '@/lib/kids-gallery'
import { useToast } from '@/contexts/ToastContext'

export default function KidsGallery({ onContinue }: { onContinue: (dataUrl: string) => void }) {
  const toast = useToast()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [viewer, setViewer] = useState<Artwork | null>(null)

  const refresh = useCallback(() => setArtworks(getArtworks()), [])

  useEffect(() => {
    refresh()
    window.addEventListener(ARTWORKS_EVENT, refresh)
    return () => window.removeEventListener(ARTWORKS_EVENT, refresh)
  }, [refresh])

  const download = (a: Artwork) => {
    const link = document.createElement('a')
    link.download = `${a.name}.png`
    link.href = a.dataUrl
    link.click()
  }

  const remove = (a: Artwork) => {
    if (confirm(`¿Borrar "${a.name}"?`)) {
      deleteArtwork(a.id)
      toast.info('Obra borrada', a.name)
      if (viewer?.id === a.id) setViewer(null)
    }
  }

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-gray-300 bg-white py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ImageOff className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Aún no hay obras guardadas</h3>
        <p className="mt-1 text-sm text-gray-600">
          Pinta algo en el lienzo y presiona «Guardar» para verlo aquí.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600">
        {artworks.length} {artworks.length === 1 ? 'obra guardada' : 'obras guardadas'} en este
        dispositivo
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setViewer(a)}
              className="block w-full bg-gray-50"
              title="Ver en grande"
            >
              <img src={a.dataUrl} alt={a.name} className="h-48 w-full object-contain" />
            </button>
            <div className="space-y-3 p-3">
              <div className="truncate text-sm font-medium text-gray-900" title={a.name}>
                {a.name}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onContinue(a.dataUrl)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  <Brush size={14} />
                  Seguir pintando
                </button>
                <button
                  type="button"
                  onClick={() => download(a)}
                  className="rounded-full border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
                  title="Descargar"
                >
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(a)}
                  className="rounded-full border border-gray-300 p-2 text-red-600 hover:bg-red-50"
                  title="Borrar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visor */}
      {viewer ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setViewer(null)}
        >
          <div
            className="relative max-h-full max-w-4xl overflow-hidden rounded-2xl bg-white p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewer(null)}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
              title="Cerrar"
            >
              <X size={18} />
            </button>
            <img
              src={viewer.dataUrl}
              alt={viewer.name}
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
            />
            <div className="mt-3 text-center text-sm font-medium text-gray-700">{viewer.name}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
