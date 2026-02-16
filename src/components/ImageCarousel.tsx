'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
  id: string | number
  src: string
  alt: string
  title?: string
  description?: string
  layersJson?: string | null
  textJson?: string | null
}

type LayerPos = {
  x: number
  y: number
  w: number
}

type LayerDef = {
  id: string
  src: string
  z?: number
  pos: LayerPos
  posMobile?: LayerPos
}

type LayersPayload = {
  base?: { src: string; fit?: 'cover' | 'contain' }
  layers: LayerDef[]
}

type TextPayload = {
  color?: string
  x?: number
  y?: number
  align?: 'left' | 'center' | 'right'
  titleSize?: number
  descriptionSize?: number
}

function parseTextJson(raw: string | null | undefined): TextPayload | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    return parsed as TextPayload
  } catch {
    return null
  }
}

function isValidRenderableSrc(src: unknown): src is string {
  return typeof src === 'string' && src.trim().length > 0 && !src.startsWith('blob:')
}

function parseLayersJson(raw: string | null | undefined): LayersPayload | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const p = parsed as any
    if (!Array.isArray(p.layers)) return null
    return p as LayersPayload
  } catch {
    return null
  }
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function layerStyle(pos: LayerPos): React.CSSProperties {
  return {
    left: `${clampPct(pos.x)}%`,
    top: `${clampPct(pos.y)}%`,
    width: `${clampPct(pos.w)}%`,
  }
}

interface ImageCarouselProps {
  images: CarouselImage[]
  autoRotate?: boolean
  rotationInterval?: number
  showIndicators?: boolean
  showArrows?: boolean
  imageFit?: 'cover' | 'contain'
  className?: string
}

export default function ImageCarousel({
  images,
  autoRotate = true,
  rotationInterval = 4000,
  showIndicators = true,
  showArrows = true,
  imageFit = 'cover',
  className = ''
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  const imageFitClass = imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => {
      setIsMobile(window.innerWidth < 768)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isHovered, images.length, rotationInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  if (images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden ${className.includes('w-full h-[') ? '' : 'rounded-xl shadow-lg'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {(() => {
              const payload = parseLayersJson(image.layersJson)
              if (!payload) {
                return (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-full ${imageFitClass} cursor-pointer`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onClick={(e) => {
                      e.preventDefault()
                      goToNext()
                    }}
                  />
                )
              }

              const baseFit = payload.base?.fit ?? imageFit
              const baseFitClass = baseFit === 'contain' ? 'object-contain bg-black' : 'object-cover'
              const baseSrc = isValidRenderableSrc(payload.base?.src) ? payload.base!.src : image.src

              return (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    goToNext()
                  }}
                >
                  <img
                    src={baseSrc}
                    alt={image.alt}
                    className={`w-full h-full ${baseFitClass}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    {payload.layers
                      .slice()
                      .sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
                      .filter((l) => isValidRenderableSrc(l.src))
                      .map((l) => {
                        const pos = isMobile && l.posMobile ? l.posMobile : l.pos
                        return (
                          <div
                            key={l.id}
                            className="absolute"
                            style={{ ...layerStyle(pos), zIndex: l.z ?? 0 }}
                          >
                            <img src={l.src} alt="" className="w-full h-auto" loading="lazy" />
                          </div>
                        )
                      })}
                  </div>
                </div>
              )
            })()}
            
            {/* Click areas for navigation */}
            <div className="absolute inset-0 flex z-10">
              {/* Left click area - Previous */}
              <div 
                className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToPrevious()
                }}
                title="Imagen anterior"
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <ChevronLeft size={20} className="text-white" />
                </div>
              </div>
              
              {/* Right click area - Next */}
              <div 
                className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToNext()
                }}
                title="Siguiente imagen"
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <ChevronRight size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Overlay with text if provided */}
            {(image.title || image.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end pointer-events-none">
                {(() => {
                  const text = parseTextJson(image.textJson)
                  const x = clampPct(text?.x ?? 4)
                  const y = clampPct(text?.y ?? 70)
                  const align = text?.align ?? 'left'
                  const color = (typeof text?.color === 'string' && text.color.trim()) ? text.color.trim() : '#ffffff'

                  const titleSize = text?.titleSize
                  const descSize = text?.descriptionSize

                  const overlayStyle: React.CSSProperties = {
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translateY(-100%)',
                    color,
                    textAlign: align,
                  }

                  const overlayClass =
                    align === 'center'
                      ? 'absolute -translate-x-1/2'
                      : align === 'right'
                        ? 'absolute -translate-x-full'
                        : 'absolute'

                  return (
                    <div className={`${overlayClass} max-w-[90%]`} style={overlayStyle}>
                      <div className="p-6 md:p-10">
                        {image.title && (
                          <div
                            className="font-carousel-headline tracking-[0.25em] uppercase opacity-95 drop-shadow"
                            style={titleSize ? { fontSize: `${Math.max(10, titleSize)}px` } : undefined}
                          >
                            {image.title}
                          </div>
                        )}
                        {image.description && (
                          <div
                            className="font-carousel-display uppercase leading-[0.95] tracking-[0.02em] drop-shadow-sm mt-2"
                            style={
                              descSize
                                ? { fontSize: `${Math.max(14, descSize)}px` }
                                : undefined
                            }
                          >
                            {image.description}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToSlide(index)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/60 hover:bg-white/90 hover:scale-110'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Interactive hint */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
            Haz clic para navegar
          </div>
        </div>
      )}

      {/* Hover effect for arrows */}
      <div className="absolute inset-0 group"></div>
    </div>
  )
}
