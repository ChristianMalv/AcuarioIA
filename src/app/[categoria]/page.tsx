'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Heart, Filter, Grid, List, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { Product } from '@/types'

export default function CategoriaPage() {
  const params = useParams()
  const categoria = params.categoria as string
  const { products, loading } = useAdmin()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 1000])

  // Mapeo de categorías URL a nombres de categoría en la base de datos
  const categoryMap: Record<string, string> = {
    'vinilicas': 'vinilica',
    'aerosoles': 'aerosol',
    'impermeabilizantes': 'impermeabilizante',
    'accesorios': 'accesorio'
  }

  // Mapeo de nombres para mostrar
  const categoryNames: Record<string, string> = {
    'vinilicas': 'Pinturas Vinílicas',
    'aerosoles': 'Pinturas en Aerosol',
    'impermeabilizantes': 'Impermeabilizantes',
    'accesorios': 'Accesorios'
  }

  const dbCategory = categoryMap[categoria]
  const categoryName = categoryNames[categoria] || categoria

  // Filtrar productos por categoría
  const categoryProducts = products.filter(product => 
    product.category === dbCategory
  )

  // Aplicar filtros y ordenamiento
  const filteredProducts = categoryProducts
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'stock-low':
          return a.stock - b.stock
        case 'stock-high':
          return b.stock - a.stock
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si la categoría no existe, mostrar 404
  if (!dbCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Categoría no encontrada</p>
              <Link 
                href="/"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb y Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-primary-600">Inicio</Link>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryName}</h1>
              <p className="text-gray-600">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Link 
              href="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </Link>
          </div>
        </div>

        {/* Controles de filtro y vista */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Nombre</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="stock-low">Stock: Menor a Mayor</option>
                  <option value="stock-high">Stock: Mayor a Menor</option>
                </select>
              </div>
            </div>

            {/* Controles de vista */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Vista:</span>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos en esta categoría</h3>
            <p className="text-gray-600 mb-6">Aún no tenemos productos disponibles en {categoryName.toLowerCase()}.</p>
            <Link 
              href="/catalogo"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                viewMode === 'list' ? 'flex items-center p-4' : ''
              }`}>
                {/* Image */}
                <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${
                  viewMode === 'list' ? 'w-24 h-24 rounded-lg flex-shrink-0' : 'h-64'
                }`}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={viewMode === 'list' ? 'text-3xl opacity-20' : 'text-6xl opacity-20'}>🎨</div>
                    </div>
                  )}
                  
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
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
                </div>

                {/* Content */}
                <div className={viewMode === 'list' ? 'flex-1 ml-4' : 'p-6'}>
                  <div className="mb-2">
                    <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
                      {product.brand}
                    </span>
                  </div>
                  
                  <h3 className={`font-bold text-gray-900 mb-2 ${viewMode === 'list' ? 'text-lg' : 'text-xl'} line-clamp-2`}>
                    {product.name}
                  </h3>
                  
                  <p className={`text-gray-600 mb-4 ${viewMode === 'list' ? 'text-sm' : ''} line-clamp-2`}>
                    {product.description}
                  </p>

                  <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mb-2' : 'mb-4'}`}>
                    <div>
                      <span className={`font-bold text-primary-600 ${viewMode === 'list' ? 'text-lg' : 'text-2xl'}`}>
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
                      onClick={() => addToCart(product)}
                      className={`bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 ${
                        viewMode === 'list' ? 'px-3 py-1 text-sm' : 'px-4 py-2'
                      }`}
                    >
                      <ShoppingCart size={viewMode === 'list' ? 14 : 16} />
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
