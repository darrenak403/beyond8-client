"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import SafeImage from "./SafeImage";
import AnimatedGrid from "@/app/landing/components/AnimatedGrid";
import { useIsMobile } from "@/hooks/useMobile";



export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  
  // Adjust number of products per row based on screen size
  const productsPerRow = isMobile ? 3 : 5;
  const firstRow = products.slice(0, productsPerRow);
  const secondRow = products.slice(productsPerRow, productsPerRow * 2);
  const thirdRow = products.slice(productsPerRow * 2, productsPerRow * 3);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? 500 : 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? -500 : -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className={`${isMobile ? 'h-[220vh] pt-30' : 'h-[300vh]'} overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-[#0a000e] via-[#1a0a1e] to-[#0a000e]`}
    >
      <AnimatedGrid />
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative z-10"
      >
        <motion.div className={`flex flex-row-reverse space-x-reverse ${isMobile ? 'space-x-4 mb-10' : 'space-x-20 mb-20'}`}>
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
        <motion.div className={`flex flex-row ${isMobile ? 'space-x-4 mb-10' : 'space-x-20 mb-20'}`}>
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
        <motion.div className={`flex flex-row-reverse space-x-reverse ${isMobile ? 'space-x-4' : 'space-x-20'}`}>
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
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
    <div className={`max-w-7xl relative z-10 py-50 mx-auto px-4 w-full left-0 top-0 ${isMobile ? 'py-20' : 'py-50'}`}>
      {/* Animated Badge */}
      <motion.div
        className="inline-flex items-center gap-2 pr-4 pl-1 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-6 md:mb-8 max-w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shrink-0">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">Mới</span>
        </div>
        
        <span className="text-white text-sm font-medium tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] truncate">
          {displayedText}
        </span>
      </motion.div>

      {/* Main Title */}
      <h1 className="text-white text-2xl sm:text-5xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
        Học Hết Sức
        <br /> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] animate-pulse-slow">
          AI Hỗ Trợ Hết Mình
        </span>
      </h1>

      {/* Description */}
      <p className="max-w-2xl text-gray-300/90 text-base sm:text-lg md:text-xl mt-8 leading-relaxed font-semibold drop-shadow-md">
        Beyond 8 - Nơi biến hành trình học tập của bạn thành một trải nghiệm tuyệt vời với sự hỗ trợ của trí tuệ nhân tạo.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  isMobile = false,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
  isMobile?: boolean;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className={`group/product ${isMobile ? 'h-48 w-64' : 'h-96 w-[30rem]'} relative shrink-0`}
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <SafeImage
          src={product.thumbnail}
          fill
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-2xl"
          alt={product.title}
        />
      </a>
      {/* <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-br from-[#ad1c9a]/90 via-[#67178d]/90 to-[#f4449b]/90 pointer-events-none transition-opacity duration-300"></div> */}
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
