'use client'

import { useState } from 'react'
import { useStores } from '@/contexts/StoreContext'
import { MapPin, Phone, Clock, Navigation, MessageCircle, X, ChevronDown } from 'lucide-react'

interface StoreSelectorProps {
  isOpen: boolean
  onClose: () => void
  onStoreSelect?: (storeId: string) => void
  showWhatsAppButton?: boolean
  customMessage?: string
}

export default function StoreSelector({ 
  isOpen, 
  onClose, 
  onStoreSelect, 
  showWhatsAppButton = true,
  customMessage 
}: StoreSelectorProps) {
  const { 
    stores, 
    nearestStore, 
    isDetectingLocation, 
    findNearestStore, 
    getWhatsAppLink 
  } = useStores()
  
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId)
    if (onStoreSelect) {
      onStoreSelect(storeId)
    }
  }

  const handleWhatsAppContact = (storeId: string) => {
    const whatsappUrl = getWhatsAppLink(storeId, customMessage)
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <MapPin size={28} />
            <div>
              <h2 className="text-xl font-bold">Selecciona tu tienda más cercana</h2>
              <p className="text-primary-100 text-sm">4 ubicaciones en Mérida para servirte mejor</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Detección automática */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Encuentra tu tienda más cercana</h3>
                <p className="text-sm text-gray-600">
                  {nearestStore 
                    ? `Tienda sugerida: ${nearestStore.name}`
                    : 'Detecta automáticamente la tienda más cercana a tu ubicación'
                  }
                </p>
              </div>
              <button
                onClick={findNearestStore}
                disabled={isDetectingLocation}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDetectingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Detectando...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    <span>Detectar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de tiendas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => {
              const isNearest = nearestStore?.id === store.id
              const isSelected = selectedStore === store.id
              
              return (
                <div
                  key={store.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-600 bg-primary-50' 
                      : isNearest
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleStoreSelect(store.id)}
                >
                  {/* Badge de tienda más cercana */}
                  {isNearest && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                      <Navigation size={12} className="mr-1" />
                      Más cercana
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 mb-2">{store.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-primary-600" />
                      <span>{store.phone}</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Clock size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div>L-V: {store.hours.weekdays}</div>
                        <div>Sáb: {store.hours.saturday}</div>
                        <div>Dom: {store.hours.sunday}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
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
                      {store.services.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{store.services.length - 2} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón de WhatsApp */}
                  {showWhatsAppButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleWhatsAppContact(store.id)
                      }}
                      className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={16} />
                      <span>Contactar por WhatsApp</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">¿Por qué elegir la tienda más cercana?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Entrega más rápida de productos</li>
              <li>• Asesoría personalizada con nuestros expertos locales</li>
              <li>• Soporte técnico inmediato</li>
              <li>• Mejor conocimiento de productos disponibles en tu zona</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
