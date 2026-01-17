"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const badgeText = "Nền tảng cung cấp khóa học toàn diện";

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
      >
        <source src="/bg-video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Animated Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg mb-6"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <motion.div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">{badgeText}</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Học Vượt Trội Với
          <br />
          Giáo Dục Kết Hợp Cùng AI
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Biến hành trình học tập của bạn thành trải nghiệm thông minh với các khóa học trí tuệ nhân
          tạo, đánh giá do AI tạo ra và phản hồi theo thời gian thực. Trải nghiệm giáo dục được
          thiết kế cho tương lai.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/courses">
            <Button size="lg" className="text-lg px-8 py-6">
              Khám Phá Khóa Học
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            Tìm Hiểu Thêm
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
