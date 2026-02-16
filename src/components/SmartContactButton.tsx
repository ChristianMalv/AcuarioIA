'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useStores } from '@/contexts/StoreContext'
import { useLocation } from '@/contexts/LocationContext'
import StoreSelector from './StoreSelector'
import ContactChannelSelector from './ContactChannelSelector'
import { MessageCircle, MapPin, Phone } from 'lucide-react'

interface SmartContactButtonProps {
  variant?: 'floating' | 'inline' | 'header'
  customMessage?: string
  autoDetect?: boolean
  className?: string
  productName?: string
  useChannelSelector?: boolean
}

export default function SmartContactButton({ 
  variant = 'floating',
  customMessage,
  autoDetect = true,
  className = '',
  productName,
  useChannelSelector = false
}: SmartContactButtonProps) {
  const { nearestStore, findNearestStore, getWhatsAppLink, isDetectingLocation } = useStores()
  const [showStoreSelector, setShowStoreSelector] = useState(false)
  const [showChannelSelector, setShowChannelSelector] = useState(false)
  const [hasAutoDetected, setHasAutoDetected] = useState(false)

  // Auto-detectar tienda más cercana al cargar el componente
  useEffect(() => {
    if (autoDetect && !nearestStore && !hasAutoDetected) {
      findNearestStore()
      setHasAutoDetected(true)
    }
  }, [autoDetect, nearestStore, hasAutoDetected, findNearestStore])

  const handleDirectContact = () => {
    if (useChannelSelector) {
      setShowChannelSelector(true)
    } else {
      // Comportamiento original para compatibilidad
      if (nearestStore) {
        const whatsappUrl = getWhatsAppLink(nearestStore.id, customMessage)
        window.open(whatsappUrl, '_blank')
      } else {
        setShowStoreSelector(true)
      }
    }
  }

  const getButtonContent = () => {
    if (isDetectingLocation) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          <span>Detectando...</span>
        </>
      )
    }

    if (nearestStore) {
      return (
        <>
          <MessageCircle size={20} />
          <span>Contactar {nearestStore.name.replace('Pinturas Acuario ', '')}</span>
        </>
      )
    }

    if (useChannelSelector) {
      return (
        <>
          <MessageCircle size={20} />
          <span>Contactar</span>
        </>
      )
    }

    return (
      <>
        <MessageCircle size={20} />
        <span>Contactar por WhatsApp</span>
      </>
    )
  }

  // Estilos según la variante
  const getButtonStyles = () => {
    const baseStyles = "flex items-center space-x-2 font-semibold transition-all duration-300"
    
    switch (variant) {
      case 'floating':
        return `${baseStyles} fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl z-40 ${className}`
      
      case 'inline':
        return `${baseStyles} bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 ${className}`
      
      case 'header':
        return `${baseStyles} bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm ${className}`
      
      default:
        return `${baseStyles} ${className}`
    }
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handleDirectContact}
          className={getButtonStyles()}
          disabled={isDetectingLocation}
        >
          {getButtonContent()}
        </button>

        {/* Botón secundario para cambiar tienda (solo en variante floating) */}
        {variant === 'floating' && nearestStore && (
          <button
            onClick={() => setShowStoreSelector(true)}
            className="fixed bottom-6 right-6 translate-y-16 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 z-40"
            title="Cambiar tienda"
          >
            <MapPin size={16} />
          </button>
        )}

        {/* Información de tienda seleccionada (solo en variante inline) */}
        {variant === 'inline' && nearestStore && (
          <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
            <MapPin size={14} />
            <span>{nearestStore.name}</span>
            <button
              onClick={() => setShowStoreSelector(true)}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Cambiar
            </button>
          </div>
        )}
      </div>

      {/* Modal de selección de tienda */}
      <StoreSelector
        isOpen={showStoreSelector}
        onClose={() => setShowStoreSelector(false)}
        customMessage={customMessage}
        onStoreSelect={() => setShowStoreSelector(false)}
      />

      {/* Modal de selección de canal de contacto */}
      <ContactChannelSelector
        isOpen={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        customMessage={customMessage}
        productName={productName}
      />
    </>
  )
}

// Componente específico para el header
export function HeaderContactButton() {
  return (
    <SmartContactButton 
      variant="header"
      customMessage="Hola, me interesa obtener información sobre sus productos de pinturas."
    />
  )
}

// Componente específico para páginas de productos
export function ProductContactButton({ productName }: { productName?: string }) {
  const customMessage = productName 
    ? `Hola, me interesa obtener más información sobre ${productName}.`
    : "Hola, me interesa obtener información sobre este producto."

  return (
    <SmartContactButton 
      variant="inline"
      customMessage={customMessage}
      productName={productName}
      className="w-full"
    />
  )
}

// Componente flotante para toda la aplicación
export function FloatingContactButton() {
  const pathname = usePathname()
  
  // Ocultar en páginas de administrador
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return (
    <SmartContactButton 
      variant="floating"
      customMessage="Hola, me interesa obtener información sobre productos de Pinturas Acuario."
    />
  )
}
