/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ 이 줄을 추가하세요
  images: {
    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
}

module.exports = nextConfig
