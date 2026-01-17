"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logoutAsync } from "@/lib/redux/slices/authSlice";
import { useState } from "react";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
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

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        <nav className="flex items-center gap-6 flex-shrink-0">
          <Link 
            href="/courses" 
            className="hover:text-primary transition-colors"
            title="Khóa học"
          >
            <Search className="h-5 w-5" />
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/my-learning" className="hover:text-primary transition-colors">
                Học của tôi
              </Link>
              <Link href="/profile" className="hover:text-primary transition-colors">
                {user?.name || "Hồ sơ"}
              </Link>
              <Button onClick={handleLogout} variant="outline">
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button>Đăng ký</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
