import type { NextConfig } from "next";

// Dynamically add the API server hostname so images served from the API are allowed
const apiHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      ...(apiHostname ? [{ protocol: "https" as const, hostname: apiHostname }] : []),
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
