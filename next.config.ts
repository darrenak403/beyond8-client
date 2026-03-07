import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // Adding likely used domain (uploadthing) just in case, or just stick to unsplash
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "d30z0qh7rhzgt8.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
