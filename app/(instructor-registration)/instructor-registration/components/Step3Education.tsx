"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, School, Award, Calendar, Edit2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  start: number;
  end: number;
}

interface Step3Props {
  data: { education: Education[] };
  onChange: (data: { education: Education[] }) => void;
}

export default function Step3Education({ data, onChange }: Step3Props) {
  const isMobile = useIsMobile();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newEducation = [...data.education, { school: "", degree: "", fieldOfStudy: "", start: new Date().getFullYear(), end: new Date().getFullYear() }];
    onChange({ education: newEducation });
    setEditingIndex(newEducation.length - 1);
  };

  const handleRemove = (index: number) => {
    onChange({
      education: data.education.filter((_, i) => i !== index)
    });
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleChange = (index: number, field: keyof Education, value: string | number) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ education: newEducation });
  };

  const handleSave = () => {
    setEditingIndex(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Học vấn</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thêm thông tin về trình độ học vấn của bạn</p>
      </div>

      <div className={`space-y-3 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto relative`}>
        <button
          type="button"
          className="absolute top-0 right-0 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors shadow-sm"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
        </button>
        {data.education.map((edu, index) => (
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
                  <h4 className="font-semibold">Học vấn #{index + 1}</h4>
                  {data.education.length > 1 && (
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
                    <School className="w-4 h-4 text-purple-600" />
                    Tên trường
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: Đại học Bách Khoa Hà Nội"
                      value={edu.school}
                      onChange={(e) => handleChange(index, 'school', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Bằng cấp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: Cử nhân Khoa học Máy tính"
                      value={edu.degree}
                      onChange={(e) => handleChange(index, 'degree', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <School className="w-4 h-4 text-purple-600" />
                    Chuyên ngành
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: Khoa học Máy tính"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Năm bắt đầu
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="2015"
                        value={edu.start}
                        onChange={(e) => handleChange(index, 'start', parseInt(e.target.value) || new Date().getFullYear())}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Năm kết thúc
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="2019"
                        value={edu.end}
                        onChange={(e) => handleChange(index, 'end', parseInt(e.target.value) || new Date().getFullYear())}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
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
                    <div className="font-semibold text-lg">{edu.school || "Chưa có tên trường"}</div>
                    <div className="text-sm text-gray-600 mt-1">{edu.degree || "Chưa có bằng cấp"}</div>
                    {edu.fieldOfStudy && (
                      <div className="text-sm text-gray-500 mt-1">{edu.fieldOfStudy}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {edu.start} - {edu.end}
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
