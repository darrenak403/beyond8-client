"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut, User, Bell, BookOpen } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useMobile";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { usePathname } from "next/navigation";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Badge } from "./badge";

const navItems = [
  { name: "Tổng quan", href: "/instructor/dashboard" },
  { name: "Khóa học của tôi", href: "/instructor/courses" },
  { name: "Ví của tôi", href: "/instructor/wallet" },
];

export function InstructorHeader() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const { mutateLogout } = useLogout();
  const pathname = usePathname();
  const { subscription } = useSubscription();

  // Refs for animation
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);


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
      case "BASIC": 
        return "conic-gradient(from 0deg, #2563eb 0% 50%, #06b6d4 50% 100%)";
      default: 
        return null;
    }
  };

  const handleLogout = () => {
    mutateLogout();
  };

  // GSAP Animation for active tab
  useEffect(() => {
    if (!activeTabRef.current || !navRef.current) return;

    const activeIndex = navItems.findIndex(item => pathname === item.href);
    if (activeIndex === -1) {
      // If no valid tab matches (e.g. root path or specific sub-page), maybe fade out indicator
      gsap.to(activeTabRef.current, { opacity: 0, duration: 0.2 });
      return;
    }

    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      // Ensure opacity is back to 1 if it was hidden
      gsap.set(activeTabRef.current, { opacity: 1 });

      const { offsetLeft, offsetWidth } = activeElement;

      gsap.to(activeTabRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [pathname]);

  if (isMobile) return null;

  return (
    <header className="border-b bg-background/95 sticky top-0 z-50">
      <div className={`px-4 sm:px-14 h-16 flex items-center justify-between`}>
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/white-text-logo.svg"
              alt="Beyond 8"
              width={isMobile ? 80 : 100}
              height={isMobile ? 80 : 100}
              className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
            />
          </Link>
        </div>

        {/* Center: Navigation Tabs (Desktop only) */}
        {!isMobile && (
          <nav ref={navRef} className="flex items-center gap-4 relative">
            {/* Animated Underline */}
            <div
              ref={activeTabRef}
              className="absolute bg-purple-600 h-0.5 bottom-0 left-0 pointer-events-none"
              style={{ width: 0, opacity: 0 }} // Initial state
            />

            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={el => {
                    tabRefs.current[index] = el;
                  }}
                  className={`relative z-10 py-2 text-base font-medium transition-colors ${isActive ? "text-purple-600" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
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
                    className={`p-[2px] rounded-full ${isMobile ? "w-9 h-9" : "w-11 h-11"} flex items-center justify-center transition-all duration-300 hover:scale-105`}
                    style={{ 
                      background: getGradientStyle(subscription?.subscriptionPlan?.code) || '#e5e7eb' // Default to gray-200 equivalent
                    }}
                  >
                    <Avatar className={`${isMobile ? 'h-full w-full' : 'h-full w-full'} border-[2px] border-white`}>
                      <AvatarImage src={formatImageUrl(userProfile?.avatarUrl) || undefined} alt={userProfile?.fullName} className="object-cover" />
                      <AvatarFallback className={`bg-purple-100 text-purple-700 font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
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

                  {isMobile && (
                    <>
                      {navItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                          <Link href={item.href} className="w-full">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/mybeyond?tab=myprofile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Thông báo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Về trang chủ học viên
                    </Link>
                  </DropdownMenuItem>

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
        </div>
      </div>
    </header>
  );
}
