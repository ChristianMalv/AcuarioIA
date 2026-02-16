# Configuración de Google OAuth para Pinturas Acuario

## 📋 **Pasos para configurar Google OAuth**

### 1. **Crear proyecto en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ o Google Identity

### 2. **Configurar OAuth 2.0**

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente de OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura las URIs autorizadas:
   - **URIs de origen autorizados**: `http://localhost:3000`
   - **URIs de redirección autorizados**: `http://localhost:3000/api/auth/callback/google`

### 3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env.local` y completa:

```bash
# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-aleatorio-aqui"

# Google OAuth - Obtén estos valores de Google Cloud Console
GOOGLE_CLIENT_ID="tu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
```

### 4. **Generar NEXTAUTH_SECRET**

Ejecuta en terminal:
```bash
openssl rand -base64 32
```

O usa este comando de Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 **Funcionalidades implementadas**

### **Autenticación completa**
- ✅ Login con email/contraseña
- ✅ Login con Google OAuth
- ✅ Registro tradicional
- ✅ Registro automático con Google
- ✅ Gestión de sesiones con NextAuth.js

### **Perfil de usuario**
- ✅ Página de perfil completa
- ✅ Edición de información personal
- ✅ Gestión de direcciones de entrega
- ✅ Historial de pedidos (estructura lista)
- ✅ Productos favoritos (estructura lista)

### **Integración con sistema existente**
- ✅ Compatible con CustomerAuthContext existente
- ✅ Sincronización con base de datos Prisma
- ✅ Manejo de usuarios de Google y tradicionales
- ✅ Preservación de datos existentes

## 🔧 **Estructura de la base de datos**

Los modelos de Prisma han sido actualizados para soportar:

- **Customer**: Campos adicionales para Google OAuth
- **Account**: Modelo de NextAuth.js para cuentas OAuth
- **Session**: Modelo de NextAuth.js para sesiones
- **VerificationToken**: Modelo para tokens de verificación

## 📱 **Páginas actualizadas**

- `/login` - Login con Google OAuth
- `/registro` - Registro con Google OAuth  
- `/perfil` - Perfil completo del cliente
- `/api/auth/[...nextauth]` - Endpoints de NextAuth.js

## 🎯 **Próximos pasos**

1. Configurar las credenciales de Google OAuth
2. Probar el flujo completo de autenticación
3. Implementar historial de pedidos real
4. Agregar sistema de favoritos
5. Configurar notificaciones por email
