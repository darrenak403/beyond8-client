"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import AdminProfileForm from "./AdminProfileForm";
import AdminProfileChangePassword from "./AdminProfileChangePassword";
import type { UserProfile, UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";

const tabs = [
  { id: 1, label: "Thông tin cá nhân", value: "personal", icon: User },
  { id: 2, label: "Bảo mật", value: "security", icon: Lock },
];

interface AdminProfileContentProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UpdateUserProfileRequest) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function AdminProfileContent({
  userProfile,
  onProfileUpdate,
  activeTab: externalActiveTab,
  onTabChange,
}: AdminProfileContentProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("personal");
  const isMobile = useIsMobile();

  const activeTab = externalActiveTab || internalActiveTab;

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className={`border-b ${isMobile ? "px-4" : "px-6"}`}>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => handleTabChange(tab.value)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    isMobile ? "text-sm" : "text-base"
                  } ${
                    isActive
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
                {isActive && (
                  <motion.div
                    layoutId="activeSubTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`${isMobile ? "p-4" : "p-6"}`}>
        {activeTab === "personal" && (
          <AdminProfileForm
            userProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        )}
        {activeTab === "security" && <AdminProfileChangePassword />}
      </div>
    </div>
  );
}
