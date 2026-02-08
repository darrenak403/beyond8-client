"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Menu, GraduationCap, BookOpen, LogOut, User, Bell, Crown, Gem, Zap, DollarSign, ShoppingCart } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useMobile";
import { useQuery } from "@tanstack/react-query";
import { instructorRegistrationService } from "@/lib/api/services/fetchInstructorRegistration";
import { useStudentNotificationStatus } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/lib/api/services/fetchCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef } from "react";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { StudentNotificationPanel } from "../widget/student-notification-panel";
import { useSearchCourses } from "@/hooks/useCourse";
import { useDebounce } from "@/hooks/useDebounce";
import SafeImage from "../ui/SafeImage";
import CartPopover from "../widget/CartPopover";
import { useGetCart } from "@/hooks/useOrder";

const CategoryMenu = ({
  Content,
  onSelect,
  selected
}: {
  Content: Category[] | undefined,
  onSelect: (name: string) => void,
  selected: string
}) => {
  const [hoveredParent, setHoveredParent] = useState<Category | null>(null);

  const handleMouseLeave = () => {
    setHoveredParent(null);
  };

  const hasSubmenu = hoveredParent && hoveredParent.subCategories && hoveredParent.subCategories.length > 0;

  return (
    <motion.div
      className="flex flex-col w-[300px] bg-background rounded-md py-2 relative border shadow-md"
      onMouseLeave={handleMouseLeave}
      animate={{ x: hasSubmenu ? -150 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <ScrollArea className="h-auto max-h-[600px]">
        <div className="flex flex-col">
          <button
            onClick={() => onSelect("Tất cả")}
            onMouseEnter={() => setHoveredParent(null)}
            className={cn(
              "w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group",
              selected === "Tất cả"
                ? "bg-muted text-foreground font-medium"
                : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
            )}
          >
            <span>Tất cả</span>
          </button>

          {Content?.map((parent) => (
            <div
              key={parent.id}
              className="relative"
              onMouseEnter={() => setHoveredParent(parent)}
            >
              <button
                onClick={() => {
                  onSelect(parent.name)
                }}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group",
                  hoveredParent?.id === parent.id
                    ? "bg-muted/50 text-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className="truncate">{parent.name}</span>
                {parent.subCategories && parent.subCategories.length > 0 && (
                  <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50 group-hover:text-foreground/80" />
                )}
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AnimatePresence>
        {hasSubmenu && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[100%] top-[-1px] h-[calc(100%+2px)] w-[300px] bg-background border rounded-md shadow-lg ml-1 overflow-hidden z-50"
          >
            <div className="px-5 py-3 font-semibold text-base text-foreground/70 border-b mx-5 mb-2 mt-2">
              {hoveredParent!.name}
            </div>
            <ScrollArea className="h-[calc(100%-60px)] px-2">
              <div className="flex flex-col py-2">

                {hoveredParent!.subCategories!.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelect(sub.name)}
                    className="flex items-center justify-between w-full px-5 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors group rounded-md"
                  >
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Search suggestions dropdown component
const SearchSuggestions = ({
  keyword,
  isOpen,
  onSelect,
}: {
  keyword: string;
  isOpen: boolean;
  onSelect: (keyword: string) => void;
}) => {
  const { courses, isLoading } = useSearchCourses(
    {
      keyword,
      pageNumber: 1,
      pageSize: 10,
      isDescending: true,
    }
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 right-0 top-full mt-2 bg-background border rounded-2xl shadow-xl z-50 max-h-[360px] overflow-hidden"
        >
          <div className="py-2">
            {isLoading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Đang tìm kiếm khóa học...
              </div>
            )}

            {!isLoading && courses.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Không tìm thấy khóa học nào.
              </div>
            )}

            {!isLoading && courses.length > 0 && (
              <ul className="max-h-[320px] overflow-y-auto">
                {courses.map((course) => (
                  <li key={course.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(course.title);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/70 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <SafeImage
                          src={formatImageUrl(course.thumbnailUrl) || "/bg-web.jpg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Text info */}
                      <div className="flex-1 flex flex-col items-start">
                        <span className="text-sm font-medium line-clamp-1">
                          {course.title}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {course.instructorName} • {course.categoryName}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PriceFilterMenu = ({
  minPrice,
  maxPrice,
  onPriceChange,
  onApply,
  onClear,
  onPriceDisplayChange
}: {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  onApply: () => void;
  onClear: () => void;
  onPriceDisplayChange?: (display: string) => void;
}) => {
  const router = useRouter();
  const MAX_PRICE = 5000000; // 5 triệu
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Mock data for price distribution chart
  const priceDistributionData = [
    { price: 0, count: 0 },
    { price: 0.5, count: 150 },
    { price: 1, count: 200 },
    { price: 1.5, count: 180 },
    { price: 2, count: 120 },
    { price: 2.5, count: 80 },
    { price: 3, count: 40 },
    { price: 3.5, count: 20 },
    { price: 4, count: 10 },
    { price: 4.5, count: 5 },
    { price: 5, count: 2 },
  ];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)}tr`;
    }
    return `${price.toLocaleString()}`;
  };

  const formatPriceInput = (price: number) => {
    if (price === 0) return '';
    return price.toLocaleString('vi-VN');
  };

  const presetRanges = [
    { label: 'Dưới 1tr', min: 0, max: 1000000 },
    { label: '1-2tr', min: 1000000, max: 2000000 },
    { label: '2-3tr', min: 2000000, max: 3000000 },
    { label: '3-4tr', min: 3000000, max: 4000000 },
    { label: '4-5tr', min: 4000000, max: 5000000 },
    { label: 'Tất cả', min: 0, max: MAX_PRICE },
  ];

  const formatPriceDisplay = (min: number, max: number) => {
    if (min === 0 && max === MAX_PRICE) {
      return "Mức giá";
    }
    const formatPrice = (p: number) => {
      if (p >= 1000000) return `${(p / 1000000).toFixed(0)}tr`;
      return `${p.toLocaleString()}`;
    };
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  const handleSliderChange = (values: number[]) => {
    const newMin = values[0];
    const newMax = values[1];
    setLocalMinPrice(newMin);
    setLocalMaxPrice(newMax);
    if (onPriceDisplayChange) {
      onPriceDisplayChange(formatPriceDisplay(newMin, newMax));
    }
  };

  const handlePresetClick = (min: number, max: number) => {
    setLocalMinPrice(min);
    setLocalMaxPrice(max);
    if (onPriceDisplayChange) {
      onPriceDisplayChange(formatPriceDisplay(min, max));
    }
  };

  const handleApply = () => {
    onPriceChange(localMinPrice, localMaxPrice);
    onApply();
    
    // Navigate to courses page with current filters
    const params = new URLSearchParams();
    if (localMinPrice > 0) {
      params.set('minPrice', localMinPrice.toString());
    }
    if (localMaxPrice < 5000000) {
      params.set('maxPrice', localMaxPrice.toString());
    }
    router.push(`/courses?${params.toString()}`);
  };

  const handleClear = () => {
    setLocalMinPrice(0);
    setLocalMaxPrice(MAX_PRICE);
    onPriceChange(0, MAX_PRICE);
    onClear();
  };

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      const newMin = 0;
      setLocalMinPrice(newMin);
      if (onPriceDisplayChange) {
        onPriceDisplayChange(formatPriceDisplay(newMin, localMaxPrice));
      }
      return;
    }
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), localMaxPrice);
    setLocalMinPrice(clampedValue);
    if (onPriceDisplayChange) {
      onPriceDisplayChange(formatPriceDisplay(clampedValue, localMaxPrice));
    }
  };

  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      const newMax = MAX_PRICE;
      setLocalMaxPrice(newMax);
      if (onPriceDisplayChange) {
        onPriceDisplayChange(formatPriceDisplay(localMinPrice, newMax));
      }
      return;
    }
    const numValue = parseInt(value) || MAX_PRICE;
    const clampedValue = Math.max(Math.min(numValue, MAX_PRICE), localMinPrice);
    setLocalMaxPrice(clampedValue);
    if (onPriceDisplayChange) {
      onPriceDisplayChange(formatPriceDisplay(localMinPrice, clampedValue));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-[400px] bg-background rounded-lg border shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-foreground">Mức giá</h3>

      {/* Price Input Fields */}
      <div className="flex flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground mb-2 block">Giá tối thiểu</label>
          <div className="relative">
            <Input
              type="text"
              value={formatPriceInput(localMinPrice)}
              onChange={handleMinPriceInput}
              className="pr-12"
              placeholder="Từ"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10">VND</span>
          </div>
        </div>

        <div className="flex-1">
          <label className="text-sm text-muted-foreground mb-2 block">Giá tối đa</label>
          <div className="relative">
            <Input
              type="text"
              value={formatPriceInput(localMaxPrice)}
              onChange={handleMaxPriceInput}
              className="pr-12"
              placeholder="Đến"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10">VND</span>
          </div>
        </div>
      </div>

      {/* Price Distribution Chart */}
      <div className="mb-6">
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceDistributionData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                stroke="#9333ea"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              <XAxis dataKey="price" hide />
              <YAxis hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const priceInMillion = data.price;
                    const count = data.count;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="text-sm font-semibold text-foreground">
                          {priceInMillion} triệu VND
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tổng số course: <span className="font-semibold text-foreground">{count}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6">
        <Slider
          value={[localMinPrice, localMaxPrice]}
          onValueChange={handleSliderChange}
          min={0}
          max={MAX_PRICE}
          step={100000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      {/* Preset Price Range Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {presetRanges.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset.min, preset.max)}
            className={cn(
              "text-xs",
              localMinPrice === preset.min && localMaxPrice === preset.max
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-gray-200 hover:text-black"
            )}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1 hover:bg-gray-200 hover:text-black"
        >
          Xóa tất cả
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 "
        >
          Áp dụng
        </Button>
      </div>
    </motion.div>
  );
};

export function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const { subscription } = useSubscription();
  const { status: notificationStatus } = useStudentNotificationStatus({ enabled: isAuthenticated });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [priceDisplay, setPriceDisplay] = useState("Mức giá");

  const [isOpen, setIsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { mutateLogout } = useLogout();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cart } = useGetCart({ enabled: isAuthenticated });

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use framer-motion scroll detection similar to resizable-navbar
  const { scrollY } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const isInstructor = () => {
    if (!userProfile?.roles) return false;
    const roles = Array.isArray(userProfile.roles) ? userProfile.roles : [userProfile.roles];
    return roles.includes("ROLE_INSTRUCTOR");
  };

  const isStudent = () => {
    if (!userProfile?.roles) return false;
    const roles = Array.isArray(userProfile.roles) ? userProfile.roles : [userProfile.roles];
    return roles.length === 1 && roles.includes("ROLE_STUDENT");
  };

  const { data: checkApplyData, isLoading: isCheckingApply, error: checkApplyError } = useQuery({
    queryKey: ["instructor-check-apply"],
    queryFn: () => instructorRegistrationService.checkApply(),
    enabled: isAuthenticated && (isStudent() || isInstructor()),
    retry: false,
  });
  const showInstructorDashboard = checkApplyData?.isSuccess && checkApplyData?.data?.isApplied && checkApplyData?.data?.verificationStatus === "Verified";

  const showRegisterInstructor = (!isCheckingApply && checkApplyData !== undefined && checkApplyData.isSuccess === false) ||
    (!isCheckingApply && checkApplyError);

  const { categories: categoryData } = useCategory();

  const getAvatarFallback = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || 'U';
    }
    if (userProfile?.email) {
      return userProfile.email.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getGradientStyle = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA": 
        return "conic-gradient(from 0deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)";
      case "PRO": 
        return "conic-gradient(from 0deg, #EA4335 0% 25%, #4285F4 25% 50%, #34A853 50% 75%, #FBBC05 75% 100%)";
      case "STANDARD":
      case "PLUS": 
        return "conic-gradient(from 0deg, #2563eb 0% 50%, #06b6d4 50% 100%)";
      default: 
        return null;
    }
  };

  const getPlanIcon = (code?: string) => {
      switch (code?.toUpperCase()) {
        case "ULTRA":
          return <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />;
        case "PRO":
          return <Gem className="w-3 h-3 text-blue-500 fill-blue-500" />;
        case "BASIC":
        case "PLUS":
          return <Zap className="w-3 h-3 text-purple-500 fill-purple-500" />;
        default:
          return null;
      }
    };


  const handleLogout = () => {
    mutateLogout();
  };

  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    params.set("pageNumber", "1");
    params.set("pageSize", "10");
    params.set("isDescending", "true");
    router.push(`/courses?${params.toString()}`);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    
    // Update display text
    if (min === 0 && max === 5000000) {
      setPriceDisplay("Mức giá");
    } else {
      const formatPrice = (p: number) => {
        if (p >= 1000000) return `${(p / 1000000).toFixed(0)}tr`;
        return `${p.toLocaleString()}`;
      };
      setPriceDisplay(`${formatPrice(min)} - ${formatPrice(max)}`);
    }
  };



  return (
    <header
      ref={headerRef}
      className="sticky inset-x-0 top-0 z-50 w-full"
    >
      <motion.div
        ref={containerRef}
        animate={{
          backdropFilter: isScrolled && !isMobile ? "blur(10px)" : "none",
          boxShadow: isScrolled && !isMobile
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: isScrolled && !isMobile ? "75%" : "100%",
          y: isScrolled && !isMobile ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        style={{
          minWidth: isMobile ? undefined : "800px",
        }}
        className={cn(
          "relative z-[60] mx-auto w-full items-center rounded-full justify-between self-start bg-transparent px-4 py-2",
          isScrolled && !isMobile && "bg-white/80 flex flex-row items-center justify-between px-14",
          !isScrolled && !isMobile && "grid grid-cols-3 px-14",
          isMobile ? "flex items-center justify-between gap-2 px-3 py-2" : "hidden lg:grid lg:flex"
        )}
      >
        <div className={cn(
          "flex items-center gap-3 flex-shrink-0",
          isScrolled && !isMobile && "mr-4"
        )}>
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/white-text-logo.svg"
              alt="Beyond 8"
              width={isMobile ? 80 : 100}
              height={isMobile ? 80 : 100}
              className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
            />
          </Link>

          {!isMobile && (
            <Link href="/supscription">
              <div className="relative group cursor-pointer">
                <Button 
                  className="relative px-6 py-2 bg-white rounded-xl leading-none flex items-center gap-2 border border-purple-500/50 hover:bg-gray-50 text-black"
                  variant="ghost"
                >
                  <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Gói Pro Max</span>
                </Button>
              </div>
            </Link>
          )}
        </div>

        {!isMobile && (
          <form onSubmit={handleSearch} className={cn(
            "flex justify-center",
            isScrolled ? "flex-1 " : "col-start-2"
          )} id="search-form">
            <div className="relative flex items-center rounded-full bg-background shadow-lg overflow-visible w-full max-w-[500px]">
              <div className="flex-1 flex items-center pl-4" id="search-input-section">
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-0 bg-transparent"
                />
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="flex items-center justify-between pr-1">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
                  <DropdownMenuTrigger
                    className="flex items-center justify-between px-3 py-2 text-sm focus:outline-none cursor-pointer min-w-[120px]"
                  >
                    <span className="truncate max-w-[100px]">{selectedCategory}</span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={10}
                    className="p-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 !overflow-visible border-none bg-transparent shadow-none w-auto"
                  >
                    <CategoryMenu Content={categoryData?.data} onSelect={(name) => {
                      setSelectedCategory(name);
                      setIsOpen(false);
                    }} selected={selectedCategory} />
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-px bg-border" />

                <DropdownMenu open={isPriceOpen} onOpenChange={setIsPriceOpen} modal={false}>
                  <DropdownMenuTrigger
                    className="flex items-center justify-between px-3 py-2 text-sm focus:outline-none cursor-pointer min-w-[120px]"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="truncate max-w-[100px]">{priceDisplay}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={10}
                    className="p-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 !overflow-visible border-none bg-transparent shadow-none w-auto"
                  >
                    <PriceFilterMenu
                      key={`${minPrice}-${maxPrice}`}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      onPriceChange={handlePriceChange}
                      onApply={() => setIsPriceOpen(false)}
                      onClear={() => setIsPriceOpen(false)}
                      onPriceDisplayChange={setPriceDisplay}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  type="submit"
                  className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border border-purple-500 cursor-pointer ml-1"
                >
                  <Search className="h-4 w-4 text-white" />
                </button>
              </div>
              {/* Search suggestions dropdown */}
              <SearchSuggestions
                keyword={debouncedSearch}
                isOpen={isSearchFocused && !!debouncedSearch.trim()}
                onSelect={(keyword) => {
                  const params = new URLSearchParams();
                  params.set("search", keyword);
                  params.set("pageNumber", "1");
                  params.set("pageSize", "10");
                  params.set("isDescending", "true");
                  router.push(`/courses?${params.toString()}`);
                  setSearchQuery("");
                }}
              />
            </div>
          </form>
        )}

        {!isMobile && (
          <nav className={cn(
            "flex items-center gap-3 flex-shrink-0",
            isScrolled ? "" : "justify-end col-start-3"
          )}>
          {isAuthenticated ? (
            <>
              {!isMobile && (
                showInstructorDashboard ? (
                  <Link href="/instructor/dashboard">
                    <Button variant="outline" size="sm" className="cursor-pointer gap-2 hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground rounded-xl">
                      <GraduationCap className="h-4 w-4" />
                      Trang giảng viên
                    </Button>
                  </Link>
                ) : showRegisterInstructor ? (
                  <Link href="/instructor-registration">
                    <Button variant="outline" size="sm" className="cursor-pointer gap-2 hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground rounded-xl">
                      <GraduationCap className="h-4 w-4" />
                      Đăng ký giảng viên
                    </Button>
                  </Link>
                ) : null
              )}

              {/* {subscription?.subscriptionPlan && !isMobile && (
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all duration-300 animate-in fade-in zoom-in duration-500 font-bold px-3 py-1 text-[12px] uppercase tracking-wider"
                  >
                    {subscription.subscriptionPlan.name}
                  </Badge>
                </div>
              )} */}

              {/* Cart Icon */}
              <div
                className="relative"
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative cursor-pointer bg-black/[0.03] hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground ${isMobile ? 'h-9 w-9' : ''}`}
                >
                  <ShoppingCart className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  {cart && cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center px-1 z-10">
                      <span className="relative inline-flex rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 bg-gradient-to-r from-brand-magenta to-brand-purple border-[2px] border-white text-[10px] font-bold text-white">
                        {cart.totalItems > 99 ? '99+' : cart.totalItems}
                      </span>
                    </span>
                  )}
                </Button>
                <CartPopover 
                  isOpen={isCartOpen} 
                  onClose={() => setIsCartOpen(false)}
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                />
              </div>

              {isLoading ? (
                <Skeleton className={`${isMobile ? 'h-9 w-9' : 'h-11 w-11'} rounded-full`} />
              ) : (
                <Link href="/mybeyond?tab=myprofile" className="cursor-pointer">
                  <div 
                    className={`relative p-[2px] rounded-full ${isMobile ? "w-9 h-9" : "w-11 h-11"} flex items-center justify-center transition-all duration-300 hover:scale-105`}
                    style={{ 
                      background: getGradientStyle(subscription?.subscriptionPlan?.code) || '#c084fc' // Default to gray-200 equivalent
                    }}
                  >
                    <Avatar className={`${isMobile ? 'h-full w-full' : 'h-full w-full'}`}>
                      <AvatarImage src={formatImageUrl(userProfile?.avatarUrl) || undefined} alt={userProfile?.fullName} className="object-cover" />
                      <AvatarFallback className={`bg-purple-100 text-purple-700 font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Plan Icon */}
                    {getPlanIcon(subscription?.subscriptionPlan?.code) && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm z-30 flex items-center justify-center border border-gray-100">
                        {getPlanIcon(subscription?.subscriptionPlan?.code)}
                      </div>
                    )}
                    {userProfile?.isActive && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 flex z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-green-400 to-green-400 border-[2px] border-white"></span>
                    </span>
                    )}
                  </div>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`relative cursor-pointer bg-black/[0.03] hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground ${isMobile ? 'h-9 w-9' : ''}`}>
                    <Menu className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                    {notificationStatus && !notificationStatus.isRead && notificationStatus.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 flex z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-purple-600 to-indigo-600 border-[2px] border-white"></span>
                      </span>                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userProfile && (
                    <>
                      <div className="px-2 py-1.5 text-sm">
                        <p className="font-medium">{userProfile.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/mybeyond?tab=myprofile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground"
                    onSelect={() => setIsNotificationOpen(true)}
                  >
                    <div className="flex flex-row justify-between items-center gap-2 ">
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex">
                          <Bell className="h-4 w-4" />
                        </div>
                        Thông báo
                        </div> 
                        <div>
                        {notificationStatus && !notificationStatus.isRead && notificationStatus.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center px-1 z-10">
                            <span className="relative inline-flex rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 bg-gradient-to-r from-purple-600 to-indigo-600 border-[2px] border-white text-[10px] font-bold text-white">
                              {notificationStatus.unreadCount > 99 ? '99+' : notificationStatus.unreadCount}
                            </span>
                          </span>
                        )}
                        </div>                   
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/mybeyond?tab=mycourse" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Khóa học của tôi
                    </Link>
                  </DropdownMenuItem>
                  {isMobile && (showInstructorDashboard || showRegisterInstructor) && (
                    <>
                      <DropdownMenuSeparator />
                      {showInstructorDashboard ? (
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                          <Link href="/instructor/dashboard" className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Trang giảng viên
                          </Link>
                        </DropdownMenuItem>
                      ) : showRegisterInstructor ? (
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                          <Link href="/instructor-registration" className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Đăng ký giảng viên
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-100 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="cursor-pointer rounded-xl hover:bg-gray-100 hover:text-black" variant="outline" size={isMobile ? "sm" : "sm"}>Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer rounded-xl" size={isMobile ? "sm" : "sm"}>Đăng ký</Button>
              </Link>
            </>
          )}
          </nav>
        )}
      </motion.div>
      <StudentNotificationPanel open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
    </header>
  );
}
