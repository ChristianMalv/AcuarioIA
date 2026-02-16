'use client'

import { useState } from 'react'
import { useStores } from '@/contexts/StoreContext'
import { useLocation } from '@/contexts/LocationContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreSelector from '@/components/StoreSelector'
import { ContactSectionButton } from '@/components/ContactPageButton'
import { MapPin, Phone, Clock, Mail, MessageCircle, Navigation, Users, Award } from 'lucide-react'

export default function ContactoPage() {
  const { stores, nearestStore, findNearestStore, getWhatsAppLink, getStoresByCity } = useStores()
  const { currentLocation } = useLocation()
  const [showStoreSelector, setShowStoreSelector] = useState(false)

  // Filtrar tiendas según la ubicación actual
  const relevantStores = getStoresByCity(currentLocation.city === 'merida' ? 'merida' : 'cdmx')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte con todos tus proyectos de pintura. 
            {currentLocation.city === 'merida' 
              ? ' Visítanos en cualquiera de nuestras 4 tiendas en Mérida.'
              : ' Contáctanos para información sobre entregas en tu área.'
            }
          </p>
        </div>

        {/* Información de contacto general */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Información principal */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información General</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono Principal</h3>
                  <p className="text-gray-600">+52 (55) 1234-5678</p>
                  <p className="text-sm text-gray-500">Lunes a Viernes: 8:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">ventas@pinturasacuario.com</p>
                  <p className="text-sm text-gray-500">Respuesta en menos de 24 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Cobertura</h3>
                  <p className="text-gray-600">Ciudad de México y Mérida, Yucatán</p>
                  <p className="text-sm text-gray-500">Entregas a domicilio disponibles</p>
                </div>
              </div>
            </div>

            {/* Botón de contacto inteligente */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <ContactSectionButton />
            </div>
          </div>

          {/* Estadísticas y beneficios */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegirnos?</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="text-primary-600" size={32} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">15+</h3>
                  <p className="text-sm text-gray-600">Años de experiencia</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-primary-600" size={32} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">5000+</h3>
                  <p className="text-sm text-gray-600">Clientes satisfechos</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="text-primary-600" size={32} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">
                    {currentLocation.city === 'merida' ? '4' : '2'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentLocation.city === 'merida' ? 'Tiendas en Mérida' : 'Ciudades de cobertura'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="text-primary-600" size={32} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">24h</h3>
                  <p className="text-sm text-gray-600">Respuesta promedio</p>
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nuestros Servicios</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Asesoría técnica especializada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Mezcla de colores personalizada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Entrega a domicilio</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Capacitación en aplicación</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tiendas físicas */}
        {relevantStores.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {currentLocation.city === 'merida' 
                  ? 'Nuestras Tiendas en Mérida' 
                  : 'Nuestra Tienda en CDMX'
                }
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {currentLocation.city === 'merida'
                  ? 'Visítanos en cualquiera de nuestras 4 ubicaciones estratégicas'
                  : 'Visítanos en nuestra tienda física en la Ciudad de México'
                }
              </p>
              
              {nearestStore && (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <Navigation size={16} />
                  <span className="text-sm font-medium">
                    Tienda más cercana: {nearestStore.name.replace('Pinturas Acuario ', '')}
                  </span>
                </div>
              )}
            </div>

            <div className={`grid gap-6 mb-8 ${
              currentLocation.city === 'merida' 
                ? 'md:grid-cols-2 lg:grid-cols-4' 
                : 'md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto'
            }`}>
              {relevantStores.map((store) => {
                const isNearest = nearestStore?.id === store.id
                
                return (
                  <div
                    key={store.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl ${
                      isNearest ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    {isNearest && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
                        <Navigation size={12} className="mr-1" />
                        Más cercana
                      </div>
                    )}

                    <h3 className="font-bold text-gray-900 mb-3">
                      {store.name.replace('Pinturas Acuario ', '')}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin size={14} className="text-primary-600 mt-0.5 flex-shrink-0" />
                        <span>{store.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-primary-600" />
                        <span>{store.phone}</span>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Clock size={14} className="text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>L-V: {store.hours.weekdays}</div>
                          <div>Sáb: {store.hours.saturday}</div>
                          <div>Dom: {store.hours.sunday}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Gerente: {store.manager}</p>
                      <div className="flex flex-wrap gap-1">
                        {store.services.slice(0, 2).map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const whatsappUrl = getWhatsAppLink(store.id)
                        window.open(whatsappUrl, '_blank')
                      }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowStoreSelector(true)}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                {currentLocation.city === 'merida' 
                  ? 'Ver Todas las Tiendas en Mapa' 
                  : 'Ver Información Detallada'
                }
              </button>
            </div>
          </div>
        )}


        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Hacen entregas a domicilio?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sí, realizamos entregas en {currentLocation.name} y área metropolitana. 
                El costo de envío varía según la distancia y el monto de la compra.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">¿Ofrecen asesoría técnica?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Absolutamente. Nuestros expertos te ayudan a elegir el producto correcto 
                para tu proyecto y te dan consejos de aplicación.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Tienen servicio de mezcla de colores?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sí, en nuestras tiendas físicas de Mérida ofrecemos servicio de mezcla 
                de colores personalizada para lograr el tono exacto que necesitas.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">¿Cuáles son los horarios de atención?</h3>
              <p className="text-gray-600 text-sm">
                Lunes a Viernes: 8:00 AM - 7:00 PM<br />
                Sábados: 8:00 AM - 6:00 PM<br />
                Domingos: Varía por tienda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selector de tiendas */}
      <StoreSelector
        isOpen={showStoreSelector}
        onClose={() => setShowStoreSelector(false)}
      />

      <Footer />
    </div>
  )
}
