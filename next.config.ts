import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // Adding likely used domain (uploadthing) just in case, or just stick to unsplash
      }
    ],
  },
};

export default nextConfig;
