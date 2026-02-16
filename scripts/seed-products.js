const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleProducts = [
  {
    name: 'Pintura Vinílica Blanco Hueso',
    description: 'Pintura vinílica de alta calidad con acabado mate. Ideal para interiores y exteriores. Excelente cobertura y durabilidad.',
    price: 285.50,
    category: 'vinilica',
    brand: 'Acuario',
    size: '4 litros',
    color: 'Blanco Hueso',
    featured: true,
    image: '/images/products/vinilica-blanco.jpg',
    stock: 25
  },
  {
    name: 'Pintura Vinílica Azul Cielo',
    description: 'Pintura vinílica premium con pigmentos de alta calidad. Resistente a la intemperie y fácil aplicación.',
    price: 295.00,
    category: 'vinilica',
    brand: 'Acuario',
    size: '4 litros',
    color: 'Azul Cielo',
    featured: false,
    image: '/images/products/vinilica-azul.jpg',
    stock: 18
  },
  {
    name: 'Aerosol Rojo Ferrari',
    description: 'Aerosol de secado rápido con acabado brillante. Perfecto para retoques y proyectos pequeños.',
    price: 89.90,
    category: 'aerosol',
    brand: 'Acuario',
    size: '400ml',
    color: 'Rojo Ferrari',
    featured: true,
    image: '/images/products/aerosol-rojo.jpg',
    stock: 45
  },
  {
    name: 'Aerosol Negro Mate',
    description: 'Aerosol con acabado mate profesional. Ideal para superficies metálicas y plásticas.',
    price: 85.50,
    category: 'aerosol',
    brand: 'Acuario',
    size: '400ml',
    color: 'Negro Mate',
    featured: false,
    image: '/images/products/aerosol-negro.jpg',
    stock: 32
  },
  {
    name: 'Impermeabilizante Acrílico Transparente',
    description: 'Impermeabilizante acrílico de alta resistencia. Protege contra filtraciones y humedad por hasta 10 años.',
    price: 450.00,
    category: 'impermeabilizante',
    brand: 'Acuario',
    size: '19 litros',
    color: 'Transparente',
    featured: true,
    image: '/images/products/impermeabilizante-transparente.jpg',
    stock: 12
  },
  {
    name: 'Impermeabilizante Fibratado Blanco',
    description: 'Impermeabilizante con fibras reforzantes. Máxima protección para azoteas y terrazas.',
    price: 520.00,
    category: 'impermeabilizante',
    brand: 'Acuario',
    size: '19 litros',
    color: 'Blanco',
    featured: false,
    image: '/images/products/impermeabilizante-blanco.jpg',
    stock: 8
  },
  {
    name: 'Brocha Profesional 4 pulgadas',
    description: 'Brocha de cerdas naturales para aplicación profesional. Mango ergonómico y cerdas de alta calidad.',
    price: 125.00,
    category: 'accesorio',
    brand: 'Acuario',
    size: '4 pulgadas',
    color: null,
    featured: false,
    image: '/images/products/brocha-4.jpg',
    stock: 35
  },
  {
    name: 'Rodillo Antigoteo con Mango',
    description: 'Rodillo profesional antigoteo con mango extensible. Ideal para superficies grandes y techos.',
    price: 89.00,
    category: 'accesorio',
    brand: 'Acuario',
    size: '23cm',
    color: null,
    featured: true,
    image: '/images/products/rodillo-antigoteo.jpg',
    stock: 28
  },
  {
    name: 'Pintura Vinílica Verde Bosque',
    description: 'Pintura vinílica ecológica con bajo contenido de VOC. Color vibrante y duradero.',
    price: 310.00,
    category: 'vinilica',
    brand: 'Acuario',
    size: '4 litros',
    color: 'Verde Bosque',
    featured: false,
    image: '/images/products/vinilica-verde.jpg',
    stock: 22
  },
  {
    name: 'Sellador Acrílico Universal',
    description: 'Sellador acrílico multiusos para preparación de superficies. Excelente adherencia y nivelación.',
    price: 195.00,
    category: 'accesorio',
    brand: 'Acuario',
    size: '4 litros',
    color: 'Blanco',
    featured: false,
    image: '/images/products/sellador-acrilico.jpg',
    stock: 15
  }
]

async function seedProducts() {
  console.log('🌱 Iniciando seed de productos...')
  
  try {
    // Verificar si ya existen productos
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      console.log(`✅ Ya existen ${existingProducts} productos en la base de datos.`)
      return
    }
    
    // Crear productos con inventario
    for (const productData of sampleProducts) {
      const { stock, ...productInfo } = productData
      
      // Crear producto e inventario en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear el producto
        const product = await tx.product.create({
          data: productInfo
        })
        
        // Crear inventario para ambas ubicaciones
        await tx.inventory.createMany({
          data: [
            {
              productId: product.id,
              location: 'cdmx',
              stock: Math.floor(stock * 0.6), // 60% en CDMX
              minStock: 5,
              maxStock: 100
            },
            {
              productId: product.id,
              location: 'merida',
              stock: Math.floor(stock * 0.4), // 40% en Mérida
              minStock: 5,
              maxStock: 100
            }
          ]
        })
        
        return product
      })
      
      console.log(`✅ Producto creado: ${result.name}`)
    }
    
    console.log(`🎉 Seed completado! Se crearon ${sampleProducts.length} productos.`)
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedProducts()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
