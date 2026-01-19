"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const badgeText = "Nền tảng cung cấp khóa học toàn diện.";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Force video to play smoothly
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }

    // Typing effect
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < badgeText.length) {
        setDisplayedText(badgeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        preload="none"
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        <source src="/bg-video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/40" />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-start justify-center h-full ${isMobile ? 'px-4' : 'px-6 sm:px-12 lg:px-24'} max-w-7xl mx-auto`}>
        {/* Animated Badge with Typing Effect */}
        <motion.div
          className={`inline-flex items-center gap-2 pr-3 px-1 py-1 rounded-full shadow-lg ${isMobile ? 'mb-4' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-semibold">Mới</span>
          </div>
          
          <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
            {displayedText}
          </span>
        </motion.div>

        {/* Main Title */}
        <h1 className={`text-white ${isMobile ? 'text-3xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-bold mb-6 leading-tight`}>
          Học Hết Sức
          <br />
          AI hỗ trợ hết mình
        </h1>

        {/* Description */}
        <p className={`text-white/90 ${isMobile ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'} max-w-3xl mb-8 leading-relaxed`}>
          Beyond 8 - Nơi biến hành trình học tập của bạn thành một trải nghiệm tuyệt vời.
        </p>

        {/* CTA Buttons */}
        <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-col sm:flex-row'} gap-4`}>
          <Link href="/courses" className={isMobile ? 'w-full' : ''}>
            <Button size={isMobile ? "default" : "lg"} className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} cursor-pointer`}>
              Khám Phá Khóa Học
            </Button>
          </Link>
          <Button
            size={isMobile ? "default" : "lg"}
            variant="outline"
            className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} bg-white/15 border-white/30 text-white hover:bg-white/20 cursor-pointer`}
          >
            Tìm Hiểu Thêm
          </Button>
        </div>
      </div>
    </div>
  );
}
