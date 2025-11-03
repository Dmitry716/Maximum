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
    domains: ["example.com", "127.0.0.1", "maxximum.by"],
  }
};

export default nextConfig;
