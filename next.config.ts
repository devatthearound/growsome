import type { NextConfig } from "next";
import webpack from "webpack";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config: webpack.Configuration, { isServer }: { isServer: boolean }) => {
    // TypeScript path mapping 지원 강화
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/services': path.resolve(__dirname, 'src/services'),
    };
    
    // 경로 해결 옵션 강화
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve?.fallback,
        fs: false,
        "node:fs/promises": false,
        module: false,
        perf_hooks: false,
      };
    }
    return config;
  },
  // output: 'standalone', // 개발 환경에서는 주석 처리
  // output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
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