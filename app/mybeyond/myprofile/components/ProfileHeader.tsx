"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, EyeOff, Crown, Gem, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useUploadImage } from "@/hooks/useUploadImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";
import { useHiddenProfile } from "@/hooks/useInstructorRegistration";
import { useSubscription } from "@/hooks/useSubscription";
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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  const [confirmText, setConfirmText] = useState("");
  const { subscription } = useSubscription();
  
  const getGradientStyle = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA": 
        return "conic-gradient(from 0deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)";
      case "PRO": 
        return "conic-gradient(from 0deg, #EA4335 0% 25%, #4285F4 25% 50%, #34A853 50% 75%, #FBBC05 75% 100%)";
      case "STANDARD":
      case "PLUS": 
        return "conic-gradient(from 0deg, #2563eb 0% 50%, #06b6d4 50% 100%)";
      default: 
        return null;
    }
  };

  const getPlanIcon = (code?: string) => {
    switch (code?.toUpperCase()) {
      case "ULTRA":
        return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
      case "PRO":
        return <Gem className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case "BASIC":
      case "PLUS":
        return <Zap className="w-5 h-5 text-purple-500 fill-purple-500" />;
      default:
        return null;
    }
  };

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
          toast.error("Kích thước file không được vượt quá 5MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Vui lòng chọn file ảnh");
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
          toast.error("Kích thước file không được vượt quá 10MB");
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Vui lòng chọn file ảnh");
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
            <div 
              className={`p-[4px] rounded-full ${isMobile ? "w-24 h-24" : "w-40 h-40"} flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105`}
              style={{ 
                background: getGradientStyle(subscription?.subscriptionPlan?.code) || '#c084fc' // Default to purple-400 equivalent if null
              }}
            >
              <Avatar className="w-full h-full border-4 ">
              <AvatarImage src={formatImageUrl(userProfile.avatarUrl)} alt={userProfile.fullName || 'User'} className="object-cover" />
              <AvatarFallback className="text-4xl bg-purple-100 text-purple-700 font-semibold">
                {userProfile.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0,2)
                  .toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            </div>
            
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {isUploadingAvatar ? (
                <Skeleton className={`rounded-full bg-white/20 ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              ) : (
                <Camera className={`text-white ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              )}
            </div>
            
            {/* Plan Icon */}
            {getPlanIcon(subscription?.subscriptionPlan?.code) && (
              <div className={`absolute ${isMobile ? "-top-2 -right-2 p-1" : "top-2 right-2 w-7 h-7"} bg-white rounded-full shadow-md z-30 flex items-center justify-center border border-gray-100`}>
                {getPlanIcon(subscription?.subscriptionPlan?.code)}
              </div>
            )}

            {/* Status Indicator */}
            {/* <div className={`absolute ${isMobile ? "bottom-1 right-1 w-5 h-5" : "bottom-2 right-2 w-7 h-7"} rounded-full border-4 border-white ${
              userProfile.isActive ? "bg-green-500" : "bg-gray-400"
            } shadow-lg z-30`} /> */}
            {userProfile.isActive && (
             <span className={`absolute ${isMobile ? "bottom-1 right-1 w-5 h-5" : "bottom-2 right-2 w-7 h-7"} flex z-10`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full ${isMobile ? "w-5 h-5" : "w-7 h-7"} bg-gradient-to-r from-green-400 to-green-400 border-[2px] border-white`}></span>
            </span>
            )}
          </div>

          {/* Name & Email */}
          <div className={`${isMobile ? "mt-3 space-y-2 flex flex-col items-center" : "mb-4"}`}>
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
              onClick={() => {
                setShowHideDialog(true);
                setConfirmText("");
              }}
              disabled={isUnhiding}
              className="gap-2 rounded-2xl cursor-pointer"
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
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div className="space-y-2 border border-red-200/50 bg-red-50/50 p-4 rounded-xl">
                  <p className="font-semibold text-gray-900">Bạn có chắc là muốn ẩn hồ sơ giảng viên của mình không?</p>
                  <p className="text-sm text-destructive font-medium">
                    Bạn sẽ không còn là giảng viên sau khi thực hiện hành động này nữa.
                  </p>
                </div>
                
                <div className="space-y-3 pt-2">
                   <p className="text-sm text-muted-foreground">
                      Vui lòng nhập <span className="font-bold text-black select-none">{instructorProfile?.id?.split('-').pop()}</span> để xác nhận.
                   </p>
                   <Input 
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder={`Nhập '${instructorProfile?.id?.split('-').pop()}'`}
                      className="w-full"
                   />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowHideDialog(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHideProfile}
              disabled={confirmText !== instructorProfile?.id?.split('-').pop()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận ẩn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
