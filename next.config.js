/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  hostname: '0.0.0.0',
  reactStrictMode: true
};

module.exports = nextConfig; 