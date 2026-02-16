'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

interface AdminContextType {
  products: Product[]
  loading: boolean
  currentLocation: string
  addProduct: (product: Omit<Product, 'id'> & { stock: number }) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductById: (id: string) => Product | undefined
  refreshProducts: () => Promise<void>
  getProductsByLocation: (location: string) => Product[]
  updateProductStock: (productId: string, location: string, stock: number) => Promise<void>
  setCurrentLocation: (location: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState('cdmx')

  const refreshProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id'> & { stock: number }) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      
      if (response.ok) {
        await refreshProducts()
      } else {
        throw new Error('Error al crear producto')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      
      if (response.ok) {
        await refreshProducts()
      } else {
        throw new Error('Error al actualizar producto')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await refreshProducts()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id)
  }

  const getProductsByLocation = (location: string): Product[] => {
    // Por ahora retornamos todos los productos, más adelante filtraremos por stock de ubicación
    return products
  }

  const updateProductStock = async (productId: string, location: string, stock: number): Promise<void> => {
    try {
      const response = await fetch(`/api/inventory/${productId}/${location}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock }),
      })
      
      if (response.ok) {
        await refreshProducts()
      } else {
        throw new Error('Error al actualizar stock')
      }
    } catch (error) {
      console.error('Error updating product stock:', error)
      throw error
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <AdminContext.Provider value={{
      products,
      loading,
      currentLocation,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      refreshProducts,
      getProductsByLocation,
      updateProductStock,
      setCurrentLocation
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
