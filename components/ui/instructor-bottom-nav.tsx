"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Wallet, User, LogOut, Bell, Crown, Gem, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

export function InstructorBottomNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const { mutateLogout } = useLogout();
  const { subscription } = useSubscription();

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
        return <Crown className="w-2 h-2 text-yellow-500 fill-yellow-500" />;
      case "PRO":
        return <Gem className="w-2 h-2 text-blue-500 fill-blue-500" />;
      case "BASIC":
      case "PLUS":
        return <Zap className="w-2 h-2 text-purple-500 fill-purple-500" />;
      default:
        return null;
    }
  };

  const getAvatarFallback = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || 'U';
    }
    return 'U';
  };

  const handleLogout = () => {
    mutateLogout();
  };

  // Only show on mobile
  if (!isMobile) return null;

  const navItems = [
    { name: "Tổng quan", href: "/instructor/dashboard", icon: Home },
    { name: "Khóa học", href: "/instructor/courses", icon: BookOpen },
    { name: "Học sinh", href: "/instructor/students", icon: Users },
    { name: "Ví", href: "/instructor/wallet", icon: Wallet },
    { name: "Hồ sơ", href: "/mybeyond?tab=myprofile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isProfile = item.name === "Hồ sơ";

          if (isProfile) {
            return (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className="flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none">
                  <div className={cn("flex flex-col items-center justify-center", isActive ? "text-purple-600" : "text-muted-foreground")}>
                    <div 
                      className="relative p-[1.5px] rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300"
                      style={{ 
                        background: getGradientStyle(subscription?.subscriptionPlan?.code) || (isActive ? '#9333ea' : '#c084fc')
                      }}
                    >
                      <Avatar className="w-full h-full border-[1.5px] border-white">
                        <AvatarImage src={formatImageUrl(userProfile?.avatarUrl)} alt={userProfile?.fullName || 'User'} className="object-cover" />
                        <AvatarFallback className="text-[8px] bg-purple-100 text-purple-700 font-bold flex items-center justify-center pt-[1px]">
                          {getAvatarFallback()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Plan Icon */}
                      {getPlanIcon(subscription?.subscriptionPlan?.code) && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-[1px] shadow-sm z-30 flex items-center justify-center border border-gray-100">
                          {getPlanIcon(subscription?.subscriptionPlan?.code)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium leading-none mt-1">{item.name}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
                  {userProfile && (
                    <>
                      <div className="px-2 py-1.5 text-sm">
                        <p className="font-medium">{userProfile.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/mybeyond?tab=myprofile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Thông báo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
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
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-purple-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-xs font-medium leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
