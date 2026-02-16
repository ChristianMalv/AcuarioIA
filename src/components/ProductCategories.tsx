import Link from 'next/link'
import { Paintbrush, SprayCan, Shield, Wrench } from 'lucide-react'

export default function ProductCategories() {
  const categories = [
    {
      id: 'vinilicas',
      name: 'Pinturas Vinílicas',
      description: 'Pinturas de alta calidad para interiores y exteriores',
      icon: Paintbrush,
      color: 'from-blue-500 to-blue-600',
      href: '/vinilicas'
    },
    {
      id: 'aerosoles',
      name: 'Pinturas en Aerosol',
      description: 'Acabados perfectos para proyectos especializados',
      icon: SprayCan,
      color: 'from-red-500 to-red-600',
      href: '/aerosoles'
    },
    {
      id: 'impermeabilizantes',
      name: 'Impermeabilizantes',
      description: 'Protección máxima contra humedad y filtraciones',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      href: '/impermeabilizantes'
    },
    {
      id: 'accesorios',
      name: 'Accesorios',
      description: 'Brochas, rodillos y herramientas profesionales',
      icon: Wrench,
      color: 'from-purple-500 to-purple-600',
      href: '/accesorios'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestras Categorías
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra la solución perfecta para tu proyecto con nuestra amplia gama de productos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="p-8 relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Ver productos</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
