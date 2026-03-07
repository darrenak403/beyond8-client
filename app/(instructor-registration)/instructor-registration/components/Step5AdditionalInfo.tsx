"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { CreditCard, Hash, Facebook, Linkedin, Globe, Building2, User, Check, Search, Languages, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBanks } from "@/hooks/useBank";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/SafeImage";

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
  const { banks, isLoading } = useBanks();
  const [selectedBank, setSelectedBank] = useState<string | null>(data.bankInfo.bankName || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName);
    onChange({
      ...data,
      bankInfo: { ...data.bankInfo, bankName }
    });
  };

  const handleAddLanguage = (language: string) => {
    if (language && !data.teachingLanguages.includes(language)) {
      onChange({
        ...data,
        teachingLanguages: [...data.teachingLanguages, language]
      });
    }
    setCustomLanguage("");
  };

  const handleRemoveLanguage = (language: string) => {
    onChange({
      ...data,
      teachingLanguages: data.teachingLanguages.filter(lang => lang !== language)
    });
  };

  const handleLanguageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customLanguage.trim()) {
      e.preventDefault();
      handleAddLanguage(customLanguage.trim());
    }
  };

  const availableSuggestedLanguages = SUGGESTED_LANGUAGES.filter(
    lang => !data.teachingLanguages.includes(lang)
  );

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Thông tin bổ sung
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Hoàn tất hồ sơ với thông tin thanh toán và liên hệ
        </p>
      </div>

      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8 space-y-6">
        <AnimatePresence mode="wait">
          {/* Bank Selection Card */}
          {!selectedBank ? (
            <motion.div
              key="bank-selection"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Chọn ngân hàng</h3>
                      <span className="text-red-500">*</span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                        placeholder="Tìm kiếm ngân hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Bank Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
                      {isLoading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                          <Skeleton key={i} className="h-32 rounded-lg" />
                        ))
                      ) : filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                          <motion.button
                            key={bank.id}
                            type="button"
                            onClick={() => handleBankSelect(bank.name)}
                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className=" flex items-center justify-center">
                              <SafeImage
                                src={bank.logo}
                                alt={bank.shortName}
                                width={100}
                                height={100}
                                className="object-contain w-15 h-15"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-700 line-clamp-2">
                              {bank.shortName}
                            </span>
                          </motion.button>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-400">
                          <p className="text-sm">Không tìm thấy ngân hàng</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="bank-info"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Bank Information Card */}
              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-50">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Thông tin thanh toán</h3>
                        <span className="text-red-500">*</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBank(null);
                          onChange({
                            ...data,
                            bankInfo: { bankName: "", accountNumber: "", accountHolderName: "" }
                          });
                        }}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        Đổi ngân hàng
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-600" />
                          Tên ngân hàng <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          {selectedBank}
                        </div>
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
                    <label className="flex items-center gap-2 font-semibold text-gray-800">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Languages className="w-5 h-5 text-purple-600" />
                      </div>
                      <span>Ngôn ngữ giảng dạy</span>
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder:text-gray-400 text-sm"
                        placeholder="Nhập ngôn ngữ và nhấn Enter để thêm"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyDown={handleLanguageInputKeyDown}
                      />
                    </div>

                    {/* Selected Languages */}
                    {data.teachingLanguages.length > 0 && (
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Đã chọn ({data.teachingLanguages.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {data.teachingLanguages.map((language, index) => (
                            <motion.div
                              key={language}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-1.5 py-0.5 flex items-center gap-0.5 text-xs font-medium shadow-sm"
                              >
                                {language}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLanguage(language)}
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

                    {/* Suggested Languages */}
                    {availableSuggestedLanguages.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                          🌐 Gợi ý cho bạn:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableSuggestedLanguages.map((language) => (
                            <Badge
                              key={language}
                              variant="outline"
                              className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 px-1.5 py-0.5 transition-colors border text-xs"
                              onClick={() => handleAddLanguage(language)}
                            >
                              + {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.teachingLanguages.length === 0 && (
                      <p className="text-sm text-orange-600">
                        ⚠ Vui lòng chọn ít nhất 1 ngôn ngữ giảng dạy
                      </p>
                    )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
