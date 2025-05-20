import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/client"],
  // pageExtensions: ["tsx", "ts"],
};

export default nextConfig;
