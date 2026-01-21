"use client";

import { useIsMobile } from "@/hooks/useMobile";
import { Briefcase, User, Tags } from "lucide-react";

interface BasicInfoData {
  bio: string;
  headline: string;
  expertiseAreas: string[];
}

interface Step2Props {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

export default function Step2BasicInfo({ data, onChange }: Step2Props) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Thông tin cơ bản</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Giới thiệu về bản thân và lĩnh vực chuyên môn của bạn</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
            <Briefcase className="w-4 h-4 text-purple-600" />
            Tiêu đề chuyên môn
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
              placeholder="VD: Chuyên gia lập trình Full-stack với 10 năm kinh nghiệm"
              value={data.headline}
              onChange={(e) => onChange({ ...data, headline: e.target.value })}
            />
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
            <User className="w-4 h-4 text-purple-600" />
            Tiểu sử
          </label>
          <div className="relative">
            <textarea
              className={`w-full pl-10 pr-3 pt-3 pb-2 border rounded-md ${isMobile ? 'text-sm' : ''}`}
              placeholder="Giới thiệu về bản thân, kinh nghiệm, thành tựu..."
              rows={isMobile ? 4 : 6}
              value={data.bio}
              onChange={(e) => onChange({ ...data, bio: e.target.value })}
            />
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
            <Tags className="w-4 h-4 text-purple-600" />
            Lĩnh vực chuyên môn
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
              placeholder="VD: JavaScript, React, Node.js, Python (phân cách bằng dấu phẩy)"
              value={data.expertiseAreas.join(", ")}
              onChange={(e) => onChange({ 
                ...data, 
                expertiseAreas: e.target.value.split(",").map(area => area.trim()).filter(Boolean)
              })}
            />
            <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
