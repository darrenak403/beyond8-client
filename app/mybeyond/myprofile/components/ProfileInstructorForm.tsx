"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  XCircle,
  User,
  Briefcase,
  GraduationCap,
  Globe,
  Facebook,
  Linkedin,
} from "lucide-react";
import { useGetInstructorProfile } from "@/hooks/useInstructorRegistration";

export default function ProfileInstructorForm() {
  const { instructorProfile, isLoading, error, refetch } = useGetInstructorProfile();

  // Memoize form data from API
  const initialFormData = useMemo(() => {
    if (!instructorProfile) {
      return {
        bio: "",
        headline: "",
        expertise: "",
        education: "",
        workExperience: "",
        socialLinks: {
          facebook: "",
          linkedIn: "",
          website: "",
        },
      };
    }

    return {
      bio: instructorProfile.bio || "",
      headline: instructorProfile.headline || "",
      expertise: instructorProfile.expertiseAreas.join(", ") || "",
      education:
        instructorProfile.education
          .map((edu) => `${edu.degree} - ${edu.school} (${edu.start}-${edu.end})`)
          .join("\n") || "",
      workExperience:
        instructorProfile.workExperience
          .map((work) => `${work.role} tại ${work.company} (${work.from} - ${work.to})`)
          .join("\n") || "",
      socialLinks: {
        facebook: instructorProfile.socialLinks.facebook || "",
        linkedIn: instructorProfile.socialLinks.linkedIn || "",
        website: instructorProfile.socialLinks.website || "",
      },
    };
  }, [instructorProfile]);

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Instructor profile updated:", formData);
    // TODO: Call API to update profile
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-sm text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error || !instructorProfile) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <XCircle className="w-12 h-12 text-red-500" />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Không thể tải thông tin</p>
              <p className="text-sm text-gray-500 mt-1">
                Đã xảy ra lỗi khi tải thông tin giảng viên
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <Loader2 className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card 1: Headline, Bio, Expertise */}
      <Card className="flex flex-col gap-2">
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-gray-200 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="headline" className="text-sm font-medium">
              Tiêu đề chuyên môn
            </Label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="VD: Senior Full-stack Developer & Instructor"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Giới thiệu
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              placeholder="Giới thiệu ngắn gọn về bản thân và kinh nghiệm..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="expertise" className="text-sm font-medium">
              Lĩnh vực chuyên môn
            </Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => handleChange("expertise", e.target.value)}
              placeholder="VD: Web Development, React, Node.js"
            />
            {formData.expertise && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertise.split(",").map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Education */}
      <Card>
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-gray-200 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            Học vấn
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-6">
          <Label htmlFor="education" className="text-sm font-medium">
              Học vấn
            </Label>
          <Textarea
            id="education"
            value={formData.education}
            onChange={(e) => handleChange("education", e.target.value)}
            rows={5}
            placeholder="Bằng cấp, trường học, năm tốt nghiệp..."
          />
        </CardContent>
      </Card>

      {/* Card 3: Work Experience */}
      <Card>
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            Kinh nghiệm làm việc
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-6">
          <Label htmlFor="headline" className="text-sm font-medium">
              Kinh nghiệm
            </Label>
          <Textarea
            id="workExperience"
            value={formData.workExperience}
            onChange={(e) => handleChange("workExperience", e.target.value)}
            rows={5}
            placeholder="Vị trí, công ty, thời gian làm việc..."
          />
        </CardContent>
      </Card>

      {/* Card 4: Social Links */}
      <Card>
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            Liên kết mạng xã hội
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          <div className="relative">
            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Facebook URL"
              value={formData.socialLinks.facebook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                })
              }
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedIn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedIn: e.target.value },
                })
              }
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Website URL"
              value={formData.socialLinks.website}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, website: e.target.value },
                })
              }
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      {/* Header with Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          // onClick={handleReset}
        >
          Hủy thay đổi
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
