"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { Roles } from "@/lib/types/roles";
import ProfileForm from "./ProfileForm";
import ProfileInstructorForm from "./ProfileInstructorForm";
import ResetPasswordForm from "./ResetPasswordForm";
import type { UserProfile, UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";

const tabs = [
  { id: 1, label: "Thông tin cá nhân", value: "personal", icon: User },
  { id: 2, label: "Hồ sơ Giảng viên", value: "instructor", icon: Shield },
  { id: 3, label: "Bảo mật", value: "security", icon: Lock },
];

interface ProfileContentProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UpdateUserProfileRequest) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProfileContent({
  userProfile,
  onProfileUpdate,
  activeTab: externalActiveTab,
  onTabChange,
}: ProfileContentProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("personal");
  const isMobile = useIsMobile();
  const isInstructor = userProfile.roles?.includes(Roles.Instructor) ?? false;

  const activeTab = externalActiveTab || internalActiveTab;

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const visibleTabs = tabs.filter(tab => 
    tab.value !== "instructor" || isInstructor
  );

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className={`border-b ${isMobile ? "px-4" : "px-6"}`}>
        <div className="flex gap-1 overflow-x-auto">
          {visibleTabs.map((tab) => {
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
          <ProfileForm
            userProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        )}
        {activeTab === "instructor" && isInstructor && <ProfileInstructorForm />}
        {activeTab === "security" && <ResetPasswordForm />}
      </div>
    </div>
  );
}
