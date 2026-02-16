'use client'

import Link from 'next/link'
import { Star, ShoppingCart, Eye } from 'lucide-react'

interface BestSellingProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  badge?: string
  isNew?: boolean
}

const bestSellingProducts: BestSellingProduct[] = [
  {
    id: '1',
    name: 'Pintura Vinílica Blanco Hueso 4L',
    price: 285.50,
    originalPrice: 320.00,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop&crop=center&q=85',
    rating: 4.8,
    reviewCount: 127,
    category: 'Vinílica',
    badge: 'Más Vendido'
  },
  {
    id: '2',
    name: 'Aerosol Rojo Ferrari 400ml',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&crop=center&q=85',
    rating: 4.6,
    reviewCount: 89,
    category: 'Aerosol',
    badge: 'Oferta'
  },
  {
    id: '3',
    name: 'Impermeabilizante Acrílico 19L',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&crop=center&q=85',
    rating: 4.9,
    reviewCount: 156,
    category: 'Impermeabilizante',
    badge: 'Premium'
  },
  {
    id: '4',
    name: 'Brocha Profesional 4"',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center&q=85',
    rating: 4.7,
    reviewCount: 203,
    category: 'Herramienta',
    isNew: true
  }
]

export default function BestSellingProducts() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Productos Más Vendidos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los favoritos de nuestros clientes. Productos de calidad comprobada con las mejores reseñas.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bestSellingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.badge && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                      product.badge === 'Más Vendido' ? 'bg-red-500' :
                      product.badge === 'Oferta' ? 'bg-green-500' :
                      product.badge === 'Premium' ? 'bg-purple-500' :
                      'bg-blue-500'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">
                      Nuevo
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 transition-colors">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 transition-colors">
                    <ShoppingCart size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                  {product.category}
                </span>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {product.originalPrice && (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <span>Ver Todos los Productos</span>
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
