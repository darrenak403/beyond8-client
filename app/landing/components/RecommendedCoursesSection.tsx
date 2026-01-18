"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function RecommendedCoursesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrent(api.selectedScrollSnap());
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  // Auto-play carousel
  useEffect(() => {
    if (!api) return;

    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(autoplay);
  }, [api]);

  const carouselData = [
    {
      id: 1,
      src: "/carousel 1.svg",
      alt: "Ưu đãi Năm mới",
      badge: "Special Offer",
      title: "Ưu đãi Năm mới",
      description: "Bắt đầu năm mới với ưu đãi đặc biệt!",
      link: "/courses",
    },
    {
      id: 2,
      src: "/carousel 2.svg",
      alt: "Học Ngôn ngữ",
      badge: "Language Learning",
      title: "Học Ngôn ngữ",
      description: "Tự tin giao tiếp và vươn ra sân chơi toàn cầu.",
      link: "/courses?category=language",
    },
    {
      id: 3,
      src: "/carousel 3.svg",
      alt: "Làm chủ Code",
      badge: "Programming & Tech",
      title: "Làm chủ Code",
      description: "Từ cơ bản đến chuyên sâu, sẵn sàng cho mọi thử thách IT.",
      link: "/courses?category=technology",
    },
    {
      id: 4,
      src: "/carousel 4.svg",
      alt: "Design & Sáng tạo",
      badge: "Design & Creative",
      title: "Design & Sáng tạo",
      description: "Biến ý tưởng thành tác phẩm nghệ thuật độc đáo.",
      link: "/courses?category=design",
    },
    {
      id: 5,
      src: "/carousel 5.svg",
      alt: "Tư duy chiến lược Marketing",
      badge: "Marketing & Business",
      title: "Tư duy chiến lược Marketing",
      description: "Nắm vững nghệ thuật quản trị và dẫn đầu thị trường cạnh tranh.",
      link: "/courses?category=marketing",
    },
    {
      id: 6,
      src: "/carousel 6.svg",
      alt: "Đón đầu kỷ nguyên AI",
      badge: "AI & Machine Learning",
      title: "Đón đầu kỷ nguyên AI",
      description: "Học cách tương tác với AI và tăng hiệu suất làm việc lên gấp 10 lần.",
      link: "/courses?category=ai",
    },
  ];

  const currentData = carouselData[current];

  return (
    <section className="py-20 bg-muted/30">
      <div className="px-12 sm:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Content - 4 columns */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-medium">{currentData.badge}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3">{currentData.title}</h2>

                <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                  {currentData.description}
                </p>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {carouselData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        current === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Carousel - 8 columns */}
          <div className="lg:col-span-8 relative">
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {carouselData.map((item) => (
                  <CarouselItem key={item.id} className="relative">
                    <Link href={item.link || "/courses"} className="block">
                      <div className="relative w-full aspect-[4/1] rounded-2xl overflow-hidden group cursor-pointer">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={item.id === 1}
                        />
                        {/* Overlay with text on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Buttons - At the outer edges */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full z-10 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full z-10 cursor-pointer" 
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
