import type { Metadata } from "next"
import { Bebas_Neue, Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import { AdminProvider } from "@/contexts/AdminContext"
import { LocationProvider } from "@/contexts/LocationContext"
import { StoreProvider } from "@/contexts/StoreContext"
import { AuthProvider } from '@/contexts/AuthContext'
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import NextAuthProvider from '@/components/providers/AuthProvider'
import LocationModal from "@/components/LocationModal"
import { FloatingContactButton } from "@/components/SmartContactButton"
import GoogleAnalytics from "@/components/SEO/GoogleAnalytics"
import GoogleAdsPixel from "@/components/SEO/GoogleAdsPixel"
import StructuredData from "@/components/SEO/StructuredData"

const inter = Inter({ subsets: ["latin"] })
const carouselDisplay = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-carousel-display" })
const carouselHeadline = Montserrat({ subsets: ["latin"], variable: "--font-carousel-headline" })

export const metadata: Metadata = {
  title: {
    default: "Pinturas Acuario - Venta de Pinturas y Impermeabilizantes",
    template: "%s | Pinturas Acuario"
  },
  description: "Tienda especializada en pinturas vinílicas, aerosoles e impermeabilizantes de la marca Acuario. Entrega en CDMX y Mérida. Calidad profesional para todos tus proyectos.",
  keywords: [
    "pinturas", "vinílicas", "aerosol", "impermeabilizantes", "acuario", 
    "construcción", "decoración", "CDMX", "Mérida", "México", "pintura profesional",
    "aerosoles", "impermeabilizante", "brochas", "rodillos", "herramientas pintura"
  ],
  authors: [{ name: "Pinturas Acuario" }],
  creator: "Pinturas Acuario",
  publisher: "Pinturas Acuario",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://pinturasacuario.com',
    siteName: 'Pinturas Acuario',
    title: 'Pinturas Acuario - Venta de Pinturas y Impermeabilizantes',
    description: 'Tienda especializada en pinturas vinílicas, aerosoles e impermeabilizantes. Entrega en CDMX y Mérida.',
    images: [
      {
        url: 'https://pinturasacuario.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pinturas Acuario - Productos de calidad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pinturas Acuario - Venta de Pinturas y Impermeabilizantes',
    description: 'Tienda especializada en pinturas vinílicas, aerosoles e impermeabilizantes. Entrega en CDMX y Mérida.',
    images: ['https://pinturasacuario.com/og-image.jpg'],
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  alternates: {
    canonical: 'https://pinturasacuario.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className={`${inter.className} ${carouselDisplay.variable} ${carouselHeadline.variable}`}>
        <NextAuthProvider>
          <AuthProvider>
            <CustomerAuthProvider>
              <LocationProvider>
                <StoreProvider>
                  <AdminProvider>
                    <CartProvider>
                      <ToastProvider>
                        {children}
                        <LocationModal />
                        <FloatingContactButton />
                      </ToastProvider>
                    </CartProvider>
                  </AdminProvider>
                </StoreProvider>
              </LocationProvider>
            </CustomerAuthProvider>
          </AuthProvider>
        </NextAuthProvider>
        
        {/* Google Analytics - Reemplaza con tu ID real */}
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        
        {/* Google Ads Pixel - Reemplaza con tu ID real */}
        <GoogleAdsPixel conversionId="AW-XXXXXXXXX" />
      </body>
    </html>
  )
}
