'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { useLocation } from '@/contexts/LocationContext'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { useShipping } from '@/hooks/useShipping'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, CreditCard, Lock, Truck, Shield, MapPin, Clock } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { currentLocation } = useLocation()
  const { customer } = useCustomerAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  // Calculate shipping based on postal code
  const shippingInfo = useShipping(customerInfo.zipCode, cart.total)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      // Validar campos requeridos
      if (!customerInfo.name || !customerInfo.email || !customerInfo.address || 
          !customerInfo.city || !customerInfo.state || !customerInfo.zipCode) {
        setError('Por favor completa todos los campos requeridos')
        setIsProcessing(false)
        return
      }

      // Preparar datos del pedido
      const orderData = {
        customerInfo,
        items: cart.items,
        total: cart.total + shippingInfo.cost, // Incluir costo de envío
        shippingCost: shippingInfo.cost,
        shippingZone: shippingInfo.zone?.id,
        location: currentLocation || 'merida',
        customerId: customer?.id || null
      }

      // Simular procesamiento de pago (aquí iría la integración con Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Crear el pedido en la base de datos
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Limpiar carrito
        clearCart()
        
        // Redirigir a página de confirmación
        router.push(`/pedido-confirmado?orderId=${data.order.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al procesar el pedido')
      }
    } catch (err) {
      console.error('Error processing order:', err)
      setError('Error al procesar el pedido. Intenta nuevamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No hay productos en el carrito
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega productos antes de proceder al checkout
            </p>
            <button 
              onClick={() => router.push('/catalogo')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Volver al Carrito</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Información de Envío
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+52 (55) 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Calle Principal 123, Col. Centro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ciudad de México"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      name="state"
                      required
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar</option>
                      <option value="CDMX">Ciudad de México</option>
                      <option value="MEX">Estado de México</option>
                      <option value="JAL">Jalisco</option>
                      <option value="NL">Nuevo León</option>
                      <option value="PUE">Puebla</option>
                      <option value="YUC">Yucatán</option>
                      <option value="QRO">Querétaro</option>
                      <option value="GTO">Guanajuato</option>
                      <option value="VER">Veracruz</option>
                      <option value="TAB">Tabasco</option>
                      <option value="CAM">Campeche</option>
                      <option value="QROO">Quintana Roo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={customerInfo.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="06000"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Método de Pago
              </h2>

              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600"
                    />
                    <CreditCard className="text-primary-600" size={24} />
                    <div>
                      <div className="font-semibold">Tarjeta de Crédito/Débito</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 opacity-50">
                  <label className="flex items-center space-x-3 cursor-not-allowed">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      disabled
                      className="text-primary-600"
                    />
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div>
                      <div className="font-semibold">Transferencia Bancaria</div>
                      <div className="text-sm text-gray-600">Próximamente disponible</div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Pago Seguro con Stripe</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Tus datos de pago están protegidos con encriptación de nivel bancario
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-xl opacity-50">🎨</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pt-6 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Truck size={16} className="text-gray-600" />
                    <span className="text-gray-600">Envío</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${shippingInfo.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                      {shippingInfo.isFree ? 'Gratis' : formatPrice(shippingInfo.cost)}
                    </span>
                    {shippingInfo.zone && (
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{shippingInfo.estimatedDays}</span>
                      </div>
                    )}
                  </div>
                </div>
                {shippingInfo.reason && (
                  <div className="text-xs text-gray-500 italic">
                    {shippingInfo.reason}
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(cart.total + shippingInfo.cost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock size={20} />
                <span>{isProcessing ? 'Procesando Pago...' : 'Confirmar Pedido'}</span>
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="text-sm">
                    <Truck className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <span className="text-gray-600">Envío Gratis</span>
                  </div>
                  <div className="text-sm">
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <span className="text-gray-600">Pago Seguro</span>
                  </div>
                  <div className="text-sm">
                    <Lock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <span className="text-gray-600">SSL Protegido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
