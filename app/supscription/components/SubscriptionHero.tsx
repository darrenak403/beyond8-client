"use client";

import { motion } from "framer-motion";

export function SubscriptionHero() {
  return (
    <div className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-visible">
      
      <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
        {/* <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-10 hover:shadow-lg transition-shadow cursor-default"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-gray-800 tracking-wide uppercase">Nâng cấp ngay hôm nay</span>
        </motion.div> */}

        <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8 leading-[1.1] md:leading-[1.1]"
        >
            Mở Khóa <br className="md:hidden" />
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x bg-[length:200%_auto]">
                    Sức Mạnh AI
                </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Trải nghiệm học tập vượt trội với công nghệ AI tiên tiến nhất. <br className="hidden md:block"/>
          Lộ trình cá nhân hóa, hỗ trợ 24/7 và hơn thế nữa.
        </motion.p>

        {/* Toggle (Enhanced) */}
        <div className="flex items-center justify-center gap-6 bg-white p-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] inline-flex border border-gray-100">
             <span className="text-gray-500 font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer hover:text-gray-900">Thanh toán tháng</span>
             <div className="w-16 h-8 bg-gray-100 rounded-full p-1 cursor-not-allowed border border-gray-200 relative">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm border border-gray-100 translate-x-0" />
             </div>
             <span className="text-gray-900 font-bold px-4 py-2 rounded-full flex items-center gap-2">
               Thanh toán năm 
               <span className="text-[10px] font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm shadow-green-200">
                 Coming soon
               </span>
             </span>
        </div>
      </div>
    </div>
  );
}
