'use client'

import { useState } from 'react'
import { useAuth, usePermissions } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  Filter,
  Search,
  Download
} from 'lucide-react'

// Datos de ejemplo de pedidos
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@email.com',
    customerPhone: '+52 999 123 4567',
    status: 'pending',
    total: 1250.00,
    items: [
      { name: 'Pintura Vinílica Blanca 4L', quantity: 2, price: 450.00 },
      { name: 'Rodillo Premium 9"', quantity: 1, price: 350.00 }
    ],
    shippingAddress: {
      street: 'Calle 60 No. 123',
      city: 'Mérida',
      state: 'Yucatán',
      zipCode: '97000'
    },
    orderDate: '2024-01-19T10:30:00Z',
    estimatedDelivery: '2024-01-22T00:00:00Z'
  },
  {
    id: 'ORD-002',
    customerName: 'María González',
    customerEmail: 'maria.gonzalez@email.com',
    customerPhone: '+52 55 987 6543',
    status: 'processing',
    total: 890.00,
    items: [
      { name: 'Aerosol Rojo Ferrari', quantity: 3, price: 180.00 },
      { name: 'Impermeabilizante 5 años', quantity: 1, price: 350.00 }
    ],
    shippingAddress: {
      street: 'Av. Insurgentes Sur 456',
      city: 'CDMX',
      state: 'Ciudad de México',
      zipCode: '03100'
    },
    orderDate: '2024-01-18T14:15:00Z',
    estimatedDelivery: '2024-01-21T00:00:00Z'
  },
  {
    id: 'ORD-003',
    customerName: 'Carlos Mendoza',
    customerEmail: 'carlos.mendoza@email.com',
    customerPhone: '+52 999 555 1234',
    status: 'completed',
    total: 2150.00,
    items: [
      { name: 'Pintura Vinílica Premium 4L', quantity: 3, price: 650.00 },
      { name: 'Brocha Profesional Set', quantity: 1, price: 200.00 }
    ],
    shippingAddress: {
      street: 'Calle 42 No. 789',
      city: 'Mérida',
      state: 'Yucatán',
      zipCode: '97200'
    },
    orderDate: '2024-01-17T09:45:00Z',
    estimatedDelivery: '2024-01-20T00:00:00Z'
  },
  {
    id: 'ORD-004',
    customerName: 'Ana Rodríguez',
    customerEmail: 'ana.rodriguez@email.com',
    customerPhone: '+52 999 777 8888',
    status: 'cancelled',
    total: 750.00,
    items: [
      { name: 'Pintura Vinílica Azul 1L', quantity: 5, price: 150.00 }
    ],
    shippingAddress: {
      street: 'Av. García Lavín 321',
      city: 'Mérida',
      state: 'Yucatán',
      zipCode: '97100'
    },
    orderDate: '2024-01-16T16:20:00Z',
    estimatedDelivery: null
  }
]

export default function PedidosPage() {
  const { user } = useAuth()
  const permissions = usePermissions()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />
      case 'processing':
        return <Package size={16} />
      case 'completed':
        return <CheckCircle size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'processing':
        return 'Procesando'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-600 mt-2">
                Gestiona y monitorea todos los pedidos de la tienda
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-sm">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{mockOrders.length}</p>
                <p className="text-xs text-gray-500 mt-1">Todos los pedidos</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {mockOrders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Esperando procesamiento</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-3xl font-bold text-green-600">
                  {mockOrders.filter(o => o.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pedidos entregados</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelados</p>
                <p className="text-3xl font-bold text-red-600">
                  {mockOrders.filter(o => o.status === 'cancelled').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pedidos cancelados</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="processing">Procesando</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                      >
                        <Eye size={16} />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay pedidos registrados en el sistema'
                }
              </p>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalle del Pedido</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID del Pedido</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span>{getStatusText(selectedOrder.status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.customerPhone}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Entrega</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-gray-500 mt-1" />
                        <div>
                          <p>{selectedOrder.shippingAddress.street}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                          <p>CP: {selectedOrder.shippingAddress.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-primary-600">{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha del Pedido</label>
                      <p className="text-gray-900">{formatDate(selectedOrder.orderDate)}</p>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Entrega Estimada</label>
                        <p className="text-gray-900">{formatDate(selectedOrder.estimatedDelivery)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
