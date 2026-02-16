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
  },
  {
    id: 'yucatan-interior',
    name: 'Interior de Yucatán',
    postalCodeRanges: [
      { start: '97400', end: '97999' }
    ],
    cost: 120,
    freeShippingThreshold: 1500,
    estimatedDays: '3-5 días',
    description: 'Municipios del interior de Yucatán'
  },
  {
    id: 'cdmx',
    name: 'Ciudad de México',
    postalCodeRanges: [
      { start: '01000', end: '16999' }
    ],
    cost: 150,
    freeShippingThreshold: 2000,
    estimatedDays: '3-5 días',
    description: 'Ciudad de México y área metropolitana'
  },
  {
    id: 'estado-mexico',
    name: 'Estado de México',
    postalCodeRanges: [
      { start: '50000', end: '56999' }
    ],
    cost: 180,
    freeShippingThreshold: 2000,
    estimatedDays: '4-6 días',
    description: 'Estado de México'
  },
  {
    id: 'peninsula-yucatan',
    name: 'Península de Yucatán',
    postalCodeRanges: [
      { start: '24000', end: '24999' }, // Campeche
      { start: '77000', end: '77999' }  // Quintana Roo
    ],
    cost: 200,
    freeShippingThreshold: 2500,
    estimatedDays: '4-7 días',
    description: 'Campeche y Quintana Roo'
  },
  {
    id: 'nacional',
    name: 'Resto del País',
    postalCodeRanges: [
      { start: '00000', end: '99999' } // Catch-all para otros códigos
    ],
    cost: 300,
    freeShippingThreshold: 3000,
    estimatedDays: '5-10 días',
    description: 'Envío nacional a toda la República'
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
  
  // Si no se encuentra zona específica, usar nacional
  const nationalZone = shippingZones.find(z => z.id === 'nacional')!
  const isFree = nationalZone.freeShippingThreshold !== undefined && orderTotal >= nationalZone.freeShippingThreshold
  
  return {
    zone: nationalZone,
    cost: isFree ? 0 : nationalZone.cost,
    isFree: Boolean(isFree),
    reason: isFree 
      ? `Envío gratis por compra mayor a $${nationalZone.freeShippingThreshold}`
      : 'Costo de envío nacional'
  }
}

export function validatePostalCode(postalCode: string): boolean {
  const cleanPostalCode = postalCode.replace(/\D/g, '')
  return cleanPostalCode.length === 5 && /^\d{5}$/.test(cleanPostalCode)
}

export function formatPostalCode(postalCode: string): string {
  return postalCode.replace(/\D/g, '').padStart(5, '0')
}
