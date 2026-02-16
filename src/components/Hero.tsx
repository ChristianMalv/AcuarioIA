import Link from 'next/link'
import { ArrowRight, Paintbrush, Shield, SprayCan } from 'lucide-react'
import HeroBanner from './HeroBanner'
import BestSellingProducts from './BestSellingProducts'
import VerticalPromotionsCarousel from './VerticalPromotionsCarousel'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Full-width carousel */}
      <div className="w-full">
        <HeroBanner />
      </div>
      
      
      {/* Best Selling Products Section */}
      <BestSellingProducts />
      
      {/* Promotions Section */}
      <VerticalPromotionsCarousel 
        promotions={[
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
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center&q=90',
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
            image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop&crop=center&q=90',
            ctaText: '¡Aprovecha!',
            ctaLink: '/catalogo?category=aerosol&flash=true',
            type: 'flash'
          }
        ]}
        autoRotate={true}
        rotationInterval={5000}
      />
    </section>
  )
}
