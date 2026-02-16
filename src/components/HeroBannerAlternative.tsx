'use client'

import ImageCarousel from './ImageCarousel'

// Propuesta de imágenes HD alternativas con mejor calidad y temática específica
const heroImagesHD = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=2560&h=1440&fit=crop&crop=center&q=95',
    alt: 'Pinturas Vinílicas Profesionales',
    title: 'Pinturas Vinílicas Premium',
    description: 'Cobertura superior y acabados duraderos para proyectos profesionales'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=2560&h=1440&fit=crop&crop=center&q=95',
    alt: 'Paleta de Colores Profesional',
    title: 'Amplia Gama de Colores',
    description: 'Miles de tonalidades disponibles con sistema de mezcla computarizada'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=2560&h=1440&fit=crop&crop=center&q=95',
    alt: 'Aerosoles y Pinturas en Spray',
    title: 'Aerosoles de Secado Rápido',
    description: 'Tecnología avanzada para acabados perfectos en minutos'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=2560&h=1440&fit=crop&crop=center&q=95',
    alt: 'Herramientas y Accesorios',
    title: 'Herramientas Profesionales',
    description: 'Brochas, rodillos y equipos de la más alta calidad'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=2560&h=1440&fit=crop&crop=center&q=95',
    alt: 'Impermeabilización Profesional',
    title: 'Impermeabilizantes de 10 Años',
    description: 'Protección garantizada contra humedad y filtraciones'
  }
]

// Propuesta adicional con imágenes ultra HD para pantallas 4K
const heroImagesUltraHD = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=3840&h=2160&fit=crop&crop=center&q=100',
    alt: 'Pinturas Vinílicas Ultra HD',
    title: 'Pinturas Vinílicas Premium',
    description: 'Máxima cobertura y durabilidad para proyectos exigentes'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=3840&h=2160&fit=crop&crop=center&q=100',
    alt: 'Laboratorio de Colores',
    title: 'Laboratorio de Color',
    description: 'Tecnología de punta para mezclas exactas y colores únicos'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=3840&h=2160&fit=crop&crop=center&q=100',
    alt: 'Aerosoles Industriales',
    title: 'Aerosoles Industriales',
    description: 'Soluciones profesionales para aplicaciones especializadas'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=3840&h=2160&fit=crop&crop=center&q=100',
    alt: 'Taller Profesional',
    title: 'Equipamiento Profesional',
    description: 'Herramientas y accesorios para resultados excepcionales'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=3840&h=2160&fit=crop&crop=center&q=100',
    alt: 'Impermeabilización Avanzada',
    title: 'Sistemas de Impermeabilización',
    description: 'Tecnología avanzada para protección duradera'
  }
]

interface HeroBannerAlternativeProps {
  quality?: 'hd' | 'ultra-hd'
}

export default function HeroBannerAlternative({ quality = 'hd' }: HeroBannerAlternativeProps) {
  const selectedImages = quality === 'ultra-hd' ? heroImagesUltraHD : heroImagesHD
  
  return (
    <div className="relative w-full">
      <ImageCarousel
        images={selectedImages}
        autoRotate={true}
        rotationInterval={6000} // Slightly longer for HD images
        showIndicators={true}
        showArrows={true}
        className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[400px] max-h-[800px]"
      />
      
      {/* Enhanced gradient overlay for HD images */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 via-transparent to-primary-900/20 pointer-events-none"></div>
    </div>
  )
}
