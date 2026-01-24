"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Circle } from "lucide-react";
import type { UserProfile, UpdateUserProfileRequest } from "@/lib/api/services/fetchProfile";
import { formatDateForInput } from "@/lib/utils/formatDate";
import { TIMEZONES, LOCALES } from "@/lib/types/userSettings";

interface AdminProfileFormProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UpdateUserProfileRequest) => void;
}

export default function AdminProfileForm({
  userProfile,
  onProfileUpdate,
}: AdminProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || "",
    phoneNumber: userProfile.phoneNumber || "",
    dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
    specialization: userProfile.specialization || "",
    address: userProfile.address || "",
    bio: userProfile.bio || "",
    timezone: userProfile.timezone || "Asia/Ho_Chi_Minh",
    locale: userProfile.locale || "vi-VN",
  });

  const hasChanges =
    formData.fullName !== (userProfile.fullName || "") ||
    formData.phoneNumber !== (userProfile.phoneNumber || "") ||
    formData.dateOfBirth !== formatDateForInput(userProfile.dateOfBirth) ||
    formData.specialization !== (userProfile.specialization || "") ||
    formData.address !== (userProfile.address || "") ||
    formData.bio !== (userProfile.bio || "") ||
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
      specialization: userProfile.specialization || "",
      address: userProfile.address || "",
      bio: userProfile.bio || "",
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
      specialization: formData.specialization || null,
      address: formData.address || null,
      bio: formData.bio || null,
      timezone: formData.timezone,
      locale: formData.locale,
    };
    
    onProfileUpdate(updateData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <Badge variant="default" className="flex items-center gap-1 text-xs border border-green-500 bg-white text-green-500 hover:bg-white">
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
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            placeholder="Chọn ngày sinh"
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ colorScheme: 'light' }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="specialization">Chuyên môn</Label>
          <Input
            id="specialization"
            value={formData.specialization || ""}
            onChange={(e) => handleChange("specialization", e.target.value)}
            placeholder="VD: Lập trình Web, Thiết kế UI/UX"
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="VD: Hà Nội, Việt Nam"
            className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="bio">Tiểu sử</Label>
        <Textarea
          id="bio"
          value={formData.bio || ""}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Viết vài dòng về bản thân..."
          className="transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-3">
        {hasChanges && (
          <Button type="button" variant="outline" onClick={handleReset}>
            Hủy thay đổi
          </Button>
        )}
        <Button type="submit" disabled={!hasChanges}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
