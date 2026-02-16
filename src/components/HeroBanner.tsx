'use client'

import ImageCarousel from './ImageCarousel'
import { useEffect, useState } from 'react'

type HeroCarouselImage = {
  id: string | number
  src: string
  alt: string
  title?: string
  description?: string
  layersJson?: string | null
  textJson?: string | null
}

type CarouselImageFit = 'cover' | 'contain'

const heroImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1920&h=1080&fit=crop&crop=center&q=90',
    alt: 'Pinturas Vinílicas de Alta Calidad',
    title: 'Pinturas Vinílicas Premium',
    description: 'Máxima cobertura y durabilidad para tus proyectos'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop&crop=center&q=90',
    alt: 'Aerosoles Profesionales',
    title: 'Aerosoles de Secado Rápido',
    description: 'Acabados perfectos para cualquier superficie'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop&crop=center&q=90',
    alt: 'Impermeabilizantes Resistentes',
    title: 'Impermeabilizantes de 10 Años',
    description: 'Protección garantizada contra filtraciones'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center&q=90',
    alt: 'Herramientas Profesionales',
    title: 'Herramientas de Calidad',
    description: 'Brochas, rodillos y accesorios profesionales'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1920&h=1080&fit=crop&crop=center&q=90',
    alt: 'Asesoría Técnica Especializada',
    title: 'Asesoría Técnica Gratuita',
    description: 'Expertos que te ayudan a elegir el producto correcto'
  }
]

interface ApiCarouselSlide {
  id: string
  image: string
  alt: string
  title?: string | null
  description?: string | null
  layersJson?: string | null
  textJson?: string | null
}

export default function HeroBanner() {
  const [images, setImages] = useState<HeroCarouselImage[]>(heroImages)
  const [imageFit, setImageFit] = useState<CarouselImageFit>('contain')

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await fetch('/api/carousel?active=true')
        if (!response.ok) return
        const data: ApiCarouselSlide[] = await response.json()
        if (!Array.isArray(data) || data.length === 0) return

        setImages(
          data.map((s) => ({
            id: s.id,
            src: s.image,
            alt: s.alt,
            title: s.title || undefined,
            description: s.description || undefined,
            layersJson: s.layersJson ?? null,
            textJson: s.textJson ?? null
          }))
        )
      } catch {
        // fallback to hardcoded images
      }
    }

    fetchCarousel()
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings?keys=carouselImageFit')
        if (!response.ok) return
        const data = await response.json()
        const fit = data?.carouselImageFit
        if (fit === 'cover' || fit === 'contain') {
          setImageFit(fit)
        }
      } catch {
        // ignore
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="relative w-full">
      <ImageCarousel
        images={images}
        autoRotate={true}
        rotationInterval={5000}
        showIndicators={true}
        showArrows={true}
        imageFit={imageFit}
        className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[400px] max-h-[800px]"
      />
    </div>
  )
}
