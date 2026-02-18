import { Product } from '@/types'

interface StructuredDataProps {
  type: 'organization' | 'product' | 'breadcrumb' | 'website'
  data?: any
  product?: Product
}

export default function StructuredData({ type, data, product }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Pinturas Acuario",
          "description": "Tienda especializada en pinturas vinílicas, aerosoles e impermeabilizantes de alta calidad",
          "url": "https://pinturasacuario.com",
          "logo": "https://pinturasacuario.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+52-55-1234-5678",
            "contactType": "customer service",
            "availableLanguage": "Spanish"
          },
          "address": [
            {
              "@type": "PostalAddress",
              "streetAddress": "Av. Principal 123",
              "addressLocality": "Ciudad de México",
              "addressRegion": "CDMX",
              "postalCode": "06000",
              "addressCountry": "MX"
            },
            {
              "@type": "PostalAddress",
              "streetAddress": "Calle 60 No. 456",
              "addressLocality": "Mérida",
              "addressRegion": "Yucatán",
              "postalCode": "97000",
              "addressCountry": "MX"
            }
          ],
          "sameAs": [
            "https://www.facebook.com/pinturasacuario",
            "https://www.instagram.com/pinturasacuario"
          ]
        }

      case 'product':
        if (!product) return null
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "brand": {
            "@type": "Brand",
            "name": product.brand
          },
          "category": product.category,
          "image": product.image || "https://pinturasacuario.com/placeholder-product.jpg",
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "MXN",
            "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Pinturas Acuario"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "127"
          }
        }

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Pinturas Acuario",
          "url": "https://pinturasacuario.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://pinturasacuario.com/catalogo?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }

      case 'breadcrumb':
        return data

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
