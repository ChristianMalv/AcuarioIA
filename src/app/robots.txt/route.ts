import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Allow important pages for SEO
Allow: /catalogo
Allow: /vinilicas
Allow: /aerosoles
Allow: /impermeabilizantes
Allow: /accesorios

# Sitemap location
Sitemap: https://pinturasacuario.com/sitemap.xml`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
