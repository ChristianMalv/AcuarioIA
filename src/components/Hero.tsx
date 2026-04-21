import Link from 'next/link'
import { ArrowRight, Paintbrush, Shield, SprayCan } from 'lucide-react'
import HeroBanner from './HeroBanner'
import BestSellingProducts from './BestSellingProducts'
import PromotionsWithCarousel from './PromotionsWithCarousel'

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
      <PromotionsWithCarousel />
    </section>
  )
}
