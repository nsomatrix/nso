import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.108",
    "192.168.*",
    "10.0.*",
    "localhost",
  ],
};

export default nextConfig;


