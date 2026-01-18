"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logoutAsync } from "@/lib/redux/slices/authSlice";
import { useState } from "react";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [tempCategory, setTempCategory] = useState("Tất cả");
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Tất cả", icon: "mdi:view-grid" },
    { name: "Lập trình", icon: "mdi:code-tags" },
    { name: "Thiết kế", icon: "mdi:palette" },
    { name: "Kinh doanh", icon: "mdi:briefcase" },
    { name: "Marketing", icon: "mdi:bullhorn" },
    { name: "Ngoại ngữ", icon: "mdi:translate" },
  ];

  const handleLogout = () => {
    dispatch(logoutAsync());
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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/white-text-logo.svg"
            alt="Beyond 8"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md" id="search-form">
          <div className="relative flex items-center rounded-full bg-background overflow-hidden shadow-sm">
            {/* Search Input Section - 50% */}
            <div className="w-1/2 flex items-center pl-4" id="search-input-section">
              <Input
                type="search"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-0 bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border" />

            {/* Category Filter Section - 50% */}
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
                          className={`p-2.5 border rounded-lg cursor-pointer transition-all flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-2 ${
                            isSelected 
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

              {/* Search Button */}
              <button
                type="submit"
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors border border-purple-500"
              >
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </form>

        <nav className="flex items-center gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link href="/my-learning" className="hover:text-primary transition-colors">
                Học của tôi
              </Link>
              <Link href="/profile" className="hover:text-primary transition-colors">
                {user?.name || "Hồ sơ"}
              </Link>
              <Button className="cursor-pointer" onClick={handleLogout} variant="outline">
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="cursor-pointer" variant="outline">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer">Đăng ký</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
