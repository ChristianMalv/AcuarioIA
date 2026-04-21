'use client'

import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Images, Settings, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { Product } from '@/types'

type BestSellingBadge = 'Más Vendido' | 'Oferta' | 'Premium' | 'Nuevo'

interface BestSellingConfigItem {
  id: string
  badge?: BestSellingBadge
}

export default function ConfiguracionAdmin() {
  const { success, error } = useToast()
  const [carouselImageFit, setCarouselImageFit] = useState<'cover' | 'contain'>('contain')
  const [bestSellingProductIds, setBestSellingProductIds] = useState<string[]>([])
  const [bestSellingConfig, setBestSellingConfig] = useState<BestSellingConfigItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/settings?keys=carouselImageFit,bestSellingProductIds,bestSellingConfig')
        if (!response.ok) return
        const data = await response.json()
        const fit = data?.carouselImageFit
        if (fit === 'cover' || fit === 'contain') {
          setCarouselImageFit(fit)
        }

        const raw = data?.bestSellingProductIds
        if (typeof raw === 'string' && raw.trim().length > 0) {
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
              setBestSellingProductIds(parsed)
            }
          } catch {
            // ignore
          }
        }

        const rawConfig = data?.bestSellingConfig
        if (typeof rawConfig === 'string' && rawConfig.trim().length > 0) {
          try {
            const parsed = JSON.parse(rawConfig)
            if (
              Array.isArray(parsed) &&
              parsed.every((x) => x && typeof x === 'object' && typeof x.id === 'string')
            ) {
              setBestSellingConfig(
                (parsed as any[]).map((x) => ({
                  id: String(x.id),
                  badge:
                    x.badge === 'Más Vendido' || x.badge === 'Oferta' || x.badge === 'Premium' || x.badge === 'Nuevo'
                      ? x.badge
                      : (typeof x.isNew === 'boolean' && x.isNew ? 'Nuevo' : undefined)
                }))
              )
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data)) setProducts(data as Product[])
      } catch {
        // ignore
      }
    }

    fetchSettings()
    fetchProducts()
  }, [])

  const saveCarouselFit = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carouselImageFit,
          bestSellingProductIds: JSON.stringify(bestSellingProductIds)
          ,bestSellingConfig: JSON.stringify(bestSellingConfig)
        })
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

  const toggleBestSelling = (id: string) => {
    setBestSellingProductIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return [...prev, id]
    })

    setBestSellingConfig((prev) => {
      const exists = prev.some((x) => x.id === id)
      if (exists) return prev.filter((x) => x.id !== id)
      return [...prev, { id, badge: 'Más Vendido' }]
    })
  }

  useEffect(() => {
    setBestSellingConfig((prev) => {
      const byId = new Map(prev.map((x) => [x.id, x]))
      return bestSellingProductIds
        .map((id) => byId.get(id) ?? { id, badge: 'Más Vendido' })
    })
  }, [bestSellingProductIds])

  const updateConfig = (id: string, patch: Partial<BestSellingConfigItem>) => {
    setBestSellingConfig((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
    )
  }

  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase()
    if (!q) return true
    const sku = (p.sku || '').toLowerCase()
    const name = (p.name || '').toLowerCase()
    const brand = (p.brand || '').toLowerCase()
    return sku.includes(q) || name.includes(q) || brand.includes(q)
  })

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
              <h2 className="text-lg font-semibold text-gray-900">Productos más vendidos</h2>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona qué productos se muestran en la sección de “Más vendidos” del home.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="bestSellingSearch" className="block text-sm font-medium text-gray-700 mb-1">Buscar producto</label>
              <input
                id="bestSellingSearch"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                disabled={loading || saving}
                placeholder="Buscar por SKU, nombre o marca"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="mt-3 text-sm text-gray-700">
                Seleccionados: <span className="font-semibold">{bestSellingProductIds.length}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="border border-gray-200 rounded-lg max-h-80 overflow-auto">
                {filteredProducts.map((p) => {
                  const checked = bestSellingProductIds.includes(p.id)
                  const cfg = bestSellingConfig.find((x) => x.id === p.id)
                  return (
                    <div key={p.id} className="px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBestSelling(p.id)}
                          disabled={loading || saving}
                          className="h-4 w-4"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                          <div className="text-xs text-gray-600 truncate">
                            {(p.sku ? `SKU: ${p.sku} · ` : '')}{p.brand} · {p.size}
                          </div>
                        </div>
                      </label>

                      {checked && (
                        <div className="mt-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Etiqueta</label>
                            <select
                              value={cfg?.badge ?? 'Más Vendido'}
                              onChange={(e) => updateConfig(p.id, { badge: e.target.value as BestSellingBadge })}
                              disabled={loading || saving}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="Más Vendido">Más Vendido</option>
                              <option value="Oferta">Oferta</option>
                              <option value="Premium">Premium</option>
                              <option value="Nuevo">Nuevo</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <div className="px-4 py-6 text-sm text-gray-600">No hay productos que coincidan con la búsqueda.</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={saveCarouselFit}
              disabled={loading || saving}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar más vendidos'}
            </button>
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
