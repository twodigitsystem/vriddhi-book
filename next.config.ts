import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/client"],
  // pageExtensions: ["tsx", "ts"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // This is required for uploadthing to work with next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
