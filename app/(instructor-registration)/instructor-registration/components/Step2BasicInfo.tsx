"use client";

import { useIsMobile } from "@/hooks/useMobile";

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
          <label className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Tiêu đề chuyên môn</label>
          <input
            type="text"
            className={`w-full px-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
            placeholder="VD: Chuyên gia lập trình Full-stack với 10 năm kinh nghiệm"
            value={data.headline}
            onChange={(e) => onChange({ ...data, headline: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Tiểu sử</label>
          <textarea
            className={`w-full px-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
            placeholder="Giới thiệu về bản thân, kinh nghiệm, thành tựu..."
            rows={isMobile ? 4 : 6}
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Lĩnh vực chuyên môn</label>
          <input
            type="text"
            className={`w-full px-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
            placeholder="VD: JavaScript, React, Node.js, Python (phân cách bằng dấu phẩy)"
            value={data.expertiseAreas.join(", ")}
            onChange={(e) => onChange({ 
              ...data, 
              expertiseAreas: e.target.value.split(",").map(area => area.trim()).filter(Boolean)
            })}
          />
        </div>
      </div>
    </div>
  );
}
