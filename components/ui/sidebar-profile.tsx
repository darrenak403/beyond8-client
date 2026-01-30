"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Settings, History } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import Link from "next/link";

const sidebarMenuItems = [
  {
    id: "mycourse",
    label: "Khóa học của tôi",
    icon: BookOpen,
    value: "mycourse",
  },
  {
    id: "myprofile",
    label: "Cài đặt tài khoản",
    icon: Settings,
    value: "myprofile",
  },
  {
    id: "myusage",
    label: "Lịch sử dùng AI",
    icon: History,
    value: "myusage",
  },
];

interface SidebarProfileProps {
  currentTab: string;
  onTabChange?: (tab: string) => void; 
}

export default function SidebarProfile({ currentTab }: SidebarProfileProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 px-4 pb-safe">
        <nav className="flex items-center justify-around h-full">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.value;

            return (
              <Link
                key={item.id}
                href={`/mybeyond?tab=${item.value}`}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                  isActive ? 'text-purple-700' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </Link>
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
          {sidebarMenuItems.map((item) => {
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
                <Link
                  href={`/mybeyond?tab=${item.value}`}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
