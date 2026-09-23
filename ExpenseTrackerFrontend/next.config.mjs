/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '')

const nextConfig = {
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/backend/api-auth/register/',
        destination: `${backendUrl}/api-auth/register/`,
      },
      {
        source: '/backend/api-auth/login/',
        destination: `${backendUrl}/api-auth/login/`,
      },
      {
        source: '/backend/api-auth/logout/',
        destination: `${backendUrl}/api-auth/logout/`,
      },
      {
        source: '/backend/api/v1/transactions/:id',
        destination: `${backendUrl}/api/v1/transactions/:id/`,
      },
      {
        source: '/backend/api/v1/transactions',
        destination: `${backendUrl}/api/v1/transactions/`,
      },
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
