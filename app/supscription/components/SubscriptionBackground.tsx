"use client";

import { motion } from "framer-motion";

export function SubscriptionBackground() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
       {/* Base White */}
       <div className="absolute inset-0 bg-white" />

       {/* Moving Gradient Blobs */}
       <motion.div 
         animate={{ 
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1] 
         }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px]"
       />
       <motion.div 
         animate={{ 
            x: [0, -100, 50, 0],
            y: [0, 100, -50, 0],
            scale: [1, 1.1, 0.9, 1] 
         }}
         transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
         className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-200/40 rounded-full blur-[120px]"
       />
       <motion.div 
         animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.3, 0.8, 1] 
         }}
         transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
         className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-pink-200/40 rounded-full blur-[120px]"
       />
       
       {/* Subtle Grid Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>
  );
}
