'use client'

import SmartContactButton from './SmartContactButton'

interface ContactPageButtonProps {
  productName?: string
  customMessage?: string
  className?: string
}

export default function ContactPageButton({ 
  productName, 
  customMessage,
  className = ''
}: ContactPageButtonProps) {
  return (
    <SmartContactButton 
      variant="inline"
      customMessage={customMessage}
      productName={productName}
      useChannelSelector={true}
      className={`w-full ${className}`}
    />
  )
}

// Componente específico para la sección de contacto general
export function ContactSectionButton() {
  return (
    <ContactPageButton 
      customMessage="Hola, me interesa obtener información sobre productos de Pinturas Acuario."
      className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
    />
  )
}
