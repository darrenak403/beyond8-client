"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Circle } from "lucide-react";
import type { UserProfile, UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";
import { formatDateForInput } from "@/lib/utils/formatDate";
import { TIMEZONES, LOCALES } from "@/lib/types/userSettings";

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
    timezone: userProfile.timezone || "Asia/Ho_Chi_Minh",
    locale: userProfile.locale || "vi-VN",
  });

  // Update form data when userProfile changes
  useEffect(() => {
    // eslint-disable-next-line
    setFormData({
      fullName: userProfile.fullName || "",
      phoneNumber: userProfile.phoneNumber || "",
      dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
      timezone: userProfile.timezone || "Asia/Ho_Chi_Minh",
      locale: userProfile.locale || "vi-VN",
    });
  }, [userProfile]);

  const hasChanges =
    formData.fullName !== (userProfile.fullName || "") ||
    formData.phoneNumber !== (userProfile.phoneNumber || "") ||
    formData.dateOfBirth !== formatDateForInput(userProfile.dateOfBirth) ||
    formData.timezone !== (userProfile.timezone || "Asia/Ho_Chi_Minh") ||
    formData.locale !== (userProfile.locale || "vi-VN");

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      fullName: userProfile.fullName || "",
      phoneNumber: userProfile.phoneNumber || "",
      dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
      timezone: userProfile.timezone || "Asia/Ho_Chi_Minh",
      locale: userProfile.locale || "vi-VN",
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const updateData: UpdateUserProfileRequest = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber || undefined,
      dateOfBirth: formData.dateOfBirth || null,
      timezone: formData.timezone,
      locale: formData.locale,
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
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Email</Label>
            {userProfile.isEmailVerified ? (
              <Badge variant="default" className="border border-green-500 bg-white text-green-500 flex items-center gap-1 text-xs hover:bg-white">
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
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                colorScheme: 'light'
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Timezone + Locale */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Múi giờ</Label>
          <Select value={formData.timezone} onValueChange={(value) => handleChange("timezone", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn múi giờ" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="locale">Ngôn ngữ</Label>
          <Select value={formData.locale} onValueChange={(value) => handleChange("locale", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((locale) => (
                <SelectItem key={locale.value} value={locale.value}>
                  {locale.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 4: Trạng thái */}
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
            className="border-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 rounded-2xl"

          >
            Hủy thay đổi
          </Button>
        )}
        <Button 
          type="submit"
          disabled={!hasChanges}
          className="rounded-2xl"
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
