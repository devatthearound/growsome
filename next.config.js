/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // 주석 처리 - Docker에서 npm start 사용
  
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
  
  // webpack 설정 개선
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 개발 환경에서 webpack 문제 해결
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [],
      }
      // Node.js v23 호환성 문제 해결
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
    }
    
    // 모듈 해결 개선
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // 최신 Node.js 버전 호환성
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })
    
    return config
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
