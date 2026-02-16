# Pinturas Acuario - E-commerce Store

Una tienda en línea moderna y profesional para la venta de pinturas vinílicas, aerosoles e impermeabilizantes de la marca Acuario. Construida con Next.js, TailwindCSS y preparada para integración con Stripe para pagos seguros.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y profesional con colores de marca
- **Catálogo Completo**: Navegación por categorías con filtros avanzados
- **Carrito de Compras**: Funcionalidad completa de e-commerce
- **Pagos Seguros**: Integración con Stripe para pagos con tarjeta
- **Responsive**: Optimizado para dispositivos móviles y desktop
- **SEO Optimizado**: Metadatos y estructura optimizada para buscadores

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: TailwindCSS, Lucide React (iconos)
- **Pagos**: Stripe
- **Deployment**: AWS Amplify (configurado)

## 📦 Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd pinturas-acuario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# Stripe Keys (Reemplaza con tus claves reales)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta

# URL base de la aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Deployment en AWS Amplify

### Opción 1: Deployment Automático (Recomendado)

1. **Preparar el proyecto**
   - Asegúrate de que tu código esté en un repositorio de Git (GitHub, GitLab, etc.)
   - El archivo `amplify.yml` ya está configurado

2. **Configurar AWS Amplify**
   - Ve a la consola de AWS Amplify
   - Selecciona "Host your web app"
   - Conecta tu repositorio de Git
   - Amplify detectará automáticamente que es una aplicación Next.js

3. **Variables de Entorno**
   En la consola de Amplify, configura las variables de entorno:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica
   STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
   NEXT_PUBLIC_BASE_URL=https://tu-dominio.amplifyapp.com
   ```

4. **Deploy**
   - Amplify construirá y desplegará automáticamente
   - Cada push al repositorio activará un nuevo deployment

### Opción 2: Deployment Manual

1. **Construir la aplicación**
```bash
npm run build
```

2. **Subir archivos**
   - Sube el contenido de la carpeta `out/` a AWS S3
   - Configura CloudFront para distribución global

## 💳 Configuración de Stripe

1. **Crear cuenta en Stripe**
   - Ve a [stripe.com](https://stripe.com) y crea una cuenta
   - Obtén tus claves API del dashboard

2. **Configurar Webhooks** (Para producción)
   - En el dashboard de Stripe, configura webhooks para eventos de pago
   - URL del webhook: `https://tu-dominio.com/api/webhooks/stripe`

3. **Activar métodos de pago**
   - Configura los métodos de pago que deseas aceptar
   - Tarjetas de crédito/débito están habilitadas por defecto

## 📱 Páginas Incluidas

- **Inicio** (`/`): Página principal con hero y productos destacados
- **Catálogo** (`/catalogo`): Listado completo con filtros
- **Carrito** (`/carrito`): Gestión del carrito de compras
- **Checkout** (`/checkout`): Proceso de pago y información de envío
- **Confirmación** (`/orden-exitosa`): Página de confirmación de pedido

## 🎨 Personalización

### Colores de Marca
Los colores están definidos en `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    50: '#e6f3ff',
    500: '#0073e6',
    600: '#005bb3',
    // ...
  }
}
```

### Productos
Los productos están definidos en `src/lib/products.ts`. Para agregar nuevos productos:
```typescript
{
  id: 'producto-id',
  name: 'Nombre del Producto',
  description: 'Descripción detallada',
  price: 199.99,
  category: 'vinilica', // vinilica, aerosol, impermeabilizante, accesorio
  brand: 'Acuario',
  size: '1 Litro',
  color: 'Blanco',
  stock: 50,
  featured: true // Para productos destacados
}
```

## 💰 Costos de AWS Amplify

**Tier Gratuito** (Primeros 12 meses):
- 1,000 minutos de build por mes
- 15 GB de almacenamiento
- 100 GB de transferencia de datos

**Después del tier gratuito**:
- Build: $0.01 por minuto
- Hosting: $0.15 por GB almacenado por mes
- Transferencia: $0.15 por GB servido

**Estimación para tienda pequeña**: $1-5 USD/mes

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Verificar código con ESLint
```

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:
- Email: soporte@pinturasacuario.com
- Teléfono: +52 (55) 1234-5678

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Nota**: Recuerda reemplazar las claves de Stripe de prueba con las claves de producción antes del lanzamiento oficial.
