import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 빌드 ID 강제 변경으로 캐시 문제 해결
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  
  // 프로덕션에서 standalone 모드 사용
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  compiler: {
    styledComponents: true
  },
  images: {
    domains: [
      'api.tosspayments.com',
      'images.unsplash.com',
      'randomuser.me',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
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
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.tosspayments.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // GraphQL Apollo Studio CORS 설정
  async headers() {
    return [
      {
        source: '/api/graphql',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

export default nextConfig;
