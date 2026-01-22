"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award, Building, Link as LinkIcon, Calendar, Medal, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Certificate {
  name: string;
  url: string;
  issuer: string;
  year: number;
}

interface Step4Props {
  data: { certificates: Certificate[] };
  onChange: (data: { certificates: Certificate[] }) => void;
}

export default function Step4Certificates({ data, onChange }: Step4Props) {
  const isMobile = useIsMobile();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newCertificates = [...data.certificates, { name: "", url: "", issuer: "", year: new Date().getFullYear() }];
    onChange({ certificates: newCertificates });
    setEditingIndex(newCertificates.length - 1);
  };

  const handleRemove = (index: number) => {
    onChange({
      certificates: data.certificates.filter((_, i) => i !== index)
    });
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleChange = (index: number, field: keyof Certificate, value: string | number) => {
    const newCertificates = [...data.certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    onChange({ certificates: newCertificates });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Medal className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Chứng chỉ
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Thêm các chứng chỉ và giấy chứng nhận để tăng uy tín của bạn
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mt-8 flex-shrink-0">
        <Button
          type="button"
          onClick={handleAdd}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm chứng chỉ
        </Button>
      </div>

      {/* Certificates List - Fixed Scroll Container */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {data.certificates.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg rounded-4xl">
                  <CardContent className="pt-4 px-4 pb-4">
                    {editingIndex === index ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-50">
                              <Award className="w-5 h-5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800">Chứng chỉ #{index + 1}</h4>
                          </div>
                          {data.certificates.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleRemove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Certificate Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Award className="w-4 h-4 text-purple-600" />
                              Tên chứng chỉ <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="VD: AWS Certified Solutions Architect"
                              value={cert.name}
                              onChange={(e) => handleChange(index, 'name', e.target.value)}
                            />
                          </div>

                          {/* Issuer */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Building className="w-4 h-4 text-purple-600" />
                              Tổ chức cấp <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="VD: Amazon Web Services"
                              value={cert.issuer}
                              onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                            />
                          </div>

                          {/* Certificate URL */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <LinkIcon className="w-4 h-4 text-purple-600" />
                              Link chứng chỉ <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="https://www.credential.net/..."
                              value={cert.url}
                              onChange={(e) => handleChange(index, 'url', e.target.value)}
                            />
                          </div>

                          {/* Year */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              Năm cấp
                            </label>
                            <input
                              type="number"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="2023"
                              min="1950"
                              max={new Date().getFullYear()}
                              value={cert.year}
                              onChange={(e) => handleChange(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          ✓ Lưu thông tin
                        </Button>
                      </div>
                    ) : (
                      // View Mode
                      <div
                        className="cursor-pointer"
                        onClick={() => setEditingIndex(index)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Medal className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-800">
                              {cert.name || "Chưa có tên chứng chỉ"}
                            </h3>
                            <p className="text-purple-600 font-medium mt-1">
                              {cert.issuer || "Chưa có tổ chức cấp"}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{cert.year}</span>
                              </div>
                              {cert.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Xem chứng chỉ</span>
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-purple-600 hover:text-purple-700 transition-colors">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {data.certificates.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Medal className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Chưa có chứng chỉ nào</p>
              <p className="text-sm mt-2">Nhấn nút &ldquo;Thêm chứng chỉ&rdquo; để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
