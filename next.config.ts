/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['your-cdn-domain.com'],
  },
  experimental: {
    serverActions: true,
  },
  reactCompiler: true,
  reactStrictMode: false,
}

module.exports = nextConfig