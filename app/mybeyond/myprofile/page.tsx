"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeader from "./components/ProfileHeader";
import ProfileContent from "./components/ProfileContent";
import { useState } from "react";

export default function MyProfilePage() {
  const { userProfile, isLoading, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState("personal");

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="overflow-hidden">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="flex items-end justify-between px-8 pb-3">
            <div className="flex items-end gap-4 -mt-20">
              <Skeleton className="w-40 h-40 rounded-full" />
              <div className="mb-4 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
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
    <div className="space-y-8">
      <ProfileHeader
        userProfile={mappedProfileForHeader}
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
