'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product, CartItem, Cart } from '@/types'

interface CartContextType {
  cart: Cart
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartItemsCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.product.id === action.product.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        )
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        return { items: updatedItems, total }
      } else {
        const newItem: CartItem = { product: action.product, quantity: action.quantity }
        const updatedItems = [...state.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        return { items: updatedItems, total }
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.product.id !== action.productId)
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      return { items: updatedItems, total }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.product.id !== action.productId)
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        return { items: updatedItems, total }
      }
      
      const updatedItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      return { items: updatedItems, total }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    
    default:
      return state
  }
}

const CART_STORAGE_KEY = 'pinturas-acuario-cart'

const getInitialCart = (): Cart => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        return JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }
  return { items: [], total: 0 }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, getInitialCart())

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', product, quantity })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartItemsCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart])

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
