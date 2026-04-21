'use client'

import { useLocation } from '@/contexts/LocationContext'
import { MapPin, Navigation, X } from 'lucide-react'

export default function LocationModal() {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    setLocation, 
    detectLocation, 
    isDetecting 
  } = useLocation()

  if (!isLocationModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6 relative">
          <button
            onClick={closeLocationModal}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <MapPin size={28} />
            <div>
              <h2 className="text-xl font-bold">Selecciona tu ubicación</h2>
              <p className="text-primary-100 text-sm">Para mostrarte productos y costos de envío</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Detección automática */}
          <div className="text-center">
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isDetecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Detectando ubicación...</span>
                </>
              ) : (
                <>
                  <Navigation size={20} />
                  <span>Detectar mi ubicación</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Usamos tu ubicación para calcular costos de envío
            </p>
          </div>

          {/* Separador */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">o selecciona manualmente</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Selección manual */}
          <div className="space-y-3">
            <button
              onClick={() => setLocation('merida')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    Mérida, Yucatán
                  </h3>
                  <p className="text-sm text-gray-600">
                    Entrega en zona metropolitana • Envío desde $120
                  </p>
                </div>
                <div className="text-2xl">🌴</div>
              </div>
            </button>
          </div>

          {/* Nota */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Puedes cambiar tu ubicación en cualquier momento desde el menú superior
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
