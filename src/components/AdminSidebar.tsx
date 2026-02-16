'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Package, 
  Plus, 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Settings,
  Warehouse,
  FileText,
  Images
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: string | number; className?: string }>
  description?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Resumen general'
  },
  {
    name: 'Carrusel',
    href: '/admin/carrusel',
    icon: Images,
    description: 'Imágenes del home'
  },
  {
    name: 'Productos',
    href: '/admin/productos',
    icon: Package,
    description: 'Gestionar catálogo'
  },
  {
    name: 'Nuevo Producto',
    href: '/admin/productos/nuevo',
    icon: Plus,
    description: 'Agregar producto'
  },
  {
    name: 'Inventario',
    href: '/admin/inventario',
    icon: Warehouse,
    description: 'Control de stock'
  },
  {
    name: 'Pedidos',
    href: '/admin/pedidos',
    icon: ShoppingCart,
    description: 'Gestionar órdenes'
  },
  {
    name: 'Reportes',
    href: '/admin/reportes',
    icon: BarChart3,
    description: 'Análisis y métricas'
  },
  {
    name: 'Clientes',
    href: '/admin/clientes',
    icon: Users,
    description: 'Base de clientes'
  }
]

const secondaryNavigation: NavItem[] = [
  {
    name: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
    description: 'Ajustes del sistema'
  },
  {
    name: 'Documentación',
    href: '/admin/documentacion',
    icon: FileText,
    description: 'Guías y ayuda'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          active
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Icon
          size={20}
          className={`mr-3 flex-shrink-0 ${
            active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
        />
        <div className="flex-1">
          <div className="font-medium">{item.name}</div>
          {item.description && (
            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* Logo y título */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Pinturas Acuario</p>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="space-y-1">
          <div className="pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Principal
            </h3>
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Navegación secundaria */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Sistema
            </h3>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Información adicional */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Estado del Sistema</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
