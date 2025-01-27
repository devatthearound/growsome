/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['via.placeholder.com'], // 실제 이미지 도메인으로 변경 필요
  },
}

module.exports = nextConfig 