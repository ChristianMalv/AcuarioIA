'use client'

import { useState } from 'react'
import { useAuth, usePermissions } from '@/contexts/AuthContext'
import { LogOut, User, Settings, ChevronDown, Shield, Clock } from 'lucide-react'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const permissions = usePermissions()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/admin/login'
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'manager':
        return 'Gerente'
      default:
        return role
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">Pinturas Acuario</p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {/* Información de permisos */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Shield size={16} />
              <span>
                {permissions.canManageUsers ? 'Control Total' : 'Gestión de Tienda'}
              </span>
            </div>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-600" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.username}
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user?.username}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                            {getRoleDisplayName(user?.role || '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Información de permisos */}
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 mb-2">
                      <div className="font-medium mb-1">Permisos:</div>
                      <div className="space-y-1">
                        {permissions.canManageProducts && (
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Gestionar productos</span>
                          </div>
                        )}
                        {permissions.canManageInventory && (
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Gestionar inventario</span>
                          </div>
                        )}
                        {permissions.canViewReports && (
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Ver reportes</span>
                          </div>
                        )}
                        {permissions.canManageUsers && (
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>Gestionar usuarios</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información de sesión */}
                    <div className="px-3 py-2 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock size={12} />
                        <span>Sesión activa</span>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // Aquí podrías agregar lógica para configuraciones
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Settings size={16} />
                      <span>Configuración</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
