/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ 이 줄을 추가하세요
  
  // 프리렌더링 오류 방지
  trailingSlash: false,
  
  typescript: {
    // ⚠️ 빌드 시 TypeScript 오류를 무시합니다 (프로덕션에서는 제거해야 함)
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // 빌드 시 ESLint 오류 무시
    ignoreDuringBuilds: true,
  },
  
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
  },
  serverExternalPackages: ['prisma'],
}

module.exports = nextConfig
