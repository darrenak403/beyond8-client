"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Target, Users, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "AI Chatbot Thông Minh",
    description: "Giải đáp mọi thắc mắc 24/7 với độ chính xác cao.",
    icon: Brain,
    className: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-50 to-white",
    iconColor: "text-purple-600",
  },
  {
    title: "Tốc Độ Vượt Trội",
    description: "Phản hồi tức thì, không độ trễ, giúp bạn học tập liền mạch.",
    icon: Zap,
    className: "col-span-1 bg-gradient-to-br from-blue-50 to-white",
    iconColor: "text-blue-600",
  },
  {
    title: "Lộ Trình Cá Nhân Hóa",
    description: "AI phân tích và thiết kế lộ trình học riêng biệt cho từng mục tiêu của bạn.",
    icon: Target,
    className: "col-span-1 bg-gradient-to-br from-pink-50 to-white",
    iconColor: "text-pink-600",
  },
  {
    title: "Kết Nối Cộng Đồng",
    description: "Học tập và thảo luận cùng hàng ngàn học viên khác trên toàn hệ thống.",
    icon: Users,
    className: "col-span-1 md:col-span-2 bg-gradient-to-br from-orange-50 to-white",
    iconColor: "text-orange-600",
  },
   {
    title: "Kho Tài Liệu Khổng Lồ",
    description: "Truy cập không giới hạn vào thư viện bài giảng và bài tập thực hành.",
    icon: BookOpen,
    className: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-green-50 to-white",
    iconColor: "text-green-600",
  },
   {
    title: "Chứng Chỉ Uy Tín",
    description: "Nhận chứng chỉ được công nhận sau mỗi khóa học hoàn thành.",
    icon: Trophy,
    className: "col-span-1 bg-gradient-to-br from-yellow-50 to-white",
    iconColor: "text-yellow-600",
  },

];

export function BenefitsSection() {
  return (
    <section className="py-24 px-4 relative bg-gray-50/50">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-[30%] -translate-y-[50%]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tại Sao Chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Beyond 8?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hơn cả một nền tảng học tập, chúng tôi là người bạn đồng hành thông minh trên con đường chinh phục tri thức của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "p-8 rounded-3xl border-2 border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden",
                item.className
              )}
            >
              <div className={cn("absolute top-0 left-0 w-full h-1.5", item.iconColor.replace("text-", "bg-"))} />
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300", item.iconColor)}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
