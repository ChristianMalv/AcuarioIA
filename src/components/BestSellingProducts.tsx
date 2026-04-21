'use client'

import Link from 'next/link'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@/types'

type BestSellingBadge = 'Más Vendido' | 'Oferta' | 'Premium' | 'Nuevo'

interface BestSellingConfigItem {
  id: string
  badge?: BestSellingBadge
  isNew?: boolean
}

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

function categoryLabel(category: Product['category']): string {
  if (category === 'vinilica') return 'Vinílica'
  if (category === 'aerosol') return 'Aerosol'
  if (category === 'impermeabilizante') return 'Impermeabilizante'
  return 'Accesorio'
}

export default function BestSellingProducts() {
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<BestSellingConfigItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [settingsRes, productsRes] = await Promise.all([
          fetch('/api/settings?keys=bestSellingProductIds,bestSellingConfig'),
          fetch('/api/products')
        ])

        if (settingsRes.ok) {
          const data = await settingsRes.json().catch(() => null)
          const raw = data?.bestSellingProductIds
          if (typeof raw === 'string' && raw.trim().length > 0) {
            try {
              const parsed = JSON.parse(raw)
              if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
                setSelectedIds(parsed)
              }
            } catch {
              // ignore
            }
          }

          const rawConfig = data?.bestSellingConfig
          if (typeof rawConfig === 'string' && rawConfig.trim().length > 0) {
            try {
              const parsed = JSON.parse(rawConfig)
              if (
                Array.isArray(parsed) &&
                parsed.every((x) => x && typeof x === 'object' && typeof x.id === 'string')
              ) {
                setConfig(
                  (parsed as any[]).map((x) => ({
                    id: String(x.id),
                    badge:
                      x.badge === 'Más Vendido' ||
                      x.badge === 'Oferta' ||
                      x.badge === 'Premium' ||
                      x.badge === 'Nuevo'
                        ? x.badge
                        : undefined,
                    isNew: typeof x.isNew === 'boolean' ? x.isNew : undefined
                  }))
                )
              }
            } catch {
              // ignore
            }
          }
        }

        if (productsRes.ok) {
          const data = await productsRes.json().catch(() => [])
          if (Array.isArray(data)) setProducts(data as Product[])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const bestSellingProducts: BestSellingProduct[] = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]))
    const cfgById = new Map(config.map((c) => [c.id, c]))
    const selected = selectedIds
      .map((id) => map.get(id))
      .filter(Boolean) as Product[]

    return selected.map((p) => ({
      ...(() => {
        const cfg = cfgById.get(p.id)
        const cfgBadge = cfg?.badge

        if (cfgBadge === 'Nuevo') {
          return {
            badge: undefined,
            isNew: true
          }
        }

        return {
          badge: cfgBadge ?? 'Más Vendido',
          isNew: cfg?.isNew ?? false
        }
      })(),
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image || (p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url ?? ''),
      rating: 5,
      reviewCount: 0,
      category: categoryLabel(p.category)
    }))
  }, [products, selectedIds, config])

  if (!loading && bestSellingProducts.length === 0) return null

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
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100" />
                )}
                
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
