'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface PhysicalStore {
  id: string
  city: 'cdmx' | 'merida'
  name: string
  address: string
  googleMapsUrl?: string
  googleMapsEmbedSrc?: string
  coordinates: {
    lat: number
    lng: number
  }
  phone: string
  whatsapp: string
  telegram?: string
  email?: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  manager: string
  services: string[]
  zone: string
}

interface StoreContextType {
  stores: PhysicalStore[]
  nearestStore: PhysicalStore | null
  isDetectingLocation: boolean
  findNearestStore: () => Promise<void>
  getStoreByZone: (zone: string) => PhysicalStore[]
  getStoresByCity: (city: 'cdmx' | 'merida') => PhysicalStore[]
  getWhatsAppLink: (storeId: string, message?: string) => string
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
}

// Tienda física en CDMX
const cdmxStores: PhysicalStore[] = [
  {
    id: 'cdmx-centro',
    city: 'cdmx',
    name: 'Pinturas Acuario CDMX',
    address: 'Av. Insurgentes Sur No. 1234, Col. Del Valle, Benito Juárez, CDMX',
    coordinates: { lat: 19.3910, lng: -99.1620 },
    phone: '+52 55 1234 5678',
    whatsapp: '5215512345678',
    telegram: 'pinturasacuario_cdmx',
    email: 'cdmx@pinturasacuario.com',
    hours: {
      weekdays: '8:00 AM - 7:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 3:00 PM'
    },
    manager: 'Luis Hernández',
    services: ['Venta', 'Asesoría técnica', 'Entrega a domicilio', 'Servicio express'],
    zone: 'centro'
  }
]

