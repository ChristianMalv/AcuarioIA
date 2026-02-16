'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  role: 'admin' | 'manager'
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales predeterminadas (en producción deberían estar en base de datos)
const DEFAULT_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'pinturas2024!',
    user: {
      id: 'admin-1',
      username: 'admin',
      role: 'admin' as const,
      name: 'Administrador Principal'
    }
  },
  manager: {
    username: 'manager',
    password: 'manager2024!',
    user: {
      id: 'manager-1',
      username: 'manager',
      role: 'manager' as const,
      name: 'Gerente de Tienda'
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const isAuthenticated = !!user

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

  // Renovar sesión automáticamente cada 30 minutos si el usuario está activo
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        renewSession()
      }, 30 * 60 * 1000) // 30 minutos

      // También renovar en eventos de actividad del usuario
      const handleUserActivity = () => {
        renewSession()
      }

      window.addEventListener('click', handleUserActivity)
      window.addEventListener('keypress', handleUserActivity)
      window.addEventListener('scroll', handleUserActivity)

      return () => {
        clearInterval(interval)
        window.removeEventListener('click', handleUserActivity)
        window.removeEventListener('keypress', handleUserActivity)
        window.removeEventListener('scroll', handleUserActivity)
      }
    }
  }, [isAuthenticated, user])

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('pinturas-acuario-auth-token')
      const userData = localStorage.getItem('pinturas-acuario-user-data')
      
      if (token && userData) {
        try {
          // Verificar que el token no haya expirado
          const tokenData = JSON.parse(atob(token))
          const now = new Date().getTime()
          
          if (tokenData.expires > now) {
            const parsedUserData = JSON.parse(userData)
            setUser(parsedUserData)
            console.log('Auth restored from localStorage:', parsedUserData)
          } else {
            // Token expirado
            console.log('Token expired, clearing auth')
            localStorage.removeItem('pinturas-acuario-auth-token')
            localStorage.removeItem('pinturas-acuario-user-data')
            setUser(null)
          }
        } catch (parseError) {
          console.error('Error parsing auth data:', parseError)
          // Si hay error al parsear, limpiar datos corruptos
          localStorage.removeItem('pinturas-acuario-auth-token')
          localStorage.removeItem('pinturas-acuario-user-data')
          setUser(null)
        }
      } else {
        console.log('No auth data found in localStorage')
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Debug: Log de las credenciales recibidas
      console.log('Login attempt:', { username, password })
      console.log('Available credentials:', DEFAULT_CREDENTIALS)
      
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar credenciales (trim para eliminar espacios)
      const trimmedUsername = username.trim().toLowerCase()
      const trimmedPassword = password.trim()
      
      const credential = Object.values(DEFAULT_CREDENTIALS).find(
        cred => {
          const credUsername = cred.username.trim().toLowerCase()
          const credPassword = cred.password.trim()
          
          console.log('Comparing:', { 
            inputUser: trimmedUsername, 
            credUser: credUsername, 
            inputPass: trimmedPassword, 
            credPass: credPassword,
            userMatch: credUsername === trimmedUsername,
            passMatch: credPassword === trimmedPassword
          })
          return credUsername === trimmedUsername && credPassword === trimmedPassword
        }
      )
      
      console.log('Found credential:', credential)
      
      if (credential) {
        // Crear token con expiración de 8 horas
        const expirationTime = new Date().getTime() + (8 * 60 * 60 * 1000)
        const token = btoa(JSON.stringify({
          userId: credential.user.id,
          expires: expirationTime,
          issued: new Date().getTime()
        }))
        
        // Guardar en localStorage
        localStorage.setItem('pinturas-acuario-auth-token', token)
        localStorage.setItem('pinturas-acuario-user-data', JSON.stringify(credential.user))
        
        setUser(credential.user)
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

  // Función para renovar la sesión automáticamente
  const renewSession = (): void => {
    if (user) {
      const expirationTime = new Date().getTime() + (8 * 60 * 60 * 1000)
      const token = btoa(JSON.stringify({
        userId: user.id,
        expires: expirationTime,
        issued: new Date().getTime()
      }))
      
      localStorage.setItem('pinturas-acuario-auth-token', token)
      console.log('Session renewed for user:', user.username)
    }
  }

  const logout = (): void => {
    localStorage.removeItem('pinturas-acuario-auth-token')
    localStorage.removeItem('pinturas-acuario-user-data')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook para verificar permisos específicos
export function usePermissions() {
  const { user } = useAuth()
  
  const canManageProducts = user?.role === 'admin' || user?.role === 'manager'
  const canManageUsers = user?.role === 'admin'
  const canViewReports = user?.role === 'admin' || user?.role === 'manager'
  const canManageInventory = user?.role === 'admin' || user?.role === 'manager'
  
  return {
    canManageProducts,
    canManageUsers,
    canViewReports,
    canManageInventory
  }
}
