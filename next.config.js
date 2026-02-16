/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true
  },
  // Comentamos output: 'export' para desarrollo con rutas dinámicas
  // output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true
}

module.exports = nextConfig
