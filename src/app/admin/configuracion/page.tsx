'use client'

import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Images, Settings, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function ConfiguracionAdmin() {
  const { success, error } = useToast()
  const [carouselImageFit, setCarouselImageFit] = useState<'cover' | 'contain'>('contain')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/settings?keys=carouselImageFit')
        if (!response.ok) return
        const data = await response.json()
        const fit = data?.carouselImageFit
        if (fit === 'cover' || fit === 'contain') {
          setCarouselImageFit(fit)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const saveCarouselFit = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carouselImageFit })
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'No se pudo guardar la configuración')
      }
      success('Éxito', 'Configuración guardada')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la configuración'
      error('Error', msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Settings size={24} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600 mt-1">Ajustes y módulos de administración</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Carrusel del Home</h2>
              <p className="text-sm text-gray-600 mt-1">
                Controla cómo se ajustan las imágenes dentro del carrusel.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="carouselImageFit" className="block text-sm font-medium text-gray-700 mb-1">Ajuste de imagen</label>
              <select
                id="carouselImageFit"
                value={carouselImageFit}
                onChange={(e) => setCarouselImageFit(e.target.value as 'cover' | 'contain')}
                disabled={loading || saving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="contain">Mostrar completa (contain)</option>
                <option value="cover">Llenar y recortar (cover)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                “Contain” no recorta pero puede dejar barras; “Cover” llena el área pero puede recortar.
              </p>
            </div>

            <div>
              <button
                onClick={saveCarouselFit}
                disabled={loading || saving}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/carrusel"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Images size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">Carrusel</div>
                <div className="text-sm text-gray-600">Administra imágenes del carrusel del home</div>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/envios"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">Envíos</div>
                <div className="text-sm text-gray-600">Zonas, costos y reglas de envío</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
