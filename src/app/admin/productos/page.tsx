'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useToast } from '@/contexts/ToastContext'
import AdminLayout from '@/components/AdminLayout'
import { formatPrice } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function ProductosAdmin() {
  const { products, deleteProduct } = useAdmin()
  const { success, error } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const categories = [
    { id: 'all', name: 'Todas las Categorías' },
    { id: 'vinilica', name: 'Pinturas Vinílicas' },
    { id: 'aerosol', name: 'Aerosoles' },
    { id: 'impermeabilizante', name: 'Impermeabilizantes' },
    { id: 'accesorio', name: 'Accesorios' }
  ]

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'stock-low':
          return (a.stock || 0) - (b.stock || 0)
        case 'stock-high':
          return (b.stock || 0) - (a.stock || 0)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      try {
        await deleteProduct(productId)
        success('Producto eliminado', `"${productName}" ha sido eliminado exitosamente.`)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el producto. Por favor intenta de nuevo.'
        error('Error al eliminar producto', errorMessage)
      }
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Sin stock', color: 'text-red-600 bg-red-100' }
    if (stock < 10) return { status: 'Stock bajo', color: 'text-orange-600 bg-orange-100' }
    return { status: 'En stock', color: 'text-green-600 bg-green-100' }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
              <p className="text-gray-600 mt-2">
                Administra tu catálogo de pinturas y accesorios
              </p>
            </div>
            <Link
              href="/admin/productos/nuevo"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus size={20} />
              <span>Agregar Producto</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="stock-low">Stock: Menor a Mayor</option>
              <option value="stock-high">Stock: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Productos ({filteredProducts.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Package size={16} />
                <span>Total: {products.length} productos</span>
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
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Intenta ajustar los filtros para encontrar productos'
                  : 'Comienza agregando tu primer producto al catálogo'
                }
              </p>
              <Link
                href="/admin/productos/nuevo"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Agregar Producto</span>
              </Link>
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
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0)
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock || 0} unidades
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/productos/${product.id}`}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded"
                              title="Ver detalles"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/admin/productos/${product.id}/editar`}
                              className="text-green-600 hover:text-green-700 p-1 rounded"
                              title="Editar producto"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="text-red-600 hover:text-red-700 p-1 rounded"
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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
