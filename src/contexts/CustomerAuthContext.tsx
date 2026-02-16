'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  isActive: boolean
  image?: string
  provider?: string
  googleId?: string
}

interface CustomerAddress {
  id: string
  type: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface CustomerAuthContextType {
  customer: Customer | null
  addresses: CustomerAddress[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<void>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<Customer>) => Promise<boolean>
  addAddress: (address: Omit<CustomerAddress, 'id' | 'customerId'>) => Promise<boolean>
  updateAddress: (id: string, address: Partial<CustomerAddress>) => Promise<boolean>
  deleteAddress: (id: string) => Promise<boolean>
  setDefaultAddress: (id: string) => Promise<boolean>
  refreshCustomer: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const isAuthenticated = !!customer || !!session

  // Marcar que estamos en el cliente después de la hidratación
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar autenticación al cargar (solo en el cliente)
  useEffect(() => {
    if (isClient) {
      checkAuth()
    }
  }, [isClient])

  // Manejar sesión de NextAuth.js
  useEffect(() => {
    if (session?.user && !customer) {
      const sessionCustomer: Customer = {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        image: session.user.image || undefined,
        provider: session.user.provider,
        isActive: true
      }
      setCustomer(sessionCustomer)
      loadAddresses(session.user.id)
    } else if (!session && customer?.provider === 'google') {
      setCustomer(null)
      setAddresses([])
    }
  }, [session, customer])

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true)
    
    try {
      const token = localStorage.getItem('pinturas-acuario-customer-token')
      const customerData = localStorage.getItem('pinturas-acuario-customer-data')
      
      if (token && customerData) {
        // Verificar si el token no ha expirado
        const tokenData = JSON.parse(atob(token))
        const now = new Date().getTime()
        
        if (tokenData.expires > now) {
          const parsedCustomer = JSON.parse(customerData)
          setCustomer(parsedCustomer)
          await loadAddresses(parsedCustomer.id)
        } else {
          // Token expirado
          localStorage.removeItem('pinturas-acuario-customer-token')
          localStorage.removeItem('pinturas-acuario-customer-data')
          setCustomer(null)
          setAddresses([])
        }
      }
    } catch (error) {
      console.error('Error checking customer auth:', error)
      setCustomer(null)
      setAddresses([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadAddresses = async (customerId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/customers/${customerId}/addresses`)
      if (response.ok) {
        const addressData = await response.json()
        setAddresses(addressData)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Crear token con expiración de 30 días
        const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000)
        const token = btoa(JSON.stringify({
          customerId: data.customer.id,
          expires: expirationTime,
          issued: new Date().getTime()
        }))
        
        // Guardar en localStorage
        localStorage.setItem('pinturas-acuario-customer-token', token)
        localStorage.setItem('pinturas-acuario-customer-data', JSON.stringify(data.customer))
        
        setCustomer(data.customer)
        await loadAddresses(data.customer.id)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const responseData = await response.json()
        
        // Crear token con expiración de 30 días
        const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000)
        const token = btoa(JSON.stringify({
          customerId: responseData.customer.id,
          expires: expirationTime,
          issued: new Date().getTime()
        }))
        
        // Guardar en localStorage
        localStorage.setItem('pinturas-acuario-customer-token', token)
        localStorage.setItem('pinturas-acuario-customer-data', JSON.stringify(responseData.customer))
        
        setCustomer(responseData.customer)
        setAddresses([])
        return true
      }
      
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  const logout = (): void => {
    if (session) {
      signOut({ callbackUrl: '/' })
    } else {
      localStorage.removeItem('pinturas-acuario-customer-token')
      localStorage.removeItem('pinturas-acuario-customer-data')
    }
    setCustomer(null)
    setAddresses([])
  }

  const updateProfile = async (data: Partial<Customer>): Promise<boolean> => {
    if (!customer) return false
    
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedCustomer = await response.json()
        setCustomer(updatedCustomer)
        localStorage.setItem('pinturas-acuario-customer-data', JSON.stringify(updatedCustomer))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }

  const addAddress = async (address: Omit<CustomerAddress, 'id' | 'customerId'>): Promise<boolean> => {
    if (!customer) return false
    
    try {
      const response = await fetch(`/api/customers/${customer.id}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      })

      if (response.ok) {
        const newAddress = await response.json()
        setAddresses(prev => [...prev, newAddress])
        return true
      }
      
      return false
    } catch (error) {
      console.error('Add address error:', error)
      return false
    }
  }

  const updateAddress = async (id: string, address: Partial<CustomerAddress>): Promise<boolean> => {
    if (!customer) return false
    
    try {
      const response = await fetch(`/api/customers/${customer.id}/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      })

      if (response.ok) {
        const updatedAddress = await response.json()
        setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Update address error:', error)
      return false
    }
  }

  const deleteAddress = async (id: string): Promise<boolean> => {
    if (!customer) return false
    
    try {
      const response = await fetch(`/api/customers/${customer.id}/addresses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== id))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Delete address error:', error)
      return false
    }
  }

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    if (!customer) return false
    
    try {
      const response = await fetch(`/api/customers/${customer.id}/addresses/${id}/default`, {
        method: 'PUT',
      })

      if (response.ok) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        })))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Set default address error:', error)
      return false
    }
  }

  const refreshCustomer = async (): Promise<void> => {
    if (customer) {
      await loadAddresses(customer.id)
    }
  }

  const value: CustomerAuthContextType = {
    customer,
    addresses,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshCustomer
  }

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider')
  }
  return context
}

// Hook para verificar si el cliente puede realizar ciertas acciones
export function useCustomerPermissions() {
  const { customer, isAuthenticated } = useCustomerAuth()
  
  return {
    canPlaceOrder: isAuthenticated && customer?.isActive,
    canViewOrderHistory: isAuthenticated && customer?.isActive,
    canManageAddresses: isAuthenticated && customer?.isActive,
    canUpdateProfile: isAuthenticated && customer?.isActive
  }
}
