'use client'

import Link from 'next/link'
import { Clock, Gift, Percent, ArrowRight, Tag, Zap } from 'lucide-react'

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
}

const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Mega Descuento',
    subtitle: 'Pinturas Vinílicas',
    description: 'Hasta 30% de descuento en toda la línea de pinturas vinílicas premium',
    discount: '30%',
    validUntil: '31 de Enero',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop&crop=center&q=85',
    ctaText: 'Ver Ofertas',
    ctaLink: '/catalogo?category=vinilica&promo=true',
    type: 'discount',
    featured: true
  },
  {
    id: '2',
    title: 'Pack Completo',
    subtitle: 'Herramientas + Pintura',
    description: 'Llévate el kit completo: pintura + brocha + rodillo por un precio especial',
    discount: '25%',
    validUntil: '15 de Febrero',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center&q=85',
    ctaText: 'Ver Pack',
    ctaLink: '/catalogo?bundle=herramientas',
    type: 'bundle'
  },
  {
    id: '3',
    title: 'Oferta Flash',
    subtitle: 'Solo por Hoy',
    description: 'Aerosoles seleccionados con descuento especial por tiempo limitado',
    discount: '40%',
    validUntil: 'Hoy',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop&crop=center&q=85',
    ctaText: '¡Aprovecha!',
    ctaLink: '/catalogo?category=aerosol&flash=true',
    type: 'flash'
  }
]

const seasonalPromo = {
  title: 'Temporada de Renovación',
  subtitle: 'Enero - Febrero 2026',
  description: 'Renueva tu hogar con nuestras promociones especiales de temporada',
  features: [
    'Envío gratis en compras mayores a $1,500',
    'Asesoría técnica gratuita',
    'Garantía extendida en impermeabilizantes',
    'Descuentos progresivos por volumen'
  ],
  image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center&q=85'
}

export default function PromotionsSection() {
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

        {/* Main Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {promotions.map((promo, index) => (
            <div
              key={promo.id}
              className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group ${
                promo.featured ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${
                  promo.type === 'flash' ? 'bg-gradient-to-r from-red-600/90 to-orange-600/90' :
                  promo.type === 'bundle' ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90' :
                  promo.type === 'seasonal' ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90' :
                  'bg-gradient-to-r from-primary-600/90 to-primary-700/90'
                }`}></div>
              </div>

              {/* Content */}
              <div className={`relative z-10 p-8 text-white ${promo.featured ? 'lg:p-12' : ''}`}>
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

                {/* Discount Badge */}
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <span className="text-2xl font-bold">{promo.discount}</span>
                  <span className="text-sm ml-1">OFF</span>
                </div>

                {/* Title and Subtitle */}
                <h3 className={`font-bold text-white mb-2 ${promo.featured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
                  {promo.title}
                </h3>
                <h4 className={`font-semibold text-white/90 mb-4 ${promo.featured ? 'text-xl' : 'text-lg'}`}>
                  {promo.subtitle}
                </h4>

                {/* Description */}
                <p className={`text-white/80 mb-6 ${promo.featured ? 'text-lg' : 'text-base'}`}>
                  {promo.description}
                </p>

                {/* Valid Until */}
                <div className="flex items-center gap-2 mb-6 text-white/90">
                  <Clock size={16} />
                  <span className="text-sm">Válido hasta: {promo.validUntil}</span>
                </div>

                {/* CTA Button */}
                <Link
                  href={promo.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>{promo.ctaText}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Seasonal Promotion Banner */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-indigo-600 to-purple-700">
          <div className="absolute inset-0 opacity-20">
            <img
              src={seasonalPromo.image}
              alt={seasonalPromo.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Content */}
            <div className="text-white">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                {seasonalPromo.title}
              </h3>
              <p className="text-xl text-indigo-100 mb-6">
                {seasonalPromo.subtitle}
              </p>
              <p className="text-lg text-indigo-100 mb-8">
                {seasonalPromo.description}
              </p>
              
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <span>Explorar Ofertas</span>
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Features */}
            <div className="text-white">
              <h4 className="text-xl font-semibold mb-6">Beneficios Incluidos:</h4>
              <div className="space-y-4">
                {seasonalPromo.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-indigo-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
