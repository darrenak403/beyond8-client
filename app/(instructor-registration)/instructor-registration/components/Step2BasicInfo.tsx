"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { Briefcase, User, Tags, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BasicInfoData {
  bio: string;
  headline: string;
  expertiseAreas: string[];
}

interface Step2Props {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

const SUGGESTED_TAGS = [
  "JavaScript", "TypeScript", "React", "Vue.js", "Angular",
  "Node.js", "Python", "Java", "C++", "C#",
  "PHP", "Ruby", "Go", "Rust", "Swift",
  "HTML/CSS", "Tailwind CSS", "Bootstrap", "SASS/SCSS",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Docker", "Kubernetes", "Git",
  "Machine Learning", "Data Science", "AI", "Blockchain",
  "Mobile Development", "iOS", "Android", "Flutter",
  "DevOps", "CI/CD", "Microservices", "REST API"
];

export default function Step2BasicInfo({ data, onChange }: Step2Props) {
  const isMobile = useIsMobile();
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (tag: string) => {
    if (tag && !data.expertiseAreas.includes(tag)) {
      onChange({ ...data, expertiseAreas: [...data.expertiseAreas, tag] });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({
      ...data,
      expertiseAreas: data.expertiseAreas.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  const availableSuggestedTags = SUGGESTED_TAGS.filter(
    tag => !data.expertiseAreas.includes(tag)
  );

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Thông tin cơ bản</h2>
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
              className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
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
              className={`w-full pl-10 pr-3 pt-3 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'text-sm' : ''}`}
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
              className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
              placeholder="Nhập và nhấn Enter để thêm tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />
            <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Selected Tags */}
          {data.expertiseAreas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.expertiseAreas.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-purple-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Tags */}
          {availableSuggestedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Gợi ý:</p>
              <div className="flex flex-wrap gap-2">
                {availableSuggestedTags.slice(0, 12).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
