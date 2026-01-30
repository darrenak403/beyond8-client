"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import ModelViewer from "./ModelViewer";
import AnimatedGrid from "./AnimatedGrid";


export default function HeroSection() {
  const badgeText = "Nền tảng cung cấp khóa học toàn diện.";
  const [displayedText, setDisplayedText] = useState("");
  const isMobile = useIsMobile();

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
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0f]">
      {/* Dynamic Background */}
      <AnimatedGrid />
      
      {/* Dark Overlay for Depth - Reduced opacity to let grid show through */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/20 to-[#0a0a0f] pointer-events-none" />

      {/* Content */}
      <div className="relative w-full mx-auto z-10 flex flex-col md:flex-row items-center justify-between h-full max-w-[1500px] gap-8 md:gap-12 py-12 md:py-0">
        
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
          {/* Animated Badge */}
          <motion.div
            className="inline-flex items-center gap-2 pr-4 pl-1 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Mới</span>
            </div>
            
            <span className="text-white text-sm font-medium tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              {displayedText}
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-white text-5xl sm:text-5xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Học Hết Sức
            <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] animate-pulse-slow">
              AI Hỗ Trợ Hết Mình
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300/90 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed font-light drop-shadow-md">
            Beyond 8 - Nơi biến hành trình học tập của bạn thành một trải nghiệm tuyệt vời với sự hỗ trợ của trí tuệ nhân tạo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8 py-7 rounded-2xl hover:from-purple-500 hover:to-indigo-500 w-full sm:w-auto shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="font-semibold text-white relative z-10">Khám Phá Khóa Học</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-7 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-2xl w-full sm:w-auto backdrop-blur-md transition-all hover:scale-105 shadow-lg border relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="font-medium relative z-10">Tìm Hiểu Thêm</span>
            </Button>
          </div>
        </div>

        {/* Right: 3D Model */}
        <div className="w-full md:w-1/2 flex items-center justify-center h-[50vh] md:h-[80vh]">
           <div className="w-full h-full relative cursor-move drop-shadow-[0_0_60px_rgba(168,85,247,0.25)]">
              <ModelViewer />
           </div>
        </div>

      </div>
    </div>
  );
}