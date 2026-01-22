"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { CreditCard, Hash, Facebook, Linkedin, Globe, Languages, Video, Building2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AdditionalInfoData {
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  taxId: string | null;
  teachingLanguages: string[];
  introVideoUrl: string | null;
}

interface Step6Props {
  data: AdditionalInfoData;
  onChange: (data: AdditionalInfoData) => void;
}

const SUGGESTED_LANGUAGES = [
  "Tiếng Việt", "English", "日本語", "한국어", "简体中文", "繁體中文",
  "Français", "Deutsch", "Español", "Português", "Italiano", "Русский"
];

export default function Step6AdditionalInfo({ data, onChange }: Step6Props) {
  const isMobile = useIsMobile();
  const [languageInput, setLanguageInput] = useState("");

  const handleAddLanguage = (lang: string) => {
    if (lang && !data.teachingLanguages.includes(lang)) {
      onChange({ ...data, teachingLanguages: [...data.teachingLanguages, lang] });
    }
    setLanguageInput("");
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    onChange({
      ...data,
      teachingLanguages: data.teachingLanguages.filter(lang => lang !== langToRemove)
    });
  };

  const handleLanguageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      handleAddLanguage(languageInput.trim());
    }
  };

  const availableSuggestedLanguages = SUGGESTED_LANGUAGES.filter(
    lang => !data.teachingLanguages.includes(lang)
  );

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Thông tin bổ sung</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thông tin thanh toán và mạng xã hội</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Thông tin thanh toán</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Building2 className="w-4 h-4 text-purple-600" />
                Tên ngân hàng
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: Vietcombank"
                  value={data.bankInfo.bankName}
                  onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, bankName: e.target.value } })}
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <CreditCard className="w-4 h-4 text-purple-600" />
                Số tài khoản
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: 1234567890"
                  value={data.bankInfo.accountNumber}
                  onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, accountNumber: e.target.value } })}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <User className="w-4 h-4 text-purple-600" />
                Tên chủ tài khoản
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: Nguyễn Văn A"
                  value={data.bankInfo.accountHolderName}
                  onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, accountHolderName: e.target.value } })}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Hash className="w-4 h-4 text-purple-600" />
                Mã số thuế
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: 0123456789"
                  value={data.taxId || ""}
                  onChange={(e) => onChange({ ...data, taxId: e.target.value || null })}
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Ngôn ngữ giảng dạy</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Languages className="w-4 h-4 text-purple-600" />
                Ngôn ngữ giảng dạy
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="Nhập và nhấn Enter để thêm ngôn ngữ"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={handleLanguageInputKeyDown}
                />
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Selected Languages */}
              {data.teachingLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.teachingLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 flex items-center gap-2"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 hover:bg-purple-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Languages */}
              {availableSuggestedLanguages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Gợi ý:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestedLanguages.slice(0, 8).map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                        onClick={() => handleAddLanguage(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Video className="w-4 h-4 text-purple-600" />
                Link video giới thiệu
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://youtube.com/watch?v=..."
                  value={data.introVideoUrl || ""}
                  onChange={(e) => onChange({ ...data, introVideoUrl: e.target.value || null })}
                />
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Liên kết mạng xã hội</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Facebook className="w-4 h-4 text-purple-600" />
                Facebook
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://facebook.com/yourprofile"
                  value={data.socialLinks.facebook || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, facebook: e.target.value || null }
                  })}
                />
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Linkedin className="w-4 h-4 text-purple-600" />
                LinkedIn
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={data.socialLinks.linkedIn || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, linkedIn: e.target.value || null }
                  })}
                />
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Globe className="w-4 h-4 text-purple-600" />
                Website cá nhân
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://yourwebsite.com"
                  value={data.socialLinks.website || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, website: e.target.value || null }
                  })}
                />
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
