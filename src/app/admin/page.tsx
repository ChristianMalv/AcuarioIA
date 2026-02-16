'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useAuth, usePermissions } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  AlertTriangle,
  DollarSign
} from 'lucide-react'

export default function AdminDashboard() {
  const { products } = useAdmin()
  const { user } = useAuth()
  const permissions = usePermissions()

  const stats = {
    totalProducts: products.length,
    lowStockProducts: products.filter(p => (p.stock || 0) < 10).length,
    outOfStockProducts: products.filter(p => (p.stock || 0) === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0),
    categories: {
      vinilica: products.filter(p => p.category === 'vinilica').length,
      aerosol: products.filter(p => p.category === 'aerosol').length,
      impermeabilizante: products.filter(p => p.category === 'impermeabilizante').length,
      accesorio: products.filter(p => p.category === 'accesorio').length
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen general de tu tienda de pinturas Acuario
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Productos en catálogo</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total Inventario</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(stats.totalValue)}</p>
                <p className="text-xs text-gray-500 mt-1">Valor en productos</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Productos con poco stock</p>
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
                <p className="text-3xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Productos agotados</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Productos por Categoría</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Pinturas Vinílicas</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.categories.vinilica}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Aerosoles</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.categories.aerosol}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Impermeabilizantes</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.categories.impermeabilizante}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Accesorios</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{stats.categories.accesorio}</span>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Alertas de Stock</h2>
            {stats.lowStockProducts > 0 ? (
              <div className="space-y-4">
                {products
                  .filter(p => (p.stock || 0) < 10)
                  .slice(0, 5)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{product.stock || 0}</p>
                        <p className="text-xs text-orange-600">unidades</p>
                      </div>
                    </div>
                  ))}
                {stats.lowStockProducts > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    Y {stats.lowStockProducts - 5} productos más con stock bajo
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">¡Excelente! Todos los productos tienen stock suficiente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/productos/nuevo"
              className="flex items-center justify-center p-6 bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg hover:bg-primary-100 transition-colors group"
            >
              <div className="text-center">
                <Package className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-primary-700">Agregar Producto</p>
              </div>
            </a>
            
            <a
              href="/admin/productos"
              className="flex items-center justify-center p-6 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-blue-700">Gestionar Inventario</p>
              </div>
            </a>
            
            <a
              href="/admin/pedidos"
              className="flex items-center justify-center p-6 bg-green-50 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-green-700">Ver Pedidos</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
