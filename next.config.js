/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // SEO 최적화를 위한 빌드 최적화
  swcMinify: true,
  poweredByHeader: false,
  // 메타태그 강제 적용을 위한 설정
  generateBuildId: async () => {
    return 'growsome-build-' + Date.now();
  },
};

module.exports = nextConfig;
