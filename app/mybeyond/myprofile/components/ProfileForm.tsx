"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Circle } from "lucide-react";
import type { UserProfile, UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";
import { formatDateForInput } from "@/lib/utils/formatDate";

interface ProfileFormProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UpdateUserProfileRequest) => void;
}

export default function ProfileForm({
  userProfile,
  onProfileUpdate,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || "",
    phoneNumber: userProfile.phoneNumber || "",
    dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when userProfile changes
  useEffect(() => {
    setFormData({
      fullName: userProfile.fullName || "",
      phoneNumber: userProfile.phoneNumber || "",
      dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
    });
  }, [userProfile]);

  // Check if form has changes
  useEffect(() => {
    const changed =
      formData.fullName !== (userProfile.fullName || "") ||
      formData.phoneNumber !== (userProfile.phoneNumber || "") ||
      formData.dateOfBirth !== formatDateForInput(userProfile.dateOfBirth);
    setHasChanges(changed);
  }, [formData, userProfile]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      fullName: userProfile.fullName || "",
      phoneNumber: userProfile.phoneNumber || "",
      dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const updateData: UpdateUserProfileRequest = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber || undefined,
      dateOfBirth: formData.dateOfBirth || null,
    };
    
    onProfileUpdate(updateData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Họ và tên + Email */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="h-5"></div>
          </div>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Nhập họ và tên"
            className="transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Email</Label>
            {userProfile.isEmailVerified ? (
              <Badge variant="default" className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                Đã xác thực
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-yellow-500">
                <Circle className="w-3 h-3" />
                Chưa xác thực
              </Badge>
            )}
          </div>
          <Input
            id="email"
            type="email"
            value={userProfile.email}
            disabled
            className="transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Số điện thoại + Ngày sinh */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Chưa có số điện thoại"
            className="transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <div className="relative">
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              placeholder="Chọn ngày sinh"
              className="transition-colors"
              style={{
                colorScheme: 'light'
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Trạng thái */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <RadioGroup 
            value={userProfile.isActive ? "online" : "offline"} 
            disabled 
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" disabled />
              <Label htmlFor="online" className="font-normal text-gray-500">
                Trực tuyến
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" disabled />
              <Label htmlFor="offline" className="font-normal text-gray-500">
                Ngoại tuyến
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Hủy thay đổi
          </Button>
        )}
        <Button 
          type="submit"
          disabled={!hasChanges}
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
