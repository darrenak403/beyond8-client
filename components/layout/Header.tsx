"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Menu, GraduationCap, BookOpen, LogOut, User, Bell, Crown, Gem, Zap } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useMobile";
import { useQuery } from "@tanstack/react-query";
import { instructorRegistrationService } from "@/lib/api/services/fetchInstructorRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/lib/api/services/fetchCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/widget/notification-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";

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

export function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const { subscription } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutateLogout } = useLogout();

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldCollapse = scrollY > 100;

      if (shouldCollapse !== isScrolled) {
        setIsScrolled(shouldCollapse);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isScrolled]);

  useEffect(() => {
    if (isMobile) return;

    const header = headerRef.current;
    const container = containerRef.current;
    const logo = logoRef.current;
    const searchForm = searchFormRef.current;
    const searchContainer = searchContainerRef.current;
    const nav = navRef.current;

    if (!header || !container || !logo || !searchForm || !searchContainer || !nav) return;

    const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power2.out" } });

    if (isScrolled) {
      const containerRect = container.getBoundingClientRect();
      const searchFormRect = searchForm.getBoundingClientRect();
      const searchFormCenterX = searchFormRect.left + searchFormRect.width / 2 - containerRect.left;

      const logoRect = logo.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const logoCenterX = logoRect.left + logoRect.width / 2 - containerRect.left;
      const navCenterX = navRect.left + navRect.width / 2 - containerRect.left;

      const logoMoveX = searchFormCenterX - logoCenterX;
      const navMoveX = searchFormCenterX - navCenterX;

      tl.to(logo, {
        x: logoMoveX,
        scale: 0.2,
        opacity: 0,
        width: 0,
        duration: 0.5,
        ease: "power2.in",
        pointerEvents: "none",
        overflow: "hidden",
      })
        .to(nav, {
          x: navMoveX,
          scale: 0.2,
          opacity: 0,
          width: 0,
          duration: 0.5,
          ease: "power2.in",
          pointerEvents: "none",
          overflow: "hidden",
        }, "<")
        .to(
          header,
          {
            padding: "8px 0",
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.2"
        )
        .to(
          container,
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 0",
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1"
        )
        .to(
          searchForm,
          {
            width: "auto",
            maxWidth: "500px",
            flex: "none",
            duration: 0.4,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          searchContainer,
          {
            width: "100%",
            padding: "4px 4px 4px 16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            duration: 0.4,
            ease: "power2.out",
          },
          "<"
        );
    } else {
      tl.to(
        container,
        {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          justifyContent: "",
          alignItems: "center",
          padding: "",
          duration: 0.4,
          ease: "sine.out",
        }
      )
        .to(
          header,
          {
            padding: "",
            duration: 0.5,
            ease: "sine.out",
          },
          "<0.1"
        )
        .to(
          logo,
          {
            x: 0,
            width: "",
            overflow: "",
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power1.out",
            pointerEvents: "auto",
          },
          "<0.2"
        )
        .to(
          nav,
          {
            x: 0,
            width: "",
            overflow: "",
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power1.out",
            pointerEvents: "auto",
          },
          "<"
        )
        .to(
          searchForm,
          {
            width: "",
            maxWidth: "",
            flex: "",
            margin: "",
            duration: 0.5,
            ease: "sine.out",
          },
          "<0.1"
        )
        .to(
          searchContainer,
          {
            width: "",
            padding: "",
            boxShadow: "",
            duration: 0.5,
            ease: "sine.out",
          },
          "<"
        );
    }

    return () => {
      tl.kill();
    };
  }, [isScrolled, isMobile]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };



  return (
    <header
      ref={headerRef}
      className={`border-b bg-background/95 sticky top-0 z-50 transition-[border] duration-300 ${isScrolled && !isMobile ? 'border-transparent bg-transparent' : ''}`}
    >
      <div
        ref={containerRef}
        className={`${isMobile ? 'px-3 py-2' : 'px-14 py-2'} ${isMobile ? 'flex items-center justify-between gap-2' : 'grid grid-cols-3 items-center gap-6'}`}
      >
        <Link href="/" className="flex items-center" ref={logoRef}>
          <Image
            src="/white-text-logo.svg"
            alt="Beyond 8"
            width={isMobile ? 80 : 100}
            height={isMobile ? 80 : 100}
            className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
          />
        </Link>

        {!isMobile && (
          <form onSubmit={handleSearch} className="flex justify-center" id="search-form" ref={searchFormRef}>
            <div ref={searchContainerRef} className="relative flex items-center rounded-full bg-background overflow-hidden shadow-lg">
              <div className="w-1/2 flex items-center pl-4" id="search-input-section">
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-0 bg-transparent"
                />
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="w-1/2 flex items-center justify-between pr-1">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
                  <DropdownMenuTrigger
                    className="flex items-center justify-between w-full px-3 py-2 text-sm focus:outline-none cursor-pointer"
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setIsOpen(true);
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
                    }}
                  >
                    <span className="truncate max-w-[120px]">{selectedCategory}</span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={10}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
                    }}
                    className="p-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 !overflow-visible border-none bg-transparent shadow-none w-auto"
                  >
                    <CategoryMenu Content={categoryData?.data} onSelect={(name) => {
                      setSelectedCategory(name);
                      setIsOpen(false);
                    }} selected={selectedCategory} />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/courses">
                  <button
                    type="button"
                    className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors border border-purple-500 cursor-pointer"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </Link>
              </div>
            </div>
          </form>
        )}

        <nav ref={navRef} className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? '' : 'justify-end'}`}>
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

              {subscription?.subscriptionPlan && !isMobile && (
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all duration-300 animate-in fade-in zoom-in duration-500 font-bold px-3 py-1 text-[12px] uppercase tracking-wider"
                  >
                    {subscription.subscriptionPlan.name}
                  </Badge>
                </div>
              )}

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
                    <Avatar className={`${isMobile ? 'h-full w-full' : 'h-full w-full'} border-[2px] border-white`}>
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
                  <Button variant="ghost" size="icon" className={`cursor-pointer bg-black/[0.03] hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground ${isMobile ? 'h-9 w-9' : ''}`}>
                    <Menu className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
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
                    <div className="flex items-center gap-2 w-full">
                      <Bell className="h-4 w-4" />
                      Thông báo
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
      </div>
      <NotificationPanel open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
    </header>
  );
}
