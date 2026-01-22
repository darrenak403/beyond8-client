"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Wallet, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/hooks/useAuth";
import { useState, useMemo } from "react";

const sidebarMenuItems = [
  {
    id: "mycourse",
    label: "Khóa học của tôi",
    icon: BookOpen,
    value: "mycourse",
    roles: ["Student", "Instructor"],
  },
  {
    id: "myprofile",
    label: "Cài đặt tài khoản",
    icon: Settings,
    value: "myprofile",
    roles: ["Student", "Instructor", "Admin"],
  },
  {
    id: "mywallet",
    label: "Ví của tôi",
    icon: Wallet,
    value: "mywallet",
    roles: ["Instructor"],
  },
];

interface SidebarProfileProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function SidebarProfile({ currentTab, onTabChange }: SidebarProfileProps) {
  const isMobile = useIsMobile();
  const { role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userRoles = useMemo(() => {
    if (!role) return [];
    if (Array.isArray(role)) return role;
    if (typeof role === 'string') {
      return role.includes(',') ? role.split(',').map(r => r.trim()) : [role];
    }
    return [];
  }, [role]);

  const visibleMenuItems = useMemo(() => {
    return sidebarMenuItems.filter((item) => {
      if (item.id === "mywallet" && userRoles.includes("Student")) {
        return false;
      }
      return item.roles.some(requiredRole => userRoles.includes(requiredRole));
    });
  }, [userRoles]);

  const handleMenuClick = (value: string) => {
    onTabChange(value);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <nav className="space-y-1">
                    {visibleMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.value;
                      
                      return (
                        <div key={item.id} className="relative">
                          {isActive && (
                            <motion.div
                              layoutId="activeTabMobile"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                          <button
                            onClick={() => handleMenuClick(item.value)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "text-gray-900"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="p-4">
        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.value;
            
            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <button
                  onClick={() => handleMenuClick(item.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
