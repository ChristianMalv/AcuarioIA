import { Product } from '@/types'

export const products: Product[] = [
  // Pinturas Vinílicas
  {
    id: 'vinilica-blanco-1l',
    name: 'Pintura Vinílica Blanco 1L',
    description: 'Pintura vinílica de alta calidad, ideal para interiores y exteriores. Excelente cobertura y durabilidad.',
    price: 189.99,
    image: '/images/vinilica-blanco.jpg',
    category: 'vinilica',
    brand: 'Acuario',
    size: '1 Litro',
    color: 'Blanco',
    stock: 50,
    featured: true
  },
  {
    id: 'vinilica-azul-1l',
    name: 'Pintura Vinílica Azul Cielo 1L',
    description: 'Pintura vinílica color azul cielo, perfecta para crear ambientes frescos y modernos.',
    price: 199.99,
    image: '/images/vinilica-azul.jpg',
    category: 'vinilica',
    brand: 'Acuario',
    size: '1 Litro',
    color: 'Azul Cielo',
    stock: 35,
    featured: true
  },
  {
    id: 'vinilica-verde-4l',
    name: 'Pintura Vinílica Verde Menta 4L',
    description: 'Pintura vinílica verde menta en presentación de 4 litros, ideal para proyectos grandes.',
    price: 649.99,
    image: '/images/vinilica-verde.jpg',
    category: 'vinilica',
    brand: 'Acuario',
    size: '4 Litros',
    color: 'Verde Menta',
    stock: 20
  },

  // Aerosoles
  {
    id: 'aerosol-negro-mate',
    name: 'Aerosol Negro Mate 400ml',
    description: 'Pintura en aerosol con acabado mate, perfecta para proyectos de decoración y restauración.',
    price: 89.99,
    image: '/images/aerosol-negro.jpg',
    category: 'aerosol',
    brand: 'Acuario',
    size: '400ml',
    color: 'Negro Mate',
    stock: 75,
    featured: true
  },
  {
    id: 'aerosol-rojo-brillante',
    name: 'Aerosol Rojo Brillante 400ml',
    description: 'Pintura en aerosol con acabado brillante, ideal para superficies metálicas y plásticas.',
    price: 94.99,
    image: '/images/aerosol-rojo.jpg',
    category: 'aerosol',
    brand: 'Acuario',
    size: '400ml',
    color: 'Rojo Brillante',
    stock: 60
  },
  {
    id: 'aerosol-plateado',
    name: 'Aerosol Plateado Metálico 400ml',
    description: 'Pintura en aerosol con acabado metálico plateado, perfecta para efectos decorativos.',
    price: 109.99,
    image: '/images/aerosol-plateado.jpg',
    category: 'aerosol',
    brand: 'Acuario',
    size: '400ml',
    color: 'Plateado Metálico',
    stock: 40
  },

  // Impermeabilizantes
  {
    id: 'impermeabilizante-5l',
    name: 'Impermeabilizante Acrílico 5L',
    description: 'Impermeabilizante acrílico de alta resistencia, protege contra humedad y filtraciones.',
    price: 899.99,
    image: '/images/impermeabilizante-5l.jpg',
    category: 'impermeabilizante',
    brand: 'Acuario',
    size: '5 Litros',
    stock: 25,
    featured: true
  },
  {
    id: 'impermeabilizante-19l',
    name: 'Impermeabilizante Acrílico 19L',
    description: 'Impermeabilizante acrílico en presentación industrial, ideal para grandes superficies.',
    price: 2899.99,
    image: '/images/impermeabilizante-19l.jpg',
    category: 'impermeabilizante',
    brand: 'Acuario',
    size: '19 Litros',
    stock: 15
  },

  // Accesorios
  {
    id: 'brocha-3-pulgadas',
    name: 'Brocha Profesional 3"',
    description: 'Brocha de cerdas naturales, ideal para aplicación de pinturas vinílicas y esmaltes.',
    price: 45.99,
    image: '/images/brocha-3.jpg',
    category: 'accesorio',
    brand: 'Acuario',
    size: '3 pulgadas',
    stock: 100
  },
  {
    id: 'rodillo-9-pulgadas',
    name: 'Rodillo de Felpa 9"',
    description: 'Rodillo de felpa de alta calidad para acabados lisos y uniformes.',
    price: 35.99,
    image: '/images/rodillo-9.jpg',
    category: 'accesorio',
    brand: 'Acuario',
    size: '9 pulgadas',
    stock: 80
  }
]

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured)
}

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category)
}

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id)
}
