'use client'

import { useMemo, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'

type ProductImage = {
  id: string
  url: string
  alt?: string | null
  isPrimary: boolean
  createdAt?: string
}

type Product = {
  id: string
  sku?: string | null
  name: string
  image?: string | null
  images?: ProductImage[]
}

export default function ImagenesProductosPage() {
  const [sku, setSku] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [product, setProduct] = useState<Product | null>(null)
  const [matches, setMatches] = useState<Array<Pick<Product, 'id' | 'sku' | 'name'>>>([])

  const normalizedSku = useMemo(() => sku.trim(), [sku])

  const fetchProduct = async () => {
    if (!normalizedSku) {
      setError('Escribe un SKU o nombre')
      return
    }

    setLoading(true)
    setError('')
    setMatches([])

    try {
      const res = await fetch(`/api/admin/product-images?q=${encodeURIComponent(normalizedSku)}`)
      const data = await res.json().catch(() => null)

      if (res.status === 409 && data?.matches?.length) {
        setProduct(null)
        setMatches(data.matches)
        setError(data?.error || 'Se encontraron varios productos, elige uno')
        return
      }

      if (!res.ok) {
        setProduct(null)
        setError(data?.error || 'No se pudo cargar el producto')
        return
      }

      setProduct(data.product)
    } catch {
      setProduct(null)
      setError('No se pudo cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  const selectMatch = async (match: Pick<Product, 'id' | 'sku' | 'name'>) => {
    if (!match.sku) return

    setSku(match.sku)
    setMatches([])
    setError('')
    setProduct(null)

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/product-images?sku=${encodeURIComponent(match.sku)}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || 'No se pudo cargar el producto')
        return
      }

      setProduct(data.product)
    } catch {
      setError('No se pudo cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  const addImage = async (imageUrl: string) => {
    if (!product?.sku) {
      setError('Primero busca un SKU válido')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/product-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: product.sku, url: imageUrl, makePrimary: true }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'No se pudo guardar la imagen')
        return
      }

      await fetchProduct()
    } catch {
      setError('No se pudo guardar la imagen')
    } finally {
      setSaving(false)
    }
  }

  const setPrimary = async (imageId: string) => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/product-images/${encodeURIComponent(imageId)}/primary`, {
        method: 'PUT',
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || 'No se pudo marcar como principal')
        return
      }

      await fetchProduct()
    } catch {
      setError('No se pudo marcar como principal')
    } finally {
      setSaving(false)
    }
  }

  const deleteImage = async (imageId: string) => {
    const ok = confirm('¿Eliminar esta imagen de la base de datos? (No borra el archivo del servidor)')
    if (!ok) return

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/product-images/${encodeURIComponent(imageId)}`, {
        method: 'DELETE',
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || 'No se pudo eliminar')
        return
      }

      await fetchProduct()
    } catch {
      setError('No se pudo eliminar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Imágenes de productos</h1>
          <p className="text-gray-600 mt-2">
            Busca por SKU o nombre y sube imágenes. Esto no se borra con el import de inventario.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU o nombre</label>
              <input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Ej. EW30010 o Esmalte"
              />
            </div>

            <button
              type="button"
              onClick={fetchProduct}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
          ) : null}

          {matches.length ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
              <div className="text-sm font-medium text-amber-900">Resultados</div>
              <div className="space-y-2">
                {matches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectMatch(m)}
                    className="w-full text-left px-3 py-2 rounded border border-amber-200 bg-white hover:bg-amber-100"
                  >
                    <div className="text-sm text-gray-900 font-medium">{m.name}</div>
                    <div className="text-xs text-gray-600">SKU: {m.sku ?? '-'}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {product ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-6">
            <div>
              <div className="text-sm text-gray-700">
                SKU: <span className="font-medium">{product.sku}</span>
              </div>
              <div className="text-sm text-gray-700">
                Producto: <span className="font-medium">{product.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">
                  Subir nueva imagen (se marcará como principal)
                </div>
                <ImageUpload currentImage={product.image ?? undefined} onImageChange={addImage} />
                {saving ? <div className="text-sm text-gray-600">Guardando...</div> : null}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">Imágenes guardadas</div>
                {product.images?.length ? (
                  <div className="space-y-3">
                    {product.images.map((img) => (
                      <div
                        key={img.id}
                        className="flex gap-3 items-center border border-gray-200 rounded-lg p-3"
                      >
                        <img
                          src={img.url}
                          alt={img.alt ?? ''}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-600 break-all">{img.url}</div>
                          <div className="text-xs text-gray-600">{img.isPrimary ? 'Principal' : ''}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPrimary(img.id)}
                            disabled={saving}
                            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                          >
                            Principal
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteImage(img.id)}
                            disabled={saving}
                            className="px-3 py-1 rounded border border-red-300 text-red-700 text-sm disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Sin imágenes aún.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  )
}
