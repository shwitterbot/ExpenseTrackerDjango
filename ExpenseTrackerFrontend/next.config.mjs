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
        source: '/backend/users/api-auth/register/',
        destination: `${backendUrl}/users/api-auth/register/`,
      },
      {
        source: '/backend/users/api-auth/login/',
        destination: `${backendUrl}/users/api-auth/login/`,
      },
      {
        source: '/backend/users/api-auth/logout/',
        destination: `${backendUrl}/users/api-auth/logout/`,
      },
      {
        source: '/backend/users/api-auth/users/change_password/',
        destination: `${backendUrl}/users/api-auth/users/change_password/`,
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
