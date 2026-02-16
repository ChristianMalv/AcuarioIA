import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const baseUrl = 'https://pinturasacuario.com' // Cambiar por tu dominio real
    
    // Obtener todos los productos para incluir en el sitemap
    const products = await prisma.product.findMany({
      select: {
        id: true,
        updatedAt: true,
        category: true
      }
    })

    // URLs estáticas
    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/catalogo`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/vinilicas`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/aerosoles`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/impermeabilizantes`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/accesorios`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      }
    ]

    // URLs de productos dinámicas
    const productUrls = products.map(product => ({
      url: `${baseUrl}/producto/${product.id}`,
      lastModified: product.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7
    }))

    const allUrls = [...staticUrls, ...productUrls]

    // Generar XML del sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastModified, changeFrequency, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
