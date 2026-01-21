"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function ProfileInstructorForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    expertise: "Lập trình Web, React, Node.js",
    experience: "5 năm",
    education: "Đại học Công nghệ Thông tin",
    certifications: "AWS Certified, Google Cloud Professional",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Instructor profile updated:", formData);
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-900">Trạng thái xác thực</p>
            <p className="text-sm text-yellow-700">
              Hồ sơ giảng viên của bạn đang được xem xét
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-yellow-600 text-yellow-700">
          Chưa xác thực
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chuyên môn */}
        <div className="space-y-2">
          <Label htmlFor="expertise">Chuyên môn</Label>
          <Input
            id="expertise"
            value={formData.expertise}
            onChange={(e) => handleChange("expertise", e.target.value)}
            disabled={!isEditing}
            placeholder="VD: Lập trình Web, Mobile App Development..."
          />
        </div>

        {/* Kinh nghiệm */}
        <div className="space-y-2">
          <Label htmlFor="experience">Kinh nghiệm giảng dạy</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            disabled={!isEditing}
            placeholder="VD: 5 năm"
          />
        </div>

        {/* Học vấn */}
        <div className="space-y-2">
          <Label htmlFor="education">Học vấn</Label>
          <Textarea
            id="education"
            value={formData.education}
            onChange={(e) => handleChange("education", e.target.value)}
            disabled={!isEditing}
            rows={3}
            placeholder="Trình độ học vấn, bằng cấp..."
          />
        </div>

        {/* Chứng chỉ */}
        <div className="space-y-2">
          <Label htmlFor="certifications">Chứng chỉ / Giải thưởng</Label>
          <Textarea
            id="certifications"
            value={formData.certifications}
            onChange={(e) => handleChange("certifications", e.target.value)}
            disabled={!isEditing}
            rows={3}
            placeholder="Các chứng chỉ chuyên môn, giải thưởng..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
