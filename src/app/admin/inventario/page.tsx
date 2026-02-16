'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/AdminLayout'
import { formatPrice } from '@/lib/utils'
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Warehouse,
  MapPin
} from 'lucide-react'

export default function InventarioAdmin() {
  const { products } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'Todas las Categorías' },
    { id: 'vinilica', name: 'Pinturas Vinílicas' },
    { id: 'aerosol', name: 'Aerosoles' },
    { id: 'impermeabilizante', name: 'Impermeabilizantes' },
    { id: 'accesorio', name: 'Accesorios' }
  ]

  const locations = [
    { id: 'all', name: 'Todas las Ubicaciones' },
    { id: 'cdmx', name: 'Ciudad de México' },
    { id: 'merida', name: 'Mérida' }
  ]

  const stockFilters = [
    { id: 'all', name: 'Todos los Productos' },
    { id: 'in-stock', name: 'En Stock' },
    { id: 'low-stock', name: 'Stock Bajo (<10)' },
    { id: 'out-of-stock', name: 'Sin Stock' }
  ]

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      
      let matchesStock = true
      const stock = product.stock || 0
      
      switch (stockFilter) {
        case 'in-stock':
          matchesStock = stock > 10
          break
        case 'low-stock':
          matchesStock = stock > 0 && stock <= 10
          break
        case 'out-of-stock':
          matchesStock = stock === 0
          break
      }
      
      return matchesSearch && matchesCategory && matchesStock
    })

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { 
      status: 'Sin Stock', 
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-500'
    }
    if (stock <= 5) return { 
      status: 'Stock Crítico', 
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: TrendingDown,
      iconColor: 'text-red-500'
    }
    if (stock <= 10) return { 
      status: 'Stock Bajo', 
      color: 'text-orange-600 bg-orange-100 border-orange-200',
      icon: TrendingDown,
      iconColor: 'text-orange-500'
    }
    return { 
      status: 'En Stock', 
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: TrendingUp,
      iconColor: 'text-green-500'
    }
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
  const lowStockCount = products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
              <p className="text-gray-600 mt-2">
                Gestiona el stock y ubicaciones de tus productos
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Warehouse size={16} />
              <span>Total: {totalProducts} productos</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(totalValue)}</p>
                <p className="text-xs text-gray-500 mt-1">En inventario</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-3xl font-bold text-blue-600">{totalProducts - outOfStockCount}</p>
                <p className="text-xs text-gray-500 mt-1">Con stock disponible</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren reposición</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                <p className="text-xs text-gray-500 mt-1">Productos agotados</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {stockFilters.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Inventario ({filteredProducts.length} productos)
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter size={16} />
                <span>Filtros aplicados</span>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros para encontrar productos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unitario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const stock = product.stock || 0
                    const stockStatus = getStockStatus(stock)
                    const totalValue = product.price * stock
                    const StatusIcon = stockStatus.icon

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-lg opacity-50">🎨</div>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.brand} • {product.size}
                                {product.color && ` • ${product.color}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {stock} unidades
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                            <StatusIcon size={12} className={`mr-1 ${stockStatus.iconColor}`} />
                            {stockStatus.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-primary-600 hover:text-primary-700 p-1 rounded"
                            title="Ajustar inventario"
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
