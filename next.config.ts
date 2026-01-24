import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bật chế độ standalone để tối ưu Docker image (~100MB)
  output: "standalone",

  // Cấu hình cho phép load ảnh từ các domain bên ngoài
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
