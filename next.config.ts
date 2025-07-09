import type { NextConfig } from "next";
import webpack from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config: webpack.Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
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
  output: 'standalone',
  compiler: {
    styledComponents: true
  },
  images: {
    domains: [
      'api.tosspayments.com',
      'images.unsplash.com',
      'randomuser.me'
    ],
  },
}

export default nextConfig;