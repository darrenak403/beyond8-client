"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useUploadImage } from "@/hooks/useUploadImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

interface AdminProfileHeaderProps {
  userProfile: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    isActive?: boolean;
  };
}

export default function AdminProfileHeader({ userProfile }: AdminProfileHeaderProps) {
  const isMobile = useIsMobile();
  const { uploadAvatar, isUploadingAvatar, uploadCover, isUploadingCover } = useUploadImage();

  const handleAvatarClick = () => {
    if (isUploadingAvatar) return;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Kích thước file không được vượt quá 5MB");
          return;
        }
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
        if (file.size > 10 * 1024 * 1024) {
          alert("Kích thước file không được vượt quá 10MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          alert("Vui lòng chọn file ảnh");
          return;
        }
        uploadCover(file);
      }
    };
    input.click();
  };

  return (
    <div className="overflow-hidden">
      <div className={`bg-gradient-to-r from-primary to-brand-purple relative rounded-2xl overflow-hidden ${isMobile ? "h-48" : "h-96"}`}>
        <img
          src={formatImageUrl(userProfile.coverUrl) || '/bg-web.jpg'}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 cursor-pointer group" onClick={handleCoverClick}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isUploadingCover ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
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

      <div className={`${isMobile ? "flex flex-col items-center text-center px-4 pb-6" : "flex items-end justify-between px-8 pb-3"}`}>
        <div className={`${isMobile ? "flex flex-col items-center -mt-12" : "flex items-end gap-4 -mt-20"}`}>
          <div className="relative group cursor-pointer z-20" onClick={handleAvatarClick}>
            <Avatar className={`border-4 border-white shadow-lg ${isMobile ? "w-24 h-24" : "w-40 h-40"}`}>
              <AvatarImage src={formatImageUrl(userProfile.avatarUrl)} alt={userProfile.fullName || 'User'} />
              <AvatarFallback className="text-2xl">
                {userProfile.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 className={`text-white animate-spin ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              ) : (
                <Camera className={`text-white ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
              )}
            </div>
          </div>

          <div className={`${isMobile ? "mt-3 space-y-2" : "mb-4"}`}>
            <div className="flex items-center gap-2">
              <h2 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>
                {userProfile.fullName || 'User'}
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
      </div>
    </div>
  );
}
