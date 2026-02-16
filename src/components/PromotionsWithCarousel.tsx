'use client'

import { useState, useEffect } from 'react'
import VerticalPromotionsCarousel from './VerticalPromotionsCarousel'

// Sample promotions data - this will be replaced with API data
const samplePromotions = [
  {
    id: '1',
    title: 'Mega Descuento',
    subtitle: 'Pinturas Vinílicas',
    description: 'Hasta 30% de descuento en toda la línea de pinturas vinílicas premium',
    discount: '30%',
    validUntil: '31 de Enero',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1920&h=1080&fit=crop&crop=center&q=90',
    ctaText: 'Ver Ofertas',
    ctaLink: '/catalogo?category=vinilica&promo=true',
    type: 'discount' as const,
    featured: true,
    active: true,
    order: 0
  },
  {
    id: '2',
    title: 'Pack Completo',
    subtitle: 'Herramientas + Pintura',
    description: 'Llévate el kit completo: pintura + brocha + rodillo por un precio especial',
    discount: '25%',
    validUntil: '15 de Febrero',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center&q=90',
    ctaText: 'Ver Pack',
    ctaLink: '/catalogo?bundle=herramientas',
    type: 'bundle' as const,
    active: true,
    order: 1
  },
  {
    id: '3',
    title: 'Oferta Flash',
    subtitle: 'Solo por Hoy',
    description: 'Aerosoles seleccionados con descuento especial por tiempo limitado',
    discount: '40%',
    validUntil: 'Hoy',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop&crop=center&q=90',
    ctaText: '¡Aprovecha!',
    ctaLink: '/catalogo?category=aerosol&flash=true',
    type: 'flash' as const,
    active: true,
    order: 2
  }
]

export default function PromotionsWithCarousel() {
  const [promotions, setPromotions] = useState(samplePromotions)
  const [loading, setLoading] = useState(false)

  // Future: Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call when database is ready
        // const response = await fetch('/api/promotions?active=true')
        // if (response.ok) {
        //   const data = await response.json()
        //   setPromotions(data)
        // }
        
        // For now, use sample data
        setPromotions(samplePromotions)
      } catch (error) {
        console.error('Error fetching promotions:', error)
        // Fallback to sample data
        setPromotions(samplePromotions)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    )
  }

  return (
    <VerticalPromotionsCarousel 
      promotions={promotions}
      autoRotate={true}
      rotationInterval={5000}
    />
  )
}
