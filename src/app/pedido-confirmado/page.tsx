'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle, Package, Truck, Clock, MapPin, Phone, Mail } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image?: string
  }
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  total: number
  status: string
  location: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        setError('No se pudo cargar la información del pedido')
      }
    } catch (err) {
      setError('Error al cargar el pedido')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pendiente de Confirmación',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock
        }
      case 'processing':
        return {
          text: 'En Preparación',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: Package
        }
      case 'completed':
        return {
          text: 'Entregado',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle
        }
      default:
        return {
          text: 'Pendiente',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: Clock
        }
    }
  }

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order?.createdAt || '')
    const deliveryDate = new Date(orderDate)
    deliveryDate.setDate(deliveryDate.getDate() + (order?.location === 'cdmx' ? 2 : 1))
    
    return deliveryDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del pedido...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-red-600 mb-4">
              <Package size={48} className="mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error al cargar el pedido
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-gray-600 mb-4">
                Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos pronto.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-600">Número de Pedido</p>
                <p className="text-xl font-bold text-primary-600">#{order.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Estado del Pedido</h2>
                <div className={`${statusInfo.bgColor} rounded-lg p-4 flex items-center space-x-3`}>
                  <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                  <div>
                    <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
                    <p className="text-sm text-gray-600">
                      Entrega estimada: {getEstimatedDelivery()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Entrega</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-gray-600">{order.shippingAddress}</p>
                    </div>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-600">{order.customerPhone}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-600">{order.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Envío</h2>
                <div className="flex items-center space-x-3 text-green-600 mb-3">
                  <Truck className="w-6 h-6" />
                  <span className="font-semibold">Envío Gratuito</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Tu pedido será entregado en {order.location === 'cdmx' ? '1-2 días hábiles' : '24 horas'} 
                  en {order.location === 'cdmx' ? 'CDMX' : 'Mérida'}.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(order.total / 1.16)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span className="font-semibold">{formatPrice(order.total - (order.total / 1.16))}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              Recibirás un email de confirmación con los detalles de tu pedido.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Seguir Comprando
              </button>
              <button 
                onClick={() => router.push('/perfil')}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ver Mis Pedidos
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
