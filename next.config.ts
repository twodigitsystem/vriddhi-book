import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/client"],
  // pageExtensions: ["tsx", "ts"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
