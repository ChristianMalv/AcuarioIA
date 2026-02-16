import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Pinturas Acuario</h3>
                <p className="text-sm text-gray-400">Calidad que perdura</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Especialistas en pinturas vinílicas, aerosoles e impermeabilizantes. 
              Más de 20 años brindando calidad profesional para todos tus proyectos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-gray-300 hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/vinilicas" className="text-gray-300 hover:text-white transition-colors">
                  Pinturas Vinílicas
                </Link>
              </li>
              <li>
                <Link href="/aerosoles" className="text-gray-300 hover:text-white transition-colors">
                  Aerosoles
                </Link>
              </li>
              <li>
                <Link href="/impermeabilizantes" className="text-gray-300 hover:text-white transition-colors">
                  Impermeabilizantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Atención al Cliente</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-300 hover:text-white transition-colors">
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-300 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-gray-300 hover:text-white transition-colors">
                  Garantía
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Av. Principal 123<br />
                    Col. Centro<br />
                    Ciudad de México, CDMX 06000
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+52 (55) 1234-5678</p>
                  <p className="text-sm text-gray-400">Lun - Vie: 9:00 - 18:00</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">ventas@pinturasacuario.com</p>
                  <p className="text-sm text-gray-400">Respuesta en 24 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Pinturas Acuario. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
