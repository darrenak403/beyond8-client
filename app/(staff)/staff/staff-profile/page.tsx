"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import AdminProfileHeader from "@/app/(admin)/admin/admin-profile/components/AdminProfileHeader";
import AdminProfileContent from "@/app/(admin)/admin/admin-profile/components/AdminProfileContent";

function StaffProfilePage() {
    const { userProfile, isLoading, updateProfile } = useUserProfile();

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
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

    const mappedProfileForHeader = {
        fullName: userProfile.fullName || "Staff",
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

export default StaffProfilePage;
