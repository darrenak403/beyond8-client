"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Nguyễn Văn An",
    role: "Sinh viên ĐH Bách Khoa",
    content: "Beyond 8 đã thay đổi hoàn toàn cách tôi học lập trình. AI giải thích cực kỳ dễ hiểu và kiên nhẫn!",
    avatar: "A",
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Trần Thị Mai",
    role: "Designer Freelancer",
    content: "Gói Pro rất đáng tiền. Tôi dùng AI để brainstorm ý tưởng thiết kế mỗi ngày. Không thể thiếu nó được.",
    avatar: "M",
    color: "bg-pink-100 text-pink-600"
  },
  {
    name: "Lê Minh Tuấn",
    role: "Marketing Manager",
    content: "Tôi thích tính năng phân tích lộ trình. Nó giúp tôi biết mình đang yếu ở đâu và cần cải thiện gì.",
    avatar: "T",
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "Phạm Hoàng Yến",
    role: "Học sinh THPT",
    content: "Nhờ Beyond 8 mà điểm Toán của tôi đã cải thiện rõ rệt. Cảm ơn đội ngũ phát triển!",
    avatar: "Y",
    color: "bg-green-100 text-green-600"
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-[20%] -translate-y-[20%]" />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Được Tin Dùng Bởi <span className="text-purple-600">Hàng Ngàn</span> Học Viên</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Xem người dùng nói gì về trải nghiệm học tập cùng AI tại Beyond 8.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm h-full flex flex-col hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                >
                  <Quote className="w-8 h-8 text-purple-200 mb-4 fill-current" />
                  
                  <p className="text-gray-700 text-lg flex-grow mb-6 leading-relaxed italic">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src="" />
                      <AvatarFallback className={item.color}>{item.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.role}</p>
                    </div>

                    <div className="ml-auto flex gap-0.5">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                       ))}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8 md:hidden">
             {/* Mobile indicators could go here */}
          </div>
          <CarouselPrevious className="hidden md:flex -left-12 opacity-50 hover:opacity-100" />
          <CarouselNext className="hidden md:flex -right-12 opacity-50 hover:opacity-100" />
        </Carousel>
      </div>
    </section>
  );
}
