import { useState, useEffect } from 'react'
import { getShippingCostByPostalCode, validatePostalCode, ShippingZone } from '@/lib/shipping'

interface ShippingInfo {
  cost: number
  zone: ShippingZone | null
  isFree: boolean
  reason: string
  isValid: boolean
  estimatedDays: string
}

export function useShipping(postalCode: string, orderTotal: number): ShippingInfo {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    cost: 0,
    zone: null,
    isFree: true,
    reason: 'Ingresa tu código postal para calcular envío',
    isValid: false,
    estimatedDays: ''
  })

  useEffect(() => {
    if (!postalCode || postalCode.length === 0) {
      setShippingInfo({
        cost: 0,
        zone: null,
        isFree: true,
        reason: 'Ingresa tu código postal para calcular envío',
        isValid: false,
        estimatedDays: ''
      })
      return
    }

    const isValidPostalCode = validatePostalCode(postalCode)
    
    if (!isValidPostalCode) {
      setShippingInfo({
        cost: 0,
        zone: null,
        isFree: false,
        reason: 'Código postal inválido',
        isValid: false,
        estimatedDays: ''
      })
      return
    }

    const shipping = getShippingCostByPostalCode(postalCode, orderTotal)
    
    setShippingInfo({
      cost: shipping.cost,
      zone: shipping.zone,
      isFree: shipping.isFree,
      reason: shipping.reason,
      isValid: true,
      estimatedDays: shipping.zone?.estimatedDays || ''
    })
  }, [postalCode, orderTotal])

  return shippingInfo
}
