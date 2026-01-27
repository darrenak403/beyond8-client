"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/useMobile";
import { ReactNode } from "react";
import SidebarProfile from "@/components/ui/sidebar-profile";

export default function MyBeyondLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const currentTab = searchParams.get("tab") || "myprofile";

  const handleTabChange = (value: string) => {
    router.push(`/mybeyond?tab=${value}`);
  };

  // Always show sidebar (filtered by SidebarProfile component)
  const showSidebar = true;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col">
        <div className={` flex-1 flex flex-col ${
          isMobile ? "container mx-auto px-3 py-4" : "px-16 py-8"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h1 className={`font-bold ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}>Tài khoản của tôi</h1>
            
            {/* Mobile Menu Button (shown only on mobile and not admin) */}
            {isMobile && showSidebar && <SidebarProfile currentTab={currentTab} onTabChange={handleTabChange} />}
          </div>
          
          <div className={`flex flex-1 ${
            isMobile ? "flex-col gap-0" : "gap-6"
          }`}>
            {/* Sidebar (Desktop or Mobile Overlay, hidden for admin) */}
            {!isMobile && showSidebar && <SidebarProfile currentTab={currentTab} onTabChange={handleTabChange} />}

            {/* Main Content */}
            <main className={`flex-1 min-w-0 ${!showSidebar ? "max-w-full" : ""} ${isMobile ? "" : "max-w-7xl mx-auto"}`}>
              {children}
            </main>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}