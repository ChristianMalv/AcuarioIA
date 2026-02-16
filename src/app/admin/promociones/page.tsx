'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import AdminProtection from '@/components/AdminProtection'
import AdminHeader from '@/components/AdminHeader'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Calendar, Tag } from 'lucide-react'

interface Promotion {
  id: string
  title: string
  subtitle: string
  description: string
  discount: string
  validUntil: string
  image: string
  ctaText: string
  ctaLink: string
  type: 'discount' | 'bundle' | 'seasonal' | 'flash'
  featured: boolean
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function PromotionsAdmin() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/promotions')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data)
      } else {
        error('Error', 'No se pudieron cargar las promociones')
      }
    } catch (err) {
      error('Error', 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      })

      if (response.ok) {
        success('Éxito', `Promoción ${!currentActive ? 'activada' : 'desactivada'}`)
        fetchPromotions()
      } else {
        error('Error', 'No se pudo actualizar la promoción')
      }
    } catch (err) {
      error('Error', 'Error al actualizar la promoción')
    }
  }

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })

      if (response.ok) {
        success('Éxito', 'Orden actualizado')
        fetchPromotions()
      } else {
        error('Error', 'No se pudo actualizar el orden')
      }
    } catch (err) {
      error('Error', 'Error al actualizar el orden')
    }
  }

  const deletePromotion = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) {
      try {
        const response = await fetch(`/api/promotions/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          success('Éxito', 'Promoción eliminada exitosamente')
          fetchPromotions()
        } else {
          error('Error', 'No se pudo eliminar la promoción')
        }
      } catch (err) {
        error('Error', 'Error al eliminar la promoción')
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flash': return 'bg-red-100 text-red-800'
      case 'bundle': return 'bg-green-100 text-green-800'
      case 'seasonal': return 'bg-purple-100 text-purple-800'
      case 'discount': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flash': return 'Flash'
      case 'bundle': return 'Pack'
      case 'seasonal': return 'Temporada'
      case 'discount': return 'Descuento'
      default: return type
    }
  }

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </AdminProtection>
    )
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
              <p className="text-gray-600 mt-2">
                Administra las promociones que se muestran en la página principal
              </p>
            </div>
            <Link
              href="/admin/promociones/nueva"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nueva Promoción</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotions.filter(p => p.active).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Por Vencer</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotions.filter(p => {
                      const validUntil = new Date(p.validUntil)
                      const today = new Date()
                      const diffDays = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      return diffDays <= 7 && diffDays > 0
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destacadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotions.filter(p => p.featured).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Promociones</h2>
            </div>
            
            {promotions.length === 0 ? (
              <div className="p-8 text-center">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay promociones</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primera promoción.
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/promociones/nueva"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Nueva Promoción
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promoción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Válido Hasta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {promotions.map((promotion) => (
                      <tr key={promotion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={promotion.image}
                                alt={promotion.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {promotion.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {promotion.subtitle}
                              </div>
                              {promotion.featured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Destacada
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(promotion.type)}`}>
                            {getTypeLabel(promotion.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {promotion.discount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(promotion.validUntil).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActive(promotion.id, promotion.active)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              promotion.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {promotion.active ? (
                              <>
                                <Eye size={12} className="mr-1" />
                                Activa
                              </>
                            ) : (
                              <>
                                <EyeOff size={12} className="mr-1" />
                                Inactiva
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => updateOrder(promotion.id, promotion.order - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={promotion.order === 0}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <span className="w-8 text-center">{promotion.order}</span>
                            <button
                              onClick={() => updateOrder(promotion.id, promotion.order + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/promociones/${promotion.id}/editar`}
                              className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => deletePromotion(promotion.id, promotion.title)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtection>
  )
}
