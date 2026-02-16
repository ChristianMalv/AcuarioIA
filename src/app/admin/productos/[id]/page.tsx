'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { useToast } from '@/contexts/ToastContext'
import AdminLayout from '@/components/AdminLayout'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Tag,
  Palette,
  Ruler,
  Building,
  Star,
  AlertTriangle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getProductById, deleteProduct } = useAdmin()
  const { success, error } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const productId = params.id as string

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId)
      setProduct(foundProduct || null)
      setLoading(false)
    }
  }, [productId, getProductById])

  const handleDeleteProduct = async () => {
    if (!product) return
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      try {
        await deleteProduct(product.id)
        success('Producto eliminado', `"${product.name}" ha sido eliminado exitosamente.`)
        router.push('/admin/productos')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el producto. Por favor intenta de nuevo.'
        error('Error al eliminar producto', errorMessage)
      }
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Sin stock', color: 'text-red-600 bg-red-100', icon: AlertTriangle }
    if (stock < 10) return { status: 'Stock bajo', color: 'text-orange-600 bg-orange-100', icon: AlertTriangle }
    return { status: 'En stock', color: 'text-green-600 bg-green-100', icon: Package }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Producto no encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/admin/productos"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Volver a Productos</span>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const stockStatus = getStockStatus(product.stock || 0)
  const StockIcon = stockStatus.icon

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/productos"
              className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Volver a Productos</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/productos/${product.id}/editar`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Editar</span>
            </Link>
            <button
              onClick={handleDeleteProduct}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl opacity-20">🎨</div>
                  </div>
                )}
              </div>
              
              {product.featured && (
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Star size={16} className="mr-1" />
                    Producto Destacado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {product.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building size={20} className="text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Marca</div>
                    <div className="font-semibold">{product.brand}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Tag size={20} className="text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Categoría</div>
                    <div className="font-semibold capitalize">{product.category}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Ruler size={20} className="text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Tamaño</div>
                    <div className="font-semibold">{product.size}</div>
                  </div>
                </div>

                {product.color && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Palette size={20} className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Color</div>
                      <div className="font-semibold">{product.color}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Información de Inventario
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stockStatus.color}`}>
                    <StockIcon size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estado del Stock</div>
                    <div className="font-semibold text-lg">{stockStatus.status}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cantidad Disponible</div>
                    <div className="font-semibold text-lg">{product.stock || 0} unidades</div>
                  </div>
                </div>
              </div>

              {(product.stock || 0) < 10 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={20} className="text-orange-600" />
                    <span className="text-orange-800 font-medium">
                      Stock bajo - Considera reabastecer pronto
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Product ID */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Información Técnica
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">ID del Producto</div>
                <div className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                  {product.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
