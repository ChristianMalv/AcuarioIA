'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PaintCanvasGame, { type PaintCanvasGameHandle } from '@/components/PaintCanvasGame'
import KidsGallery from '@/components/KidsGallery'
import { ARTWORKS_EVENT, getArtworks } from '@/lib/kids-gallery'
import { Palette, MousePointerClick, Download, Gamepad2, Images } from 'lucide-react'

export default function NinosPage() {
  const [tab, setTab] = useState<'jugar' | 'galeria'>('jugar')
  const [artCount, setArtCount] = useState(0)
  const gameRef = useRef<PaintCanvasGameHandle>(null)

  useEffect(() => {
    const update = () => setArtCount(getArtworks().length)
    update()
    window.addEventListener(ARTWORKS_EVENT, update)
    return () => window.removeEventListener(ARTWORKS_EVENT, update)
  }, [])

  const handleContinue = (dataUrl: string) => {
    setTab('jugar')
    gameRef.current?.loadImage(dataUrl)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1 text-sm font-semibold text-primary-700 mb-4">
            Acuario Kids
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Lanza pintura al lienzo!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige tu color favorito, apunta y lanza chorros de pintura sobre el lienzo.
            También puedes pintar con la brocha y descargar tu obra maestra.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mb-4 flex max-w-5xl justify-center">
          <div className="flex rounded-full border border-gray-200 bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setTab('jugar')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === 'jugar' ? 'bg-primary-600 text-white shadow' : 'text-gray-700 hover:bg-white'
              }`}
            >
              <Gamepad2 size={18} />
              Jugar
            </button>
            <button
              type="button"
              onClick={() => setTab('galeria')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === 'galeria' ? 'bg-primary-600 text-white shadow' : 'text-gray-700 hover:bg-white'
              }`}
            >
              <Images size={18} />
              Mis obras{artCount > 0 ? ` (${artCount})` : ''}
            </button>
          </div>
        </div>

        {/* Juego (siempre montado para conservar el dibujo) */}
        <div
          className={`mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ${
            tab === 'jugar' ? '' : 'hidden'
          }`}
        >
          <PaintCanvasGame ref={gameRef} />
        </div>

        {/* Galería */}
        {tab === 'galeria' ? (
          <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <KidsGallery onContinue={handleContinue} />
          </div>
        ) : null}

        {/* Pasos */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Palette className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">1. Elige tu color</h3>
            <p className="mt-1 text-sm text-gray-600">
              Toca un círculo de la paleta para escoger tu pintura
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <MousePointerClick className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">2. Apunta y lanza</h3>
            <p className="mt-1 text-sm text-gray-600">
              Mantén presionado el lienzo, arrastra para apuntar y suelta para lanzar
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Download className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">3. Guarda tu obra</h3>
            <p className="mt-1 text-sm text-gray-600">
              Guárdala en tu galería, descárgala o sigue pintándola después
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
