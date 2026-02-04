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

    </div>
  );
};

export default AnimatedGrid;
