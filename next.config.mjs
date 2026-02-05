/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // OPTIMIZACIONES
  productionBrowserSourceMaps: false, // Desactiva source maps en prod
  experimental: {
    // Si usas Next.js 14+, activa Turbopack en dev
     turbo: {},
  },
  // Ignora archivos innecesarios en watch
  watchOptions: {
    ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**', '**/.cache/**'],
  },
}

export default nextConfig
