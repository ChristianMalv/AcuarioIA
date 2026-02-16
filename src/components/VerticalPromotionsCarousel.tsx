'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Gift, Percent, ArrowRight, Tag, Zap, ChevronUp, ChevronDown } from 'lucide-react'

interface Promotion {
  id: string
  title: string
  subtitle: string
  description: string
  discount: string
  validUntil: string
  image: string
  ctaText: string
  ctaLink: string
  type: 'discount' | 'bundle' | 'seasonal' | 'flash'
  featured?: boolean
  active?: boolean
  order?: number
}

interface VerticalPromotionsCarouselProps {
  promotions: Promotion[]
  autoRotate?: boolean
  rotationInterval?: number
}

export default function VerticalPromotionsCarousel({ 
  promotions, 
  autoRotate = true, 
  rotationInterval = 4000 
}: VerticalPromotionsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isHovered || promotions.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
      )
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isHovered, promotions.length, rotationInterval])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? promotions.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === promotions.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (promotions.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-500">No hay promociones disponibles</p>
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Promociones Especiales
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprovecha nuestras ofertas exclusivas y ahorra en tus proyectos de pintura
          </p>
        </div>

        {/* Vertical Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Promotion Display */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl h-96 md:h-80">
            {promotions.map((promo, index) => (
              <div
                key={promo.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 transform translate-y-0' 
                    : index < currentIndex 
                      ? 'opacity-0 transform -translate-y-full'
                      : 'opacity-0 transform translate-y-full'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${
                    promo.type === 'flash' ? 'bg-gradient-to-r from-red-600/90 to-orange-600/90' :
                    promo.type === 'bundle' ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90' :
                    promo.type === 'seasonal' ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90' :
                    'bg-gradient-to-r from-primary-600/90 to-primary-700/90'
                  }`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 md:p-12 text-white h-full flex items-center">
                  <div className="w-full">
                    {/* Type Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      {promo.type === 'flash' && <Zap size={20} className="text-yellow-300" />}
                      {promo.type === 'bundle' && <Gift size={20} className="text-green-300" />}
                      {promo.type === 'discount' && <Percent size={20} className="text-blue-300" />}
                      {promo.type === 'seasonal' && <Tag size={20} className="text-purple-300" />}
                      
                      <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                        {promo.type === 'flash' ? 'Oferta Flash' :
                         promo.type === 'bundle' ? 'Pack Especial' :
                         promo.type === 'seasonal' ? 'Temporada' :
                         'Descuento'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Left Content */}
                      <div>
                        {/* Discount Badge */}
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                          <span className="text-3xl font-bold">{promo.discount}</span>
                          <span className="text-lg ml-1">OFF</span>
                        </div>

                        {/* Title and Subtitle */}
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {promo.title}
                        </h3>
                        <h4 className="text-xl font-semibold text-white/90 mb-4">
                          {promo.subtitle}
                        </h4>

                        {/* Description */}
                        <p className="text-lg text-white/80 mb-6">
                          {promo.description}
                        </p>

                        {/* Valid Until */}
                        <div className="flex items-center gap-2 mb-6 text-white/90">
                          <Clock size={16} />
                          <span className="text-sm">Válido hasta: {promo.validUntil}</span>
                        </div>
                      </div>

                      {/* Right Content - CTA */}
                      <div className="text-center md:text-right">
                        <Link
                          href={promo.ctaLink}
                          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                          <span>{promo.ctaText}</span>
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {promotions.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-4 right-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 text-white z-20"
                aria-label="Promoción anterior"
              >
                <ChevronUp size={20} />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 text-white z-20"
                aria-label="Siguiente promoción"
              >
                <ChevronDown size={20} />
              </button>
            </>
          )}

          {/* Indicators */}
          {promotions.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white/60 hover:bg-white/90 hover:scale-110'
                  }`}
                  aria-label={`Ir a promoción ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Promotion Counter */}
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm z-20">
            {currentIndex + 1} / {promotions.length}
          </div>
        </div>

        {/* Quick Navigation Thumbnails */}
        {promotions.length > 1 && (
          <div className="flex justify-center mt-8 space-x-4 overflow-x-auto pb-4">
            {promotions.map((promo, index) => (
              <button
                key={promo.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex 
                    ? 'border-primary-600 shadow-lg scale-105' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
