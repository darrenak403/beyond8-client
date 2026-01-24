"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import SidebarProfile from "@/components/ui/sidebar-profile";

export default function MyBeyondLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { role } = useAuth();

  const currentTab = searchParams.get("tab") || "myprofile";

  // Check access permissions and redirect if needed
  useEffect(() => {
    if (!role) return;

    // Define access rules
    const accessRules: Record<string, string[]> = {
      mycourse: ["ROLE_STUDENT", "ROLE_INSTRUCTOR"],
      myprofile: ["ROLE_STUDENT", "ROLE_INSTRUCTOR", "ROLE_ADMIN"],
      mywallet: ["ROLE_INSTRUCTOR"],
    };

    const allowedRoles = accessRules[currentTab];
    
    // If tab doesn't exist in rules, it's invalid - redirect to myprofile
    if (!allowedRoles) {
      router.replace("/mybeyond?tab=myprofile");
      return;
    }

    // If user doesn't have access to this tab, redirect to myprofile
    if (!role || !role.some(r => allowedRoles.includes(r))) {
      router.replace("/mybeyond?tab=myprofile");
      return;
    }
  }, [currentTab, role, router]);

  const handleTabChange = (value: string) => {
    router.push(`/mybeyond?tab=${value}`);
  };

  // Hide sidebar for Admin role
  const showSidebar = !role?.includes("ROLE_ADMIN");

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