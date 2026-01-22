"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { CreditCard, Hash, Facebook, Linkedin, Globe, Languages, Video, Building2, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Info className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Thông tin bổ sung
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Hoàn tất hồ sơ với thông tin thanh toán và liên hệ
        </p>
      </div>

      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8 space-y-6">
        {/* Bank Information Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b">
                <div className="p-2 rounded-lg bg-purple-50">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Thông tin thanh toán</h3>
                <span className="text-red-500">*</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Tên ngân hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="VD: Vietcombank, BIDV, Techcombank..."
                    value={data.bankInfo.bankName}
                    onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, bankName: e.target.value } })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="VD: 1234567890"
                    value={data.bankInfo.accountNumber}
                    onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, accountNumber: e.target.value } })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Tên chủ tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="VD: NGUYEN VAN A"
                    value={data.bankInfo.accountHolderName}
                    onChange={(e) => onChange({ ...data, bankInfo: { ...data.bankInfo, accountHolderName: e.target.value } })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    Mã số thuế (không bắt buộc)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="VD: 0123456789"
                    value={data.taxId || ""}
                    onChange={(e) => onChange({ ...data, taxId: e.target.value || null })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Languages Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Languages className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Ngôn ngữ giảng dạy</h3>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="Nhập ngôn ngữ và nhấn Enter"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={handleLanguageInputKeyDown}
                />
              </div>

              {data.teachingLanguages.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Đã chọn ({data.teachingLanguages.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.teachingLanguages.map((lang, index) => (
                      <motion.div
                        key={lang}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-1.5 py-0.5 flex items-center gap-0.5 text-[10px] font-medium"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(lang)}
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

              {availableSuggestedLanguages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                     Gợi ý:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestedLanguages.slice(0, 8).map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 px-1.5 py-0.5 transition-colors border text-[10px]"
                        onClick={() => handleAddLanguage(lang)}
                      >
                        + {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  Link video giới thiệu (không bắt buộc)
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                  value={data.introVideoUrl || ""}
                  onChange={(e) => onChange({ ...data, introVideoUrl: e.target.value || null })}
                />
                <p className="text-xs text-gray-500">
                  Một video ngắn giới thiệu về bản thân sẽ giúp học viên hiểu rõ hơn về bạn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Liên kết mạng xã hội</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-purple-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="https://facebook.com/yourprofile"
                    value={data.socialLinks.facebook || ""}
                    onChange={(e) => onChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, facebook: e.target.value || null }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-purple-600" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={data.socialLinks.linkedIn || ""}
                    onChange={(e) => onChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, linkedIn: e.target.value || null }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    Website cá nhân
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="https://yourwebsite.com"
                    value={data.socialLinks.website || ""}
                    onChange={(e) => onChange({
                      ...data,
                      socialLinks: { ...data.socialLinks, website: e.target.value || null }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