// Tiendas físicas en Mérida
const meridaStores: PhysicalStore[] = [
  {
    id: 'Dorada',
    city: 'merida',
    name: 'Pinturas Acuario Dorada',
    address: 'C. 50 130-Interior 4, Miguel Hidalgo, 97220 Mérida, Yuc.',
    googleMapsUrl: 'https://maps.app.goo.gl/bmcq8Wiz2bCQjBY27',
    coordinates: { lat: 20.9808, lng: -89.6235 },
    phone: '+52 999 495 0415',
    whatsapp: '5219994950415',
    email: 'dorada@pinturasacuario.com',
    hours: {
      weekdays: '8:30 AM - 6:30 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Cerrado'
    },
    manager: 'Luis García',
    services: ['Venta', 'Asesoría técnica', 'Mezcla de colores', 'Entrega a domicilio'],
    zone: 'norte'
  },
  {
    id: 'Canek',
    city: 'merida',
    name: 'Pinturas Acuario Canek',
    address: 'Av Jacinto Canek 252-A, Yucalpetén, 97238 Mérida, Yuc.',
    googleMapsUrl: 'https://maps.app.goo.gl/RUKuCmMugmc4FzWDA',
    googleMapsEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.1416827397497!2d-89.66226492474456!3d20.986956980651932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5673475d478cd7%3A0x30d23a36cb7a4df9!2sPinturas%20Acuario%20Canek!5e0!3m2!1ses-419!2smx!4v1776798734749!5m2!1ses-419!2smx',
    coordinates: { lat: 20.9673, lng: -89.5925 },
    phone: '+52 999 995 1776',
    whatsapp: '5219999951776',
    telegram: 'pinturasacuario_canek',
    email: 'canek@pinturasacuario.com',
    hours: {
       weekdays: '8:30 AM - 6:30 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Cerrado'
    },
    manager: 'Ana Rodríguez',
    services: ['Venta', 'Asesoría técnica', 'Capacitación', 'Servicio express'],
    zone: 'norte'
  },
  {
    id: 'Caucel',
    city: 'merida',
    name: 'Pinturas Acuario Caucel',
    address: 'Calle 114 37a-y 29c, Local 4, 97314 Mérida, Yuc.',
    googleMapsUrl: 'https://maps.app.goo.gl/d7Fhq7NMfQxBvhvW8',
    coordinates: { lat: 20.985959, lng: -89.655823 },
    phone: '+52 999 334 0058',
    whatsapp: '5219993340058',
    telegram: 'pinturasacuario_caucel',
    email: 'caucel@pinturasacuario.com',
    hours: {
      weekdays: '8:30 AM - 6:30 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Cerrado'
    },
    manager: 'Roberto Vázquez',
    services: ['Venta', 'Asesoría técnica', 'Mezcla de colores', 'Productos industriales'],
    zone: 'sur'
  },
  {
    id: 'Circuito Sur',
    city: 'merida',
    name: 'Pinturas Acuario Circuito Sur',
    address: 'Calle 396, Cto. Colonias Col, Dolores Otero, 97270 Mérida, Yuc.',
    googleMapsUrl: 'https://maps.app.goo.gl/rxFbpXQiDsPhbqMM9',
    coordinates: { lat: 20.9678, lng: -89.6217 },
    phone: '+52 1 999 122 1942',
    whatsapp: '5219991221942',
    telegram: 'pinturasacuario_circuitosur',
    email: 'circuitosur@pinturasacuario.com',
    hours: {
      weekdays: '8:30 AM - 6:30 PM',
      saturday: '9:00 AM - 3:00 PM',
      sunday: 'Cerrado'
    },
    manager: 'María González',
    services: ['Venta', 'Asesoría técnica', 'Herramientas', 'Capacitación técnica'],
    zone: 'oriente'
  }
]

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<PhysicalStore[]>([...cdmxStores, ...meridaStores])
  const [nearestStore, setNearestStore] = useState<PhysicalStore | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
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

  const findNearestStore = async (): Promise<void> => {
    setIsDetectingLocation(true)
    
    try {
      const candidateStores = stores.filter(store => store.city === 'merida')
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          })
        })

        const { latitude, longitude } = position.coords
        
        // Calcular distancia a cada tienda
        const storesWithDistance = candidateStores.map(store => ({
          ...store,
          distance: calculateDistance(latitude, longitude, store.coordinates.lat, store.coordinates.lng)
        }))

        // Encontrar la tienda más cercana
        const nearest = storesWithDistance.reduce((prev, current) => 
          prev.distance < current.distance ? prev : current
        )

        setNearestStore(nearest)
        
        // Guardar en localStorage para futuras visitas
        localStorage.setItem('pinturas-acuario-nearest-store', nearest.id)
        
      } else {
        // Si no hay geolocalización, usar Mérida por defecto
        setNearestStore(candidateStores[0] || stores[0])
      }
    } catch (error) {
      console.error('Error detecting location:', error)
      // En caso de error, usar Mérida por defecto
      const candidateStores = stores.filter(store => store.city === 'merida')
      setNearestStore(candidateStores[0] || stores[0])
    } finally {
      setIsDetectingLocation(false)
    }
  }

  const getStoreByZone = (zone: string): PhysicalStore[] => {
    return stores.filter(store => store.zone === zone)
  }

  const getStoresByCity = (city: 'cdmx' | 'merida'): PhysicalStore[] => {
    return stores.filter(store => store.city === city)
  }

  const getWhatsAppLink = (storeId: string, message?: string): string => {
    const store = stores.find(s => s.id === storeId)
    if (!store) return ''

    const defaultMessage = `Hola, me interesa obtener información sobre productos de Pinturas Acuario. Estoy contactando desde la tienda ${store.name}.`
    const finalMessage = message || defaultMessage
    
    return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(finalMessage)}`
  }

  // Cargar tienda más cercana guardada al inicializar
  useEffect(() => {
    const savedStoreId = localStorage.getItem('pinturas-acuario-nearest-store')
    if (savedStoreId) {
      const savedStore = stores.find(store => store.id === savedStoreId)
      if (savedStore) {
        setNearestStore(savedStore)
      }
    }
  }, [stores])

  return (
    <StoreContext.Provider value={{
      stores,
      nearestStore,
      isDetectingLocation,
      findNearestStore,
      getStoreByZone,
      getStoresByCity,
      getWhatsAppLink,
      calculateDistance
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStores() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider')
  }
  return context
}
