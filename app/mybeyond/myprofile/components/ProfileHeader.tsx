"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useUploadImage } from "@/hooks/useUploadImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";
import { useHiddenProfile } from "@/hooks/useInstructorRegistration";
import { useQuery } from "@tanstack/react-query";
import { instructorRegistrationService } from "@/lib/api/services/fetchInstructorRegistration";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ProfileHeaderProps {
  userProfile: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    isActive?: boolean;
  };
}

export default function ProfileHeader({
  userProfile,
}: ProfileHeaderProps) {
  const isMobile = useIsMobile();  
  const { uploadAvatar, isUploadingAvatar, uploadCover, isUploadingCover } = useUploadImage();
  const { unhideProfile, isUnhiding } = useHiddenProfile();
  const [showHideDialog, setShowHideDialog] = useState(false);

  // Fetch instructor profile to get the ID
  const { data: instructorProfile } = useQuery({
    queryKey: ["instructor-profile"],
    queryFn: async () => {
      const response = await instructorRegistrationService.getMe();
      return response.isSuccess ? response.data : null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const isApprove = instructorProfile?.verificationStatus === "Verified";


  const handleAvatarClick = () => {
    if (isUploadingAvatar) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Kích thước file không được vượt quá 5MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Vui lòng chọn file ảnh");
          return;
        }
        
        uploadAvatar(file);
      }
    };
    input.click();
  };

  const handleCoverClick = () => {
    if (isUploadingCover) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (max 10MB for cover)
        if (file.size > 10 * 1024 * 1024) {
          alert("Kích thước file không được vượt quá 10MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Vui lòng chọn file ảnh");
          return;
        }
        
        uploadCover(file);
      }
    };
    input.click();
  };

  const handleHideProfile = () => {
    if (instructorProfile?.id) {
      unhideProfile(instructorProfile.id);
      setShowHideDialog(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Banner with Upload */}
      <div
        className={`bg-gradient-to-r from-primary to-brand-purple relative rounded-2xl overflow-hidden ${
          isMobile ? "h-48" : "h-96"
        }`}
      >
        {/* Background image with zoom effect */}
        <SafeImage
          src={formatImageUrl(userProfile.coverUrl) || '/bg-web.jpg'}
          alt="Cover"
          width={1920}
          height={400}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Hover overlay - only on cover area */}
        <div 
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 cursor-pointer group"
          onClick={handleCoverClick}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isUploadingCover ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Skeleton className="w-12 h-12 rounded-full bg-white/20" />
                <span className="text-sm font-medium">Đang tải lên...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white">
                <Camera className="w-12 h-12" />
                <span className="text-sm font-medium">
                  {formatImageUrl(userProfile.coverUrl) ? "Thay đổi ảnh bìa" : "Thêm ảnh bìa"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div
        className={`${
          isMobile
            ? "flex flex-col items-center text-center px-4 pb-6"
            : "flex items-end justify-between px-8 pb-3"
        }`}
      >
        {/* Avatar & Name Section */}
        <div
          className={`${
            isMobile ? "flex flex-col items-center -mt-12" : "flex items-end gap-4 -mt-20"
          }`}
        >
          {/* Avatar */}
          <div className="relative group cursor-pointer z-20" onClick={handleAvatarClick}>
            <Avatar
              className={`border-4 border-purple-400 shadow-lg ${
                isMobile ? "w-24 h-24" : "w-40 h-40"
              }`}
            >
              <AvatarImage src={formatImageUrl(userProfile.avatarUrl)} alt={userProfile.fullName || 'User'} />
              <AvatarFallback className="text-4xl bg-purple-100 text-purple-700 font-semibold">
                {userProfile.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0,2)
                  .toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Green dot indicator - bottom right of avatar */}
            {userProfile.isActive && (
              <span className={`absolute bottom-1 right-1 ${isMobile ? 'w-5 h-5' : 'w-7 h-7'} bg-green-500 rounded-full border-4 border-white shadow-lg`} />
            )}
            
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Skeleton className={`rounded-full bg-white/20 ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              ) : (
                <Camera className={`text-white ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              )}
            </div>
          </div>

          {/* Name & Email */}
          <div className={`${isMobile ? "mt-3 space-y-2" : "mb-4"}`}>
            <div className="flex items-center gap-2">
              <h2
                className={`font-bold ${
                  isMobile ? "text-xl" : "text-2xl"
                }`}
              >
                {userProfile.fullName || 'User'}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">{userProfile.email}</span>
            </div>
          </div>
        </div>

        {/* Hide Instructor Profile Button */}
        {instructorProfile && isApprove && (
          <div className={`${isMobile ? "mt-4" : "mb-4"}`}>
            <Button
              variant="destructive"
              size={isMobile ? "sm" : "default"}
              onClick={() => setShowHideDialog(true)}
              disabled={isUnhiding}
              className="gap-2"
            >
              <EyeOff className="w-4 h-4" />
              {isUnhiding ? "Đang xử lý..." : "Ẩn hồ sơ giảng viên"}
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showHideDialog} onOpenChange={setShowHideDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận ẩn hồ sơ giảng viên</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 border border-gray-200 p-4 rounded-md mt-4 bg-gray-50">
              <p>Bạn có chắc là muốn ẩn hồ sơ giảng viên của mình không?</p>
              <p className="font-semibold text-destructive">
                Bạn sẽ không còn là giảng viên sau khi thực hiện hành động này nữa.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHideProfile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận ẩn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
