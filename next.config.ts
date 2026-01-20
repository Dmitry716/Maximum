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
    domains: ["localhost", "maxximum.by"],
  },
  output: "standalone",
};

export default nextConfig;
