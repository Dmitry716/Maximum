import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["localhost", "maxximum.by", "192.168.0.15"],
  },
  allowedDevOrigins: ["192.168.0.15"],
  output: "standalone",
};

export default nextConfig;
