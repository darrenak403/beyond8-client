"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const badgeText = "Nền tảng cung cấp khóa học toàn diện.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
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
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-white">
      {/* Content Container */}
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-between h-full ${isMobile ? 'px-4 py-12' : 'px-6 sm:px-12 lg:px-24 py-16'} gap-8`}>
        
        {/* Left Side - Text Content */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex flex-col items-start justify-center`}>
          {/* Animated Badge with Typing Effect */}
          <motion.div
            className={`inline-flex items-center gap-2 pr-3 px-1 py-1 rounded-full shadow-lg ${isMobile ? 'mb-4' : 'mb-6'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(147, 51, 234, 0.1)",
              border: "1px solid rgba(147, 51, 234, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs font-semibold">Mới</span>
            </div>
            
            <span className={`text-purple-900 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              {displayedText}
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className={`text-gray-900 ${isMobile ? 'text-3xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-bold mb-6 leading-tight`}>
            Học Hết Sức
            <br />
            <span className="text-purple-600">AI hỗ trợ hết mình</span>
          </h1>

          {/* Description */}
          <p className={`text-gray-700 ${isMobile ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'} max-w-xl mb-8 leading-relaxed`}>
            Beyond 8 - Nơi biến hành trình học tập của bạn thành một trải nghiệm tuyệt vời.
          </p>

          {/* CTA Buttons */}
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-col sm:flex-row'} gap-4`}>
            <Link href="/courses" className={isMobile ? 'w-full' : ''}>
              <Button size={isMobile ? "default" : "lg"} className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} cursor-pointer bg-purple-600 hover:bg-purple-700`}>
                Khám Phá Khóa Học
              </Button>
            </Link>
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer`}
            >
              Tìm Hiểu Thêm
            </Button>
          </div>
        </div>

        {/* Right Side - 3D Model Embed */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex items-center justify-start`}>
          <div className="sketchfab-embed-wrapper w-full relative">
            <iframe 
              title="Paladin's book" 
              allowFullScreen 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
              src="https://sketchfab.com/models/09544c73158c4947815ff6d4c57c6e2e/embed?camera=0&dnt=1&autostart=1&autospin=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_controls=0&ui_stop=0&ui_fadeout=0&ui_ar=0&ui_loading=0&preload=1&transparent=1&ui_theme=light"
              className="w-full h-[600px] border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
