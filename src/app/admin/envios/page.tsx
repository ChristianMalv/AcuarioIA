'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { shippingZones, ShippingZone } from '@/lib/shipping'
import { formatPrice } from '@/lib/utils'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package
} from 'lucide-react'

export default function EnviosAdmin() {
  const [zones, setZones] = useState<ShippingZone[]>(shippingZones)
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone)
    setShowForm(true)
  }

  const handleDeleteZone = (zoneId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta zona de envío?')) {
      setZones(zones.filter(z => z.id !== zoneId))
    }
  }

  const handleSaveZone = (zoneData: Partial<ShippingZone>) => {
    if (editingZone) {
      // Editar zona existente
      setZones(zones.map(z => 
        z.id === editingZone.id 
          ? { ...z, ...zoneData }
          : z
      ))
    } else {
      // Crear nueva zona
      const newZone: ShippingZone = {
        id: `zone-${Date.now()}`,
        name: zoneData.name || '',
        postalCodeRanges: zoneData.postalCodeRanges || [],
        cost: zoneData.cost || 0,
        freeShippingThreshold: zoneData.freeShippingThreshold,
        estimatedDays: zoneData.estimatedDays || '',
        description: zoneData.description || ''
      }
      setZones([...zones, newZone])
    }
    setShowForm(false)
    setEditingZone(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Envíos</h1>
              <p className="text-gray-600 mt-2">
                Administra zonas de envío y costos por código postal
              </p>
            </div>
            <button
              onClick={() => {
                setEditingZone(null)
                setShowForm(true)
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus size={20} />
              <span>Nueva Zona</span>
            </button>
          </div>
        </div>

        {/* Shipping Zones Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Zonas de Envío ({zones.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck size={16} />
                <span>Configuración activa</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Códigos Postales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Envío Gratis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Estimado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <MapPin size={16} className="text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {zone.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {zone.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {zone.postalCodeRanges.map((range, index) => (
                          <div key={index} className="text-sm text-gray-900">
                            {range.start} - {range.end}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className={`text-sm font-medium ${zone.cost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {zone.cost === 0 ? 'Gratis' : formatPrice(zone.cost)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {zone.freeShippingThreshold 
                          ? `Desde ${formatPrice(zone.freeShippingThreshold)}`
                          : 'No aplica'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {zone.estimatedDays}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="text-green-600 hover:text-green-700 p-1 rounded"
                          title="Editar zona"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                          title="Eliminar zona"
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
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Zonas Activas</h3>
                <p className="text-2xl font-bold text-blue-600">{zones.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Envío Gratis</h3>
                <p className="text-2xl font-bold text-green-600">
                  {zones.filter(z => z.cost === 0).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Costo Promedio</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {formatPrice(zones.reduce((sum, z) => sum + z.cost, 0) / zones.length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar/crear zona - Aquí puedes agregar un formulario modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingZone ? 'Editar Zona de Envío' : 'Nueva Zona de Envío'}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de formulario pendiente de implementación
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
