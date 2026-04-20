export interface Product {
  id: string
  sku?: string
  model?: string
  supplier?: string
  name: string
  description: string
  price: number
  image: string
  images?: ProductImage[]
  category: 'vinilica' | 'aerosol' | 'impermeabilizante' | 'accesorio'
  brand: string
  size: string
  color?: string
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
  // Campos calculados para compatibilidad con código existente
  stock?: number
  stockCdmx?: number
  stockMerida?: number
  stockBodega?: number
  minStock?: number
  maxStock?: number
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string
  isPrimary: boolean
  createdAt?: Date
}

export interface Inventory {
  id: string
  productId: string
  location: string
  stock: number
  minStock: number
  maxStock: number
  createdAt?: Date
  updatedAt?: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}
