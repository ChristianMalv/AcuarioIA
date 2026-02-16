'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Heart, Filter, Search, Grid, List } from 'lucide-react'
import { Product } from '@/types'

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState<string>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])
  const { addToCart } = useCart()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          
          // Ajustar el rango de precios basado en los productos cargados
          if (data.length > 0) {
            const maxPrice = Math.max(...data.map((p: Product) => p.price))
            const adjustedMax = Math.ceil(maxPrice * 1.1) // 10% más que el precio máximo
            setPriceRange([0, Math.max(adjustedMax, 1000)]) // Mínimo 1000 para el rango
          }
        } else {
          console.error('Error fetching products:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(() => [
    { id: 'all', name: 'Todos los Productos', count: products.length },
    { id: 'vinilica', name: 'Pinturas Vinílicas', count: products.filter((p: Product) => p.category === 'vinilica').length },
    { id: 'aerosol', name: 'Aerosoles', count: products.filter((p: Product) => p.category === 'aerosol').length },
    { id: 'impermeabilizante', name: 'Impermeabilizantes', count: products.filter((p: Product) => p.category === 'impermeabilizante').length },
    { id: 'accesorio', name: 'Accesorios', count: products.filter((p: Product) => p.category === 'accesorio').length }
  ], [products])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          <p className="text-xl text-gray-600">
            Encuentra la pintura perfecta para tu proyecto
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Filter size={20} className="text-primary-600" />
                <h2 className="text-lg font-semibold">Filtros</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorías
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rango de Precio
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Mostrando {filteredProducts.length} productos
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="name">Ordenar por Nombre</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cargando productos...
                </h3>
                <p className="text-gray-600">
                  Por favor espera mientras cargamos el catálogo
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl opacity-20 mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros para encontrar lo que buscas
                </p>
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

                      {/* Badge */}
                      {product.featured && (
                        <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Destacado
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={viewMode === 'list' ? 'flex-1 ml-4' : 'p-6'}>
                      <div className={viewMode === 'list' ? 'flex items-center justify-between' : ''}>
                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="mb-2">
                            <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
                              {product.brand}
                            </span>
                          </div>
                          
                          <h3 className={`font-bold text-gray-900 mb-2 ${viewMode === 'list' ? 'text-lg' : 'text-lg'}`}>
                            {product.name}
                          </h3>
                          
                          <p className={`text-gray-600 text-sm mb-4 ${viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'}`}>
                            {product.description}
                          </p>

                          <div className={`flex items-center ${viewMode === 'list' ? 'space-x-4' : 'justify-between mb-4'}`}>
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
                        </div>

                        <div className={viewMode === 'list' ? 'ml-4 flex flex-col items-end space-y-2' : 'flex items-center justify-between'}>
                          <div className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                          >
                            <ShoppingCart size={16} />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
