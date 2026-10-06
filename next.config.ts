import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || (isProd ? "/nso" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
