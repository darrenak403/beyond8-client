"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Mail, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useUploadAvatar } from "@/hooks/useUploadAvatar";
import { formatAvatarUrl } from "@/lib/utils/formatAvatarUrl";

interface ProfileHeaderProps {
  userProfile: {
    name: string;
    email: string;
    avatar?: string;
    banner?: string;
    isActive?: boolean;
  };
  onChangePassword: () => void;
}

export default function ProfileHeader({
  userProfile,
  onChangePassword,
}: ProfileHeaderProps) {
  const isMobile = useIsMobile();
  const { uploadAvatar, isUploading } = useUploadAvatar();

  const handleAvatarClick = () => {
    if (isUploading) return;
    
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

  return (
    <div className="overflow-hidden">
      {/* Banner */}
      <div
        className={`bg-gradient-to-r from-primary to-brand-purple relative rounded-2xl ${
          isMobile ? "h-48" : "h-96"
        }`}
        style={{
          backgroundImage: userProfile.banner
            ? `url(${userProfile.banner})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

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
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar
              className={`border-4 border-white shadow-lg ${
                isMobile ? "w-24 h-24" : "w-40 h-40"
              }`}
            >
              <AvatarImage src={formatAvatarUrl(userProfile.avatar)} alt={userProfile.name} />
              <AvatarFallback className="text-2xl">
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploading ? (
                <Loader2 className={`text-white animate-spin ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
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
                {userProfile.name}
              </h2>
              {userProfile.isActive ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
                  Trực tuyến
                </Badge>
              ) : (
                <Badge className="bg-gray-500 hover:bg-gray-600">
                  <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
                  Ngoại tuyến
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{userProfile.email}</span>
            </div>
          </div>
        </div>

        {/* Change Password Button */}
        <Button
          variant="outline"
          onClick={onChangePassword}
          className={`${
            isMobile ? "mt-4 w-full" : ""
          }`}
        >
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  );
}
