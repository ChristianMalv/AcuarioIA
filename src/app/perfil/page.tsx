'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Package, 
  Heart, 
  Settings,
  Edit3,
  Plus,
  Trash2,
  Star,
  LogOut,
  Shield
} from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { 
    customer, 
    addresses, 
    isLoading, 
    isAuthenticated, 
    logout, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useCustomerAuth()

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [isWelcome, setIsWelcome] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  })

  const [addressData, setAddressData] = useState({
    type: 'shipping',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México',
    isDefault: false
  })

  // Verificar si es una página de bienvenida
  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setIsWelcome(true)
    }
  }, [searchParams])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/perfil')
    }
  }, [isAuthenticated, isLoading, router])

  // Cargar datos del perfil
  useEffect(() => {
    if (customer) {
      setProfileData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        dateOfBirth: customer.dateOfBirth || ''
      })
    }
  }, [customer])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await updateProfile(profileData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await addAddress(addressData)
    if (success) {
      setShowAddAddress(false)
      setAddressData({
        type: 'shipping',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México',
        isDefault: false
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      await deleteAddress(addressId)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    await setDefaultAddress(addressId)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Cargando perfil...</span>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      {isWelcome && (
        <div className="bg-primary-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">¡Bienvenido a Pinturas Acuario!</h2>
                <p className="text-primary-100">Tu cuenta ha sido creada exitosamente.</p>
              </div>
              <button
                onClick={() => setIsWelcome(false)}
                className="text-primary-100 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {customer.image ? (
                    <Image
                      src={customer.image}
                      alt="Avatar"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h1>
                    <p className="text-gray-600">{customer.email}</p>
                    {customer.provider === 'google' && (
                      <div className="flex items-center mt-1">
                        <Shield className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Cuenta verificada con Google</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'addresses'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Direcciones</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Pedidos</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'favorites'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Favoritos</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Apellido</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Guardar cambios
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <div className="flex items-center mt-1">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{customer.email}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{customer.phone || 'No especificado'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Fecha de nacimiento</label>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {customer.dateOfBirth 
                                ? new Date(customer.dateOfBirth).toLocaleDateString('es-MX')
                                : 'No especificada'
                              }
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Miembro desde</label>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {new Date(customer.createdAt || Date.now()).toLocaleDateString('es-MX')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Direcciones de Entrega</h3>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar dirección</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-gray-500 mb-4">Agrega una dirección para facilitar tus pedidos</p>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        Agregar primera dirección
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-lg ${
                            address.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                  {address.type === 'shipping' ? 'Envío' : 'Facturación'}
                                </span>
                                {address.isDefault && (
                                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                    Predeterminada
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-900">{address.street}</p>
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  className="text-xs text-primary-600 hover:text-primary-800"
                                >
                                  Predeterminada
                                </button>
                              )}
                              <button
                                onClick={() => setEditingAddress(address.id)}
                                className="text-xs text-gray-600 hover:text-gray-800"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Address Form */}
                  {showAddAddress && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nueva Dirección</h3>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                              value={addressData.type}
                              onChange={(e) => setAddressData(prev => ({ ...prev, type: e.target.value }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="shipping">Envío</option>
                              <option value="billing">Facturación</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                              type="text"
                              value={addressData.street}
                              onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                              <input
                                type="text"
                                value={addressData.city}
                                onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Estado</label>
                              <input
                                type="text"
                                value={addressData.state}
                                onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                            <input
                              type="text"
                              value={addressData.zipCode}
                              onChange={(e) => setAddressData(prev => ({ ...prev, zipCode: e.target.value }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>
                          <div className="flex space-x-3 pt-4">
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                              Guardar dirección
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddAddress(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Historial de Pedidos</h3>
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                    <p className="text-gray-500 mb-4">Explora nuestros productos y realiza tu primer pedido</p>
                    <button
                      onClick={() => router.push('/catalogo')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Ver catálogo
                    </button>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Productos Favoritos</h3>
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes favoritos aún</h3>
                    <p className="text-gray-500 mb-4">Guarda productos que te interesen para encontrarlos fácilmente</p>
                    <button
                      onClick={() => router.push('/catalogo')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Explorar productos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
