'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from 'lucide-react'

export default function CarritoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/checkout'
    }, 1000)
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="text-4xl opacity-50">🛒</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega algunos productos para comenzar tu compra
            </p>
            <Link 
              href="/catalogo"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Continuar Comprando</span>
            </Link>
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
          <Link 
            href="/"
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Continuar Comprando</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Carrito de Compras ({cart.items.length} productos)
                </h1>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-2xl opacity-50">🎨</div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product.brand} • {item.product.size}
                        {item.product.color && ` • ${item.product.color}`}
                      </p>
                      <p className="text-lg font-bold text-primary-600 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CreditCard size={20} />
                <span>{isLoading ? 'Procesando...' : 'Proceder al Pago'}</span>
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Pago seguro con tarjeta de crédito o débito
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-sm">
                    <div className="text-green-600 font-semibold">✓</div>
                    <span className="text-gray-600">Envío Gratis</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-green-600 font-semibold">✓</div>
                    <span className="text-gray-600">Pago Seguro</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-green-600 font-semibold">✓</div>
                    <span className="text-gray-600">Garantía</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-green-600 font-semibold">✓</div>
                    <span className="text-gray-600">Soporte 24/7</span>
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
