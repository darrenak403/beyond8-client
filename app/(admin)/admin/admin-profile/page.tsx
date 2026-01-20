"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import AdminProfileHeader from "./components/AdminProfileHeader";
import AdminProfileContent from "./components/AdminProfileContent";

function AdminProfilePage() {
  const { userProfile, isLoading, updateProfile } = useUserProfile();

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

  const mappedProfileForHeader = {
    fullName: userProfile.fullName || "Admin",
    email: userProfile.email,
    avatarUrl: userProfile.avatarUrl,
    coverUrl: userProfile.coverUrl,
    isActive: userProfile.isActive,
  };

  return (
    <div className="space-y-6 p-6">
      <AdminProfileHeader userProfile={mappedProfileForHeader} />
      <AdminProfileContent
        userProfile={userProfile}
        onProfileUpdate={(updatedProfile) => {
          updateProfile(updatedProfile);
        }}
      />
    </div>
  );
}

export default AdminProfilePage;
