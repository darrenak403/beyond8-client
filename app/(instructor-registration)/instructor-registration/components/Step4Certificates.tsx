"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award, Building, Link as LinkIcon, Calendar, Medal, ExternalLink, Video } from "lucide-react";
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
  data: { 
    certificates: Certificate[];
    introVideoUrl: string | null;
  };
  onChange: (data: { 
    certificates: Certificate[];
    introVideoUrl: string | null;
  }) => void;
}

export default function Step4Certificates({ data, onChange }: Step4Props) {
  const isMobile = useIsMobile();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newCertificates = [...data.certificates, { name: "", url: "", issuer: "", year: new Date().getFullYear() }];
    onChange({ ...data, certificates: newCertificates });
    setEditingIndex(newCertificates.length - 1);
  };

  const handleRemove = (index: number) => {
    onChange({
      ...data,
      certificates: data.certificates.filter((_, i) => i !== index)
    });
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleChange = (index: number, field: keyof Certificate, value: string | number) => {
    const newCertificates = [...data.certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    onChange({ ...data, certificates: newCertificates });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Medal className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Chứng chỉ & Video giới thiệu
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Thêm chứng chỉ và video giới thiệu để tăng uy tín của bạn
        </p>
      </div>

      {/* Content Container */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8">
        <div className="space-y-6">
          {/* Card 1: Certificates */}
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Chứng chỉ</h3>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAdd}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>

                {/* Certificates List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
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
                        <Card className="border border-purple-100 hover:border-purple-300 transition-all">
                          <CardContent className="pt-4 px-4 pb-4">
                            {editingIndex === index ? (
                              // Edit Mode
                              <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <h4 className="font-semibold text-sm text-gray-800">Chứng chỉ #{index + 1}</h4>
                                  {data.certificates.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-red-50 hover:text-red-600 h-8"
                                      onClick={() => handleRemove(index)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  {/* Certificate Name */}
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                      <Award className="w-3.5 h-3.5 text-purple-600" />
                                      Tên chứng chỉ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                      placeholder="VD: AWS Certified Solutions Architect"
                                      value={cert.name}
                                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    />
                                  </div>

                                  {/* Issuer */}
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                      <Building className="w-3.5 h-3.5 text-purple-600" />
                                      Tổ chức cấp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                      placeholder="VD: Amazon Web Services"
                                      value={cert.issuer}
                                      onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                                    />
                                  </div>

                                  {/* Certificate URL */}
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                      <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                                      Link chứng chỉ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="url"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                      placeholder="https://www.credential.net/..."
                                      value={cert.url}
                                      onChange={(e) => handleChange(index, 'url', e.target.value)}
                                    />
                                  </div>

                                  {/* Year */}
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                                      Năm cấp
                                    </label>
                                    <input
                                      type="number"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
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
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-9 text-xs"
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
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <Medal className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-gray-800 truncate">
                                      {cert.name || "Chưa có tên chứng chỉ"}
                                    </h3>
                                    <p className="text-purple-600 font-medium text-xs mt-0.5 truncate">
                                      {cert.issuer || "Chưa có tổ chức cấp"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="flex items-center gap-0.5 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{cert.year}</span>
                                      </div>
                                      {cert.url && (
                                        <a
                                          href={cert.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-0.5 text-xs text-purple-600 hover:text-purple-700 hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          <span>Xem</span>
                                        </a>
                                      )}
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
                    <div className="text-center py-8 text-gray-400">
                      <Medal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Chưa có chứng chỉ nào</p>
                      <p className="text-xs mt-1">Nhấn nút &ldquo;Thêm&rdquo; để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Intro Video */}
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Video giới thiệu</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    Link video giới thiệu (không bắt buộc)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="https://youtube.com/watch?v=... hoặc https://vimeo.com/..."
                    value={data.introVideoUrl || ""}
                    onChange={(e) => onChange({ ...data, introVideoUrl: e.target.value || null })}
                  />
                  <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                    <p className="text-xs text-gray-600">
                      <strong>Lưu ý:</strong> Video giới thiệu giúp học viên hiểu rõ hơn về bạn và phong cách giảng dạy của bạn.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Độ dài video: 1-3 phút</li>
                      <li>Giới thiệu bản thân, kinh nghiệm và lý do muốn giảng dạy</li>
                    </ul>
                  </div>

                  {data.introVideoUrl && (
                    <div className="border-2 border-purple-100 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Video sẽ được xem trước ở đây</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 break-all">{data.introVideoUrl}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
