"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Wallet, User, LogOut, Bell } from "lucide-react";
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

export function InstructorBottomNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const { mutateLogout } = useLogout();

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
                    <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                    <span className="text-xs font-medium leading-none">{item.name}</span>
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
