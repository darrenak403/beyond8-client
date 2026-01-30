"use client";

import { motion } from "framer-motion";

// Background Grid Component with Animation
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)"
        }}
      />
      
      {/* Moving Grid Layer (Parallax/Flow effect) */}
      <motion.div 
        className="absolute inset-[-100%] z-0 opacity-30"
        animate={{ 
          backgroundPosition: ["0px 0px", "80px 80px"]
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 3
        }}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168, 85, 247, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating Particles / Glow Spots */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-[80px]"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/40 rounded-full blur-[60px]"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedGrid;
