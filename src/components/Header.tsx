'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, MapPin, ChevronDown, Phone, Mail } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useLocation } from '@/contexts/LocationContext'
import { HeaderContactButton } from '@/components/SmartContactButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const { getCartItemsCount } = useCart()
  const { currentLocation, openLocationModal } = useLocation()

  return (
    <header className="bg-white shadow-lg">
      {/* Top bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone size={16} />
              <span>+52 (55) 1234-5678</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={16} />
              <span>ventas@pinturasacuario.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Envío gratis en compras mayores a $1,500</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-600">Pinturas Acuario</h1>
              <p className="text-sm text-gray-600">Calidad que perdura</p>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin size={16} className="text-primary-600" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Entregar en</div>
                <div className="text-sm font-medium text-gray-900">{currentLocation.name}</div>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Dropdown */}
            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Cambiar ubicación</h3>
                  <button
                    onClick={() => {
                      openLocationModal()
                      setIsLocationDropdownOpen(false)
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Seleccionar ciudad</div>
                        <div className="text-sm text-gray-600">CDMX o Mérida</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-gray-700 hover:text-primary-600 font-medium">
              Catálogo
            </Link>
            <Link href="/vinilicas" className="text-gray-700 hover:text-primary-600 font-medium">
              Vinílicas
            </Link>
            <Link href="/aerosoles" className="text-gray-700 hover:text-primary-600 font-medium">
              Aerosoles
            </Link>
            <Link href="/impermeabilizantes" className="text-gray-700 hover:text-primary-600 font-medium">
              Impermeabilizantes
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-primary-600 font-medium">
              Contacto
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
              Admin
            </Link>
          </nav>

          {/* Cart, Contact and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Contact Button - Desktop */}
            <div className="hidden md:block">
              <HeaderContactButton />
            </div>

            <Link href="/carrito" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-gray-700 hover:text-primary-600 font-medium">
                Catálogo
              </Link>
              <Link href="/vinilicas" className="text-gray-700 hover:text-primary-600 font-medium">
                Vinílicas
              </Link>
              <Link href="/aerosoles" className="text-gray-700 hover:text-primary-600 font-medium">
                Aerosoles
              </Link>
              <Link href="/impermeabilizantes" className="text-gray-700 hover:text-primary-600 font-medium">
                Impermeabilizantes
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-primary-600 font-medium">
                Contacto
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
