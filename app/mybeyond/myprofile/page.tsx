"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "./components/ProfileHeader";
import ProfileContent from "./components/ProfileContent";
import { useState } from "react";

export default function MyProfilePage() {
  const { userProfile, isLoading, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState("personal");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  // Map API data for ProfileHeader
  const mappedProfileForHeader = {
    fullName: userProfile.fullName || "Người dùng",
    email: userProfile.email,
    avatarUrl: userProfile.avatarUrl,
    coverUrl: userProfile.coverUrl,
    isActive: userProfile.isActive,
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        userProfile={mappedProfileForHeader}
        onChangePassword={() => setActiveTab("security")}
      />

      <ProfileContent
        userProfile={userProfile}
        onProfileUpdate={(updatedProfile) => {
          updateProfile(updatedProfile);
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
