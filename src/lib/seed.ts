import { prisma } from './prisma'
import { products } from './products'

export async function seedDatabase() {
  try {
    // Verificar si ya hay productos en la base de datos
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      console.log('Database already seeded')
      return
    }

    // Insertar productos iniciales
    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          size: product.size,
          color: product.color || null,
          stock: product.stock,
          featured: product.featured || false,
          image: product.image || null
        }
      })
    }

    console.log(`Seeded database with ${products.length} products`)
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
