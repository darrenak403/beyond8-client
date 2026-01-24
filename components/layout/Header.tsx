"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Search, ChevronDown, Menu, GraduationCap, BookOpen, LogOut, User, Bell, Receipt } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useMobile";
import { useQuery } from "@tanstack/react-query";
import { instructorRegistrationService } from "@/lib/api/services/fetchInstructorRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

export function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [tempCategory, setTempCategory] = useState("Tất cả");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateLogout } = useLogout();

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
  console.log("Show Register Instructor:", showRegisterInstructor);

  const getAvatarFallback = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || 'U';
    }
    if (userProfile?.email) {
      return userProfile.email.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const categories = [
    { name: "Tất cả", icon: "mdi:view-grid" },
    { name: "Lập trình", icon: "mdi:code-tags" },
    { name: "Thiết kế", icon: "mdi:palette" },
    { name: "Kinh doanh", icon: "mdi:briefcase" },
    { name: "Marketing", icon: "mdi:bullhorn" },
    { name: "Ngoại ngữ", icon: "mdi:translate" },
  ];

  const handleLogout = () => {
    mutateLogout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  const handleApplyFilter = () => {
    setSelectedCategory(tempCategory);
    setIsOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className={`${isMobile ? 'px-3 py-2' : 'px-14 py-2'} ${isMobile ? 'flex items-center justify-between gap-2' : 'grid grid-cols-3 items-center gap-6'}`}>
        <Link href="/" className="flex items-center">
          <Image
            src="/white-text-logo.svg"
            alt="Beyond 8"
            width={isMobile ? 80 : 100}
            height={isMobile ? 80 : 100}
            className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
          />
        </Link>

        {!isMobile && (
          <form onSubmit={handleSearch} className="flex justify-center" id="search-form">
            <div className="relative flex items-center rounded-full bg-background overflow-hidden shadow-lg">
              <div className="w-1/2 flex items-center pl-4" id="search-input-section">
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-0 bg-transparent"
                />
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="w-1/2 flex items-center justify-between pr-1">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm focus:outline-none cursor-pointer">
                    <span>Loại khóa học</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="p-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                    sideOffset={8}
                    alignOffset={-200}
                    style={{
                      width: '420px'
                    }}
                  >
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {categories.map((category, index) => {
                        const isSelected = tempCategory === category.name;
                        return (
                          <div
                            key={category.name}
                            onClick={() => setTempCategory(category.name)}
                            className={`p-2.5 border rounded-lg cursor-pointer transition-all flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-2 ${isSelected
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                              : 'border-border'
                              }`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationDuration: '300ms'
                            }}
                          >
                            <Icon
                              icon={category.icon}
                              className={`text-lg flex-shrink-0 ${isSelected ? 'text-purple-600' : ''}`}
                            />
                            <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : ''}`}>
                              {category.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      onClick={handleApplyFilter}
                      className="w-full bg-purple-600 hover:bg-purple-700 animate-in fade-in-0 slide-in-from-bottom-2"
                      size="sm"
                      style={{
                        animationDelay: '300ms',
                        animationDuration: '300ms'
                      }}
                    >
                      Áp dụng
                    </Button>
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

        <nav className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? '' : 'justify-end'}`}>
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

              {isLoading ? (
                <Skeleton className={`${isMobile ? 'h-9 w-9' : 'h-11 w-11'} rounded-full`} />
              ) : (
                <Link href="/mybeyond?tab=myprofile" className="cursor-pointer">
                  <Avatar className={`${isMobile ? 'h-9 w-9' : 'h-11 w-11'} border-2 border-purple-200 hover:border-purple-400 transition-colors`}>
                    <AvatarImage src={formatImageUrl(userProfile?.avatarUrl) || undefined} alt={userProfile?.fullName} />
                    <AvatarFallback className={`bg-purple-100 text-purple-700 font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
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
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Thông báo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/mybeyond?tab=mycourse" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Khóa học của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/mybeyond?tab=mywallet" className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Ví của tôi
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
    </header>
  );
}
