'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'

interface AdminProtectionProps {
  children: ReactNode
  requiredRole?: 'admin' | 'manager'
  fallbackPath?: string
}

export default function AdminProtection({ 
  children, 
  requiredRole = 'manager',
  fallbackPath = '/admin/login'
}: AdminProtectionProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si definitivamente no está autenticado y no está cargando
    if (!isLoading && !isAuthenticated) {
      console.log('AdminProtection: Redirecting to login - not authenticated')
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  // Agregar un efecto para verificar autenticación periódicamente
  useEffect(() => {
    if (isAuthenticated) {
      // Verificar autenticación cada 30 segundos para mantener la sesión activa
      const interval = setInterval(() => {
        const token = localStorage.getItem('pinturas-acuario-auth-token')
        if (!token) {
          console.log('AdminProtection: Token lost, redirecting to login')
          router.push(fallbackPath)
        }
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, router, fallbackPath])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando acceso...
          </h2>
          <p className="text-gray-600">
            Validando permisos de administrador
          </p>
        </div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-4">
            Redirigiendo al login...
          </p>
        </div>
      </div>
    )
  }

  // Verificar rol requerido
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <AlertTriangle className="mx-auto mb-4 text-amber-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Permisos Insuficientes
          </h2>
          <p className="text-gray-600 mb-6">
            Esta sección requiere permisos de administrador. 
            Tu rol actual es: <span className="font-medium">{user?.role}</span>
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}

// Componente específico para páginas de admin
export function AdminPageWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminProtection requiredRole="manager">
      {children}
    </AdminProtection>
  )
}

// Componente específico para funciones que solo admin puede usar
export function SuperAdminWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminProtection requiredRole="admin">
      {children}
    </AdminProtection>
  )
}
