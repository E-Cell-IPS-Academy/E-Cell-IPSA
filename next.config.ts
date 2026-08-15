import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js / @react-three/fiber ship ESM that benefits from being
  // transpiled through Next's pipeline rather than treated as external.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  eslint: {
    // Linting is run separately via `npm run lint`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
