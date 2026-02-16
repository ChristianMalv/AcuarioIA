'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { useToast } from '@/contexts/ToastContext'
import AdminProtection from '@/components/AdminProtection'
import AdminHeader from '@/components/AdminHeader'
import ImageUpload from '@/components/admin/ImageUpload'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Product } from '@/types'

export default function EditarProducto() {
  const router = useRouter()
  const params = useParams()
  const { getProductById, updateProduct } = useAdmin()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vinilica' as Product['category'],
    brand: 'Acuario',
    size: '',
    color: '',
    stock: '',
    featured: false,
    image: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const productId = params.id as string
    const foundProduct = getProductById(productId)
    
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        name: foundProduct.name,
        description: foundProduct.description,
        price: foundProduct.price.toString(),
        category: foundProduct.category,
        brand: foundProduct.brand,
        size: foundProduct.size,
        color: foundProduct.color || '',
        stock: '0', // Valor por defecto ya que stock ahora se maneja por inventario
        featured: foundProduct.featured || false,
        image: foundProduct.image || ''
      })
    } else {
      // Producto no encontrado, redirigir
      router.push('/admin/productos')
    }
  }, [params.id, getProductById, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }

    if (!formData.size.trim()) {
      newErrors.size = 'El tamaño/presentación es obligatorio'
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser 0 o mayor'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !product) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedProduct: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        size: formData.size.trim(),
        color: formData.color.trim() || undefined,
        featured: formData.featured,
        image: formData.image
      }

      // El stock se maneja por separado a través del sistema de inventarios
      const productWithStock = {
        ...updatedProduct,
        stock: parseInt(formData.stock)
      }

      await updateProduct(product.id, productWithStock)
      success('Producto actualizado', `"${formData.name}" ha sido actualizado exitosamente.`)
      router.push('/admin/productos')
    } catch (err) {
      console.error('Error al actualizar producto:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el producto. Por favor intenta de nuevo.'
      error('Error al actualizar producto', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="p-6">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="text-6xl opacity-20 mb-4">📦</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Producto no encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                  El producto que buscas no existe o ha sido eliminado
                </p>
                <button
                  onClick={() => router.push('/admin/productos')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Volver a Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminProtection>
    )
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
            <p className="text-gray-600 mt-2">
              Modifica la información del producto: {product.name}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Producto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Pintura Vinílica Blanco 1L"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción detallada del producto..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="vinilica">Pintura Vinílica</option>
                  <option value="aerosol">Aerosol</option>
                  <option value="impermeabilizante">Impermeabilizante</option>
                  <option value="accesorio">Accesorio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Acuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (MXN) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño/Presentación *
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.size ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 1 Litro, 400ml, 3 pulgadas"
                />
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color (Opcional)
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Blanco, Azul Cielo, Negro Mate"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
              />
            </div>

            <div className="md:col-span-2 mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Producto Destacado
                </span>
                <span className="text-sm text-gray-500">
                  (Se mostrará en la página principal)
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
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
        </div>
      </div>
    </AdminProtection>
  )
}
