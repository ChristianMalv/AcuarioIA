'use client'

import { useState } from 'react'
import { useStores } from '@/contexts/StoreContext'
import { MessageCircle, Phone, Mail, Send, X, ExternalLink, MapPin } from 'lucide-react'

interface ContactChannel {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
  bgColor: string
  borderColor: string
  action: (storeId?: string, message?: string) => void
}

interface ContactChannelSelectorProps {
  isOpen: boolean
  onClose: () => void
  customMessage?: string
  productName?: string
}

export default function ContactChannelSelector({ 
  isOpen, 
  onClose, 
  customMessage,
  productName 
}: ContactChannelSelectorProps) {
  const { nearestStore, getWhatsAppLink, stores } = useStores()
  const [selectedStore, setSelectedStore] = useState<string | null>(nearestStore?.id || null)
  const [showStoreSelector, setShowStoreSelector] = useState(false)

  const getContactMessage = () => {
    if (customMessage) return customMessage
    if (productName) return `Hola, me interesa obtener más información sobre ${productName}.`
    return "Hola, me interesa obtener información sobre productos de Pinturas Acuario."
  }

  const contactChannels: ContactChannel[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle size={24} />,
      description: 'Chat directo con nuestros asesores. Respuesta inmediata.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: (storeId) => {
        if (storeId) {
          const whatsappUrl = getWhatsAppLink(storeId, getContactMessage())
          window.open(whatsappUrl, '_blank')
        }
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send size={24} />,
      description: 'Contacto vía Telegram. Soporte técnico especializado.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: (storeId) => {
        const store = stores.find(s => s.id === storeId)
        if (store) {
          // Asumiendo que las tiendas tendrán un campo telegram en el futuro
          const telegramUsername = store.id === 'cdmx-centro' ? 'pinturasacuario_cdmx' : 'pinturasacuario_merida'
          const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(getContactMessage())}`
          window.open(telegramUrl, '_blank')
        }
      }
    },
    {
      id: 'phone',
      name: 'Llamada Telefónica',
      icon: <Phone size={24} />,
      description: 'Habla directamente con nuestros expertos.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: (storeId) => {
        const store = stores.find(s => s.id === storeId)
        if (store) {
          window.open(`tel:${store.phone}`, '_self')
        }
      }
    },
    {
      id: 'email',
      name: 'Correo Electrónico',
      icon: <Mail size={24} />,
      description: 'Envía tu consulta detallada. Respuesta en 24 horas.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: (storeId) => {
        const store = stores.find(s => s.id === storeId)
        const subject = productName ? `Consulta sobre ${productName}` : 'Consulta sobre productos'
        const body = `${getContactMessage()}\n\nTienda de contacto: ${store?.name || 'No especificada'}`
        const emailUrl = `mailto:ventas@pinturasacuario.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(emailUrl, '_self')
      }
    }
  ]

  const handleChannelSelect = (channel: ContactChannel) => {
    if (!selectedStore) {
      setShowStoreSelector(true)
      return
    }
    
    channel.action(selectedStore, getContactMessage())
    onClose()
  }

  const selectedStoreData = stores.find(s => s.id === selectedStore)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <MessageCircle size={28} />
            <div>
              <h2 className="text-xl font-bold">¿Cómo prefieres contactarnos?</h2>
              <p className="text-primary-100 text-sm">Elige tu canal de comunicación favorito</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Tienda seleccionada */}
          {selectedStoreData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedStoreData.name.replace('Pinturas Acuario ', '')}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedStoreData.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStoreSelector(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Cambiar tienda
                </button>
              </div>
            </div>
          )}

          {!selectedStoreData && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">Selecciona una tienda</h3>
                  <p className="text-sm text-yellow-700">Elige la tienda más cercana para contactar</p>
                </div>
                <button
                  onClick={() => setShowStoreSelector(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Seleccionar tienda
                </button>
              </div>
            </div>
          )}

          {/* Canales de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Canales disponibles</h3>
            
            {contactChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelSelect(channel)}
                disabled={!selectedStoreData}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedStoreData 
                    ? `${channel.bgColor} ${channel.borderColor} hover:border-opacity-60` 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedStoreData ? channel.bgColor : 'bg-gray-100'
                  }`}>
                    <div className={selectedStoreData ? channel.color : 'text-gray-400'}>
                      {channel.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{channel.name}</h4>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para contactar</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>WhatsApp:</strong> Ideal para consultas rápidas y cotizaciones</li>
              <li>• <strong>Telegram:</strong> Perfecto para soporte técnico detallado</li>
              <li>• <strong>Teléfono:</strong> Para asesoría inmediata y personalizada</li>
              <li>• <strong>Email:</strong> Para consultas complejas con documentos adjuntos</li>
            </ul>
          </div>
        </div>

        {/* Selector de tienda modal */}
        {showStoreSelector && (
          <div className="absolute inset-0 bg-white rounded-2xl">
            <div className="bg-primary-600 text-white p-6 relative">
              <button
                onClick={() => setShowStoreSelector(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold">Selecciona tu tienda</h2>
              <p className="text-primary-100 text-sm">Elige la tienda más cercana a tu ubicación</p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-4">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store.id)
                      setShowStoreSelector(false)
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedStore === store.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {store.name.replace('Pinturas Acuario ', '')}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📞 {store.phone}</span>
                      <span>👤 {store.manager}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
