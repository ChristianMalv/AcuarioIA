'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle, Package, Truck, Mail, Phone } from 'lucide-react'

export default function OrdenExitosaPage() {
  const orderNumber = `AC-${Date.now().toString().slice(-6)}`

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pedido Confirmado!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              Tu pedido ha sido procesado exitosamente
            </p>
            
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-primary-600 font-medium mb-1">
                Número de Pedido
              </div>
              <div className="text-2xl font-bold text-primary-700">
                {orderNumber}
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Hemos enviado un email de confirmación con los detalles de tu pedido. 
              Nuestro equipo comenzará a preparar tu orden de inmediato.
            </p>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Estado de tu Pedido
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Pedido Confirmado</div>
                  <div className="text-sm text-gray-600">Tu pedido ha sido recibido y confirmado</div>
                </div>
                <div className="text-sm text-green-600 font-medium">Completado</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Preparando Pedido</div>
                  <div className="text-sm text-gray-600">Estamos preparando tus productos</div>
                </div>
                <div className="text-sm text-blue-600 font-medium">En Proceso</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-500">En Camino</div>
                  <div className="text-sm text-gray-400">Tu pedido será enviado pronto</div>
                </div>
                <div className="text-sm text-gray-400 font-medium">Pendiente</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ¿Qué sigue?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Confirmación por Email</div>
                  <div className="text-sm text-gray-600">
                    Recibirás un email con los detalles completos de tu pedido y número de seguimiento
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Preparación (1-2 días hábiles)</div>
                  <div className="text-sm text-gray-600">
                    Nuestro equipo preparará cuidadosamente tu pedido para el envío
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Envío (2-5 días hábiles)</div>
                  <div className="text-sm text-gray-600">
                    Tu pedido será enviado y recibirás información de seguimiento
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-primary-50 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              ¿Necesitas Ayuda?
            </h2>
            
            <p className="text-primary-800 mb-4">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-600" />
                <span className="text-primary-800">+52 (55) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-600" />
                <span className="text-primary-800">ventas@pinturasacuario.com</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/catalogo"
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
            >
              Seguir Comprando
            </Link>
            <Link 
              href="/"
              className="flex-1 bg-white text-primary-600 border-2 border-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
