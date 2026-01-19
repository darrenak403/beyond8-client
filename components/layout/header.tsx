"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Search, ChevronDown, Menu, GraduationCap, BookOpen, LogOut, User, Bell, Receipt } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
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
import { useState } from "react";

export function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [tempCategory, setTempCategory] = useState("Tất cả");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateLogout } = useLogout();

  const getAvatarFallback = () => {
    if (user?.userNname) {
      return user.userNname.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
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
      <div className={`container mx-auto ${isMobile ? 'px-3 py-2' : 'px-2 py-2'} flex items-center justify-between ${isMobile ? 'gap-2' : 'gap-6'}`}>
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
          <form onSubmit={handleSearch} className="flex-1 max-w-md" id="search-form">
            <div className="relative flex items-center rounded-full bg-background overflow-hidden shadow-sm">
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

        <nav className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'} flex-shrink-0`}>
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Link href="/instructor-registration">
                  <Button variant="outline" size="sm" className="cursor-pointer gap-2 hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Đăng ký giảng viên
                  </Button>
                </Link>
              )}

              <Link href="/profile" className="cursor-pointer">
                <Avatar className={`${isMobile ? 'h-9 w-9' : 'h-11 w-11'} border-2 border-purple-200 hover:border-purple-400 transition-colors`}>
                  <AvatarImage src={undefined} alt={user?.userNname} />
                  <AvatarFallback className={`bg-purple-100 text-purple-700 font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`cursor-pointer bg-black/[0.03] hover:bg-black/[0.06] focus:bg-black/[0.06] text-foreground hover:text-foreground focus:text-foreground ${isMobile ? 'h-9 w-9' : ''}`}>
                    <Menu className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/profile" className="flex items-center gap-2">
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
                    <Link href="/my-learning" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Khóa học của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                    <Link href="/transactions" className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Lịch sử giao dịch
                    </Link>
                  </DropdownMenuItem>
                  {isMobile && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/[0.05] focus:bg-black/[0.05] hover:text-foreground focus:text-foreground">
                        <Link href="/instructor-registration" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Đăng ký giảng viên
                        </Link>
                      </DropdownMenuItem>
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
                <Button className="cursor-pointer" variant="outline" size={isMobile ? "sm" : "sm"}>Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer" size={isMobile ? "sm" : "sm"}>Đăng ký</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
