'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { useToast } from '@/contexts/ToastContext'
import { ArrowLeft, Save, X } from 'lucide-react'

type PromotionType = 'discount' | 'bundle' | 'seasonal' | 'flash'

interface PromotionResponse {
  id: string
  title: string
  subtitle: string
  description: string
  discount: string
  validUntil: string
  image: string
  ctaText: string
  ctaLink: string
  type: string
  featured: boolean
  active: boolean
  order: number
}

export default function EditarPromocion() {
  const router = useRouter()
  const params = useParams()
  const { success, error } = useToast()

  const promotionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount: '',
    validUntil: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    type: 'discount' as PromotionType,
    featured: false,
    active: true,
    order: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/promotions/${promotionId}`)
        if (!response.ok) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error || 'No se pudo cargar la promoción')
        }

        const data = (await response.json().catch(() => null)) as PromotionResponse | null
        if (!data) throw new Error('Respuesta inválida del servidor')

        const parsedDate = data.validUntil ? new Date(data.validUntil) : null
        const dateValue = parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toISOString().slice(0, 10)
          : ''

        const normalizedType: PromotionType =
          data.type === 'bundle' || data.type === 'seasonal' || data.type === 'flash' ? (data.type as PromotionType) : 'discount'

        setFormData({
          title: data.title ?? '',
          subtitle: data.subtitle ?? '',
          description: data.description ?? '',
          discount: data.discount ?? '',
          validUntil: dateValue,
          image: data.image ?? '',
          ctaText: data.ctaText ?? '',
          ctaLink: data.ctaLink ?? '',
          type: normalizedType,
          featured: Boolean(data.featured),
          active: Boolean(data.active),
          order: typeof data.order === 'number' ? data.order : 0,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al cargar la promoción'
        error('Error', msg)
        router.push('/admin/promociones')
      } finally {
        setLoading(false)
      }
    }

    if (promotionId) fetchPromotion()
  }, [promotionId, error, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio'
    if (!formData.subtitle.trim()) newErrors.subtitle = 'El subtítulo es obligatorio'
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria'
    if (!formData.discount.trim()) newErrors.discount = 'El descuento es obligatorio'
    if (!formData.validUntil.trim()) newErrors.validUntil = 'La fecha es obligatoria'
    if (!formData.image.trim()) newErrors.image = 'La imagen es obligatoria'
    if (!formData.ctaText.trim()) newErrors.ctaText = 'El texto del botón es obligatorio'
    if (!formData.ctaLink.trim()) newErrors.ctaLink = 'El link del botón es obligatorio'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/promotions/${promotionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order) || 0,
          validUntil: new Date(formData.validUntil).toISOString(),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'No se pudo actualizar la promoción')
      }

      success('Éxito', 'Promoción actualizada')
      router.push('/admin/promociones')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar la promoción'
      error('Error', msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Promoción</h1>
            <p className="text-gray-600 mt-2">Actualiza la promoción</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo *</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="discount">Descuento</option>
                  <option value="bundle">Pack</option>
                  <option value="seasonal">Temporada</option>
                  <option value="flash">Flash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descuento *</label>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.discount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Válido hasta *</label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.validUntil ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.validUntil && (
                  <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={0}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto del botón *</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.ctaText ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ctaText && <p className="mt-1 text-sm text-red-600">{errors.ctaText}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link del botón *</label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.ctaLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ctaLink && <p className="mt-1 text-sm text-red-600">{errors.ctaLink}</p>}
              </div>

              <div className="md:col-span-2 mt-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Promoción destacada</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Activa</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
