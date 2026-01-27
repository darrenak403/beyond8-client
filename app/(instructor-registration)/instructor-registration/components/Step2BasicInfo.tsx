"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { Briefcase, User, Tags, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  const charCount = data.bio.length;
  const minChars = 100;
  const maxChars = 1000;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Sparkles className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Thông tin cơ bản
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Chia sẻ câu chuyện của bạn và những gì bạn có thể mang đến cho học viên
        </p>
      </div>

      {/* Form Content */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8 space-y-6">
        {/* Headline Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-semibold text-gray-800">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <span>Tiêu đề chuyên môn</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder:text-gray-400 text-sm"
                placeholder="VD: Chuyên gia lập trình Full-stack với 10 năm kinh nghiệm"
                value={data.headline}
                onChange={(e) => onChange({ ...data, headline: e.target.value })}
              />
              <p className="text-sm text-gray-500">
                Một câu ngắn gọn mô tả tốt nhất về bạn và kinh nghiệm của bạn
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-semibold text-gray-800">
                <div className="p-2 rounded-lg bg-purple-50">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span>Tiểu sử</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder:text-gray-400 resize-none text-sm"
                  placeholder="Kể về hành trình của bạn, điều gì khiến bạn đam mê giảng dạy, và bạn có thể giúp học viên như thế nào..."
                  rows={isMobile ? 6 : 8}
                  value={data.bio}
                  onChange={(e) => onChange({ ...data, bio: e.target.value })}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className={`text-xs font-medium ${charCount < minChars ? 'text-orange-500' : charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                    {charCount}/{maxChars}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {charCount < minChars ? (
                  <p className="text-sm text-orange-600">
                    Cần ít nhất {minChars - charCount} ký tự nữa để hồ sơ của bạn nổi bật hơn
                  </p>
                ) : (
                  <p className="text-sm text-green-600">
                    ✓ Tiểu sử của bạn đã đủ chi tiết
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expertise Areas Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-semibold text-gray-800">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Tags className="w-5 h-5 text-purple-600" />
                </div>
                <span>Lĩnh vực chuyên môn</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder:text-gray-400 text-sm"
                  placeholder="Nhập kỹ năng và nhấn Enter để thêm"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
              </div>

              {/* Selected Tags */}
              {data.expertiseAreas.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Đã chọn ({data.expertiseAreas.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.expertiseAreas.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-1.5 py-0.5 flex items-center gap-0.5 text-xs font-medium shadow-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              {availableSuggestedTags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Gợi ý cho bạn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestedTags.slice(0, 15).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 px-1.5 py-0.5 transition-colors border text-xs"
                        onClick={() => handleAddTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.expertiseAreas.length === 0 && (
                <p className="text-sm text-orange-600">
                  Vui lòng chọn ít nhất 1 lĩnh vực chuyên môn
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
