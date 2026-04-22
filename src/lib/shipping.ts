export interface ShippingZone {
  id: string
  name: string
  postalCodeRanges: {
    start: string
    end: string
  }[]
  cost: number
  freeShippingThreshold?: number
  estimatedDays: string
  description: string
}

export const shippingZones: ShippingZone[] = [
  {
    id: 'merida-centro',
    name: 'Mérida Centro',
    postalCodeRanges: [
      { start: '97000', end: '97139' }
    ],
    cost: 0, // Gratis en zona centro
    estimatedDays: '1-2 días',
    description: 'Entrega gratuita en zona centro de Mérida'
  },
  {
    id: 'merida-metropolitana',
    name: 'Área Metropolitana de Mérida',
    postalCodeRanges: [
      { start: '97140', end: '97399' }
    ],
    cost: 50,
    freeShippingThreshold: 1000,
    estimatedDays: '2-3 días',
    description: 'Zona metropolitana de Mérida'
  }
]

export function getShippingCostByPostalCode(postalCode: string, orderTotal: number): {
  zone: ShippingZone | null
  cost: number
  isFree: boolean
  reason: string
} {
  // Limpiar código postal
  const cleanPostalCode = postalCode.replace(/\D/g, '').padStart(5, '0')
  
  // Buscar zona correspondiente
  for (const zone of shippingZones) {
    for (const range of zone.postalCodeRanges) {
      if (cleanPostalCode >= range.start && cleanPostalCode <= range.end) {
        // Verificar si califica para envío gratis
        const isFree = zone.cost === 0 || 
          (zone.freeShippingThreshold !== undefined && orderTotal >= zone.freeShippingThreshold)
        
        const reason = zone.cost === 0 
          ? 'Envío gratuito en esta zona'
          : isFree 
            ? `Envío gratis por compra mayor a $${zone.freeShippingThreshold}`
            : `Costo de envío a ${zone.name}`
        
        return {
          zone,
          cost: isFree ? 0 : zone.cost,
          isFree,
          reason
        }
      }
    }
  }

  return {
    zone: null,
    cost: 0,
    isFree: false,
    reason: 'Por el momento solo entregamos en Mérida, Yucatán'
  }
}

export function validatePostalCode(postalCode: string): boolean {
  const cleanPostalCode = postalCode.replace(/\D/g, '')
  return cleanPostalCode.length === 5 && /^\d{5}$/.test(cleanPostalCode)
}

export function formatPostalCode(postalCode: string): string {
  return postalCode.replace(/\D/g, '').padStart(5, '0')
}
