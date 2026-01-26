"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Wallet, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

const sidebarMenuItems = [
  {
    id: "mycourse",
    label: "Khóa học của tôi",
    icon: BookOpen,
    value: "mycourse",
    roles: ["ROLE_STUDENT", "ROLE_INSTRUCTOR"],
  },
  {
    id: "myprofile",
    label: "Cài đặt tài khoản",
    icon: Settings,
    value: "myprofile",
    roles: ["ROLE_STUDENT", "ROLE_INSTRUCTOR", "ROLE_ADMIN"],
  },
  {
    id: "mywallet",
    label: "Ví của tôi",
    icon: Wallet,
    value: "mywallet",
    roles: ["ROLE_INSTRUCTOR"],
  },
];

interface SidebarProfileProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function SidebarProfile({ currentTab, onTabChange }: SidebarProfileProps) {
  const isMobile = useIsMobile();
  const { role } = useAuth();

  // role is already a string[] array from useAuth
  const userRoles = useMemo(() => role || [], [role]);

  const visibleMenuItems = useMemo(() => {
    return sidebarMenuItems.filter((item) => {
      if (item.id === "mywallet" && userRoles.includes("ROLE_STUDENT")) {
        return false;
      }
      return item.roles.some(requiredRole => userRoles.includes(requiredRole));
    });
  }, [userRoles]);

  const handleMenuClick = (value: string) => {
    onTabChange(value);
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 px-4 pb-safe">
        <nav className="flex items-center justify-around h-full">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.value;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.value)}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                  isActive ? 'text-purple-700' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </button>
            );
          })}
        </nav>
      </div>
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
