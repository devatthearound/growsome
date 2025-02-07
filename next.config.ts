import type { NextConfig } from "next";
import webpack from "webpack";
// const nextConfig: NextConfig = {
//   /* config options here */
//   output: 'standalone',
//   styledComponents: true,
// };

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
}

module.exports = nextConfig;
export default nextConfig;
