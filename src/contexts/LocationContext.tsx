'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type City = 'cdmx' | 'merida'

interface LocationData {
  city: City
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  deliveryZones: string[]
  shippingCost: number
}

interface LocationContextType {
  currentLocation: LocationData
  isDetecting: boolean
  isLocationModalOpen: boolean
  setLocation: (city: City) => void
  detectLocation: () => Promise<void>
  openLocationModal: () => void
  closeLocationModal: () => void
  isInDeliveryZone: (userLocation?: { lat: number; lng: number }) => boolean
}

const locations: Record<City, LocationData> = {
  cdmx: {
    city: 'cdmx',
    name: 'Ciudad de México',
    coordinates: { lat: 19.4326, lng: -99.1332 },
    deliveryZones: [
      'Benito Juárez', 'Miguel Hidalgo', 'Cuauhtémoc', 'Coyoacán', 
      'Álvaro Obregón', 'Tlalpan', 'Iztapalapa', 'Gustavo A. Madero',
      'Venustiano Carranza', 'Azcapotzalco', 'Iztacalco', 'Cuajimalpa',
      'La Magdalena Contreras', 'Milpa Alta', 'Tláhuac', 'Xochimilco'
    ],
    shippingCost: 150
  },
  merida: {
    city: 'merida',
    name: 'Mérida, Yucatán',
    coordinates: { lat: 20.9674, lng: -89.5926 },
    deliveryZones: [
      'Centro', 'Norte', 'Itzimná', 'García Ginerés', 'Montejo',
      'Francisco de Montejo', 'Temozón Norte', 'Altabrisa', 'Gran Plaza',
      'Cholul', 'Dzityá', 'Conkal', 'Umán', 'Kanasín'
    ],
    shippingCost: 120
  }
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData>(locations.cdmx)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Marcar que estamos en el cliente después de la hidratación
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cargar ubicación guardada al inicializar (solo en el cliente)
  useEffect(() => {
    if (!isClient) return
    
    const savedLocation = localStorage.getItem('pinturas-acuario-location')
    if (savedLocation && (savedLocation === 'cdmx' || savedLocation === 'merida')) {
      setCurrentLocation(locations[savedLocation as City])
    } else {
      // Si no hay ubicación guardada, mostrar modal de selección
      setIsLocationModalOpen(true)
    }
  }, [isClient])

  const setLocation = (city: City) => {
    setCurrentLocation(locations[city])
    localStorage.setItem('pinturas-acuario-location', city)
    setIsLocationModalOpen(false)
  }

  const detectLocation = async (): Promise<void> => {
    setIsDetecting(true)
    
    try {
      // Intentar geolocalización del navegador
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          })
        })

        const { latitude, longitude } = position.coords
        
        // Determinar ciudad más cercana basada en coordenadas
        const distanceToCDMX = calculateDistance(
          latitude, longitude, 
          locations.cdmx.coordinates.lat, locations.cdmx.coordinates.lng
        )
        
        const distanceToMerida = calculateDistance(
          latitude, longitude,
          locations.merida.coordinates.lat, locations.merida.coordinates.lng
        )

        const nearestCity = distanceToCDMX < distanceToMerida ? 'cdmx' : 'merida'
        setLocation(nearestCity)
        
      } else {
        // Fallback: detectar por IP usando un servicio gratuito
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        
        // Determinar ciudad basada en el país/región
        if (data.country_code === 'MX') {
          // Si está en México, usar la región para determinar la ciudad
          const region = data.region?.toLowerCase() || ''
          if (region.includes('yucatan') || region.includes('yucatán')) {
            setLocation('merida')
          } else {
            setLocation('cdmx') // Por defecto CDMX para México
          }
        } else {
          // Si no está en México, por defecto CDMX
          setLocation('cdmx')
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error)
      // En caso de error, mostrar modal para selección manual
      setIsLocationModalOpen(true)
    } finally {
      setIsDetecting(false)
    }
  }

  const openLocationModal = () => setIsLocationModalOpen(true)
  const closeLocationModal = () => setIsLocationModalOpen(false)

  const isInDeliveryZone = (userLocation?: { lat: number; lng: number }): boolean => {
    if (!userLocation) return true // Si no hay ubicación específica, asumir que sí entregamos
    
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      currentLocation.coordinates.lat, currentLocation.coordinates.lng
    )
    
    // Radio de entrega: 50km para CDMX, 30km para Mérida
    const deliveryRadius = currentLocation.city === 'cdmx' ? 50 : 30
    return distance <= deliveryRadius
  }

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isDetecting,
      isLocationModalOpen,
      setLocation,
      detectLocation,
      openLocationModal,
      closeLocationModal,
      isInDeliveryZone
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

// Función auxiliar para calcular distancia entre dos puntos geográficos
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
