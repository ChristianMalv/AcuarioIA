'use client'

import { useState } from 'react'
import { getFeaturedProducts } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useGoogleAnalytics } from '@/components/SEO/GoogleAnalytics'
import StructuredData from '@/components/SEO/StructuredData'

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<string[]>([])
  const featuredProducts = getFeaturedProducts()
  const { addToCart } = useCart()
  const { trackAddToCart, trackViewItem } = useGoogleAnalytics()

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los productos más populares y de mayor calidad de nuestra marca Acuario
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl opacity-20">🎨</div>
                  </div>
                )}
                
                {/* Overlay buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors">
                    <Eye size={18} className="text-gray-700" />
                  </button>
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Heart 
                      size={18} 
                      className={favorites.includes(product.id) ? "text-red-500 fill-current" : "text-gray-700"} 
                    />
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Destacado
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{product.size}</div>
                    {product.color && (
                      <div className="text-sm text-gray-500">{product.color}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Stock: {product.stock} unidades
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(product)
                      trackAddToCart(product.id, product.name, product.price, 1)
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart size={16} />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/catalogo"
            className="inline-block bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Ver Todos los Productos
          </a>
        </div>
      </div>

      {/* Datos estructurados para productos destacados */}
      {featuredProducts.map(product => (
        <StructuredData key={product.id} type="product" product={product} />
      ))}
    </section>
  )
}
