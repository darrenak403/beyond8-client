"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award, Building, Link, Calendar, Edit2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleSave = () => {
    setEditingIndex(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Chứng chỉ</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thêm các chứng chỉ và giấy chứng nhận của bạn</p>
      </div>

      <div className={`space-y-3 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto relative`}>
        <button
          type="button"
          className="absolute top-0 right-0 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors shadow-sm"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
        </button>
        {data.certificates.map((cert, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 transition-colors cursor-pointer"
            onClick={() => !editingIndex && setEditingIndex(index)}
          >
            <AnimatePresence mode="wait">
              {editingIndex === index ? (
                <motion.div
                  key={`edit-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4 overflow-hidden p-4"
                >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Chứng chỉ #{index + 1}</h4>
                  {data.certificates.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Tên chứng chỉ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: AWS Certified Solutions Architect"
                      value={cert.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    Tổ chức cấp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Link className="w-4 h-4 text-purple-600" />
                    Link chứng chỉ
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://..."
                      value={cert.url}
                      onChange={(e) => handleChange(index, 'url', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Năm cấp
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="2023"
                      value={cert.year}
                      onChange={(e) => handleChange(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="w-full mt-4"
                >
                  Lưu
                </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={`view-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{cert.name || "Chưa có tên chứng chỉ"}</div>
                    <div className="text-sm text-gray-600 mt-1">{cert.issuer || "Chưa có tổ chức cấp"}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {cert.year || "Chưa có năm"}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                          Xem chứng chỉ
                        </a>
                      )}
                    </div>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
