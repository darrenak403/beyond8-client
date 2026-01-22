"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Building, Briefcase, Calendar as CalendarIcon, Edit2, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateForInput } from "@/lib/utils/formatDate";

interface WorkExperience {
  company: string;
  role: string;
  from: string;
  to: string;
  isCurrentJob: boolean;
  description: string | null;
}

interface Step5Props {
  data: { workExperience: WorkExperience[] };
  onChange: (data: { workExperience: WorkExperience[] }) => void;
}

export default function Step5WorkExperience({ data, onChange }: Step5Props) {
  const isMobile = useIsMobile();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toISOFromDateInput = (value: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString();
  };

  const handleAdd = () => {
    const newWorkExperience = [...data.workExperience, { company: "", role: "", from: "", to: "", isCurrentJob: false, description: null }];
    onChange({ workExperience: newWorkExperience });
    setEditingIndex(newWorkExperience.length - 1);
  };

  const handleRemove = (index: number) => {
    onChange({
      workExperience: data.workExperience.filter((_, i) => i !== index)
    });
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleChange = (index: number, field: keyof WorkExperience, value: string | boolean | null) => {
    const newWorkExperience = [...data.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    onChange({ workExperience: newWorkExperience });
  };

  const handleSave = () => {
    setEditingIndex(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Kinh nghiệm làm việc</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Chia sẻ kinh nghiệm làm việc của bạn</p>
      </div>

      <div className={`space-y-3 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto relative`}>
        <button
          type="button"
          className="absolute top-0 right-0 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors shadow-sm"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
        </button>
        {data.workExperience.map((work, index) => (
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
                  <h4 className="font-semibold">Kinh nghiệm #{index + 1}</h4>
                  {data.workExperience.length > 1 && (
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
                    <Building className="w-4 h-4 text-purple-600" />
                    Công ty
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: FPT Software"
                      value={work.company}
                      onChange={(e) => handleChange(index, 'company', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    Vị trí
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="VD: Senior Full-stack Developer"
                      value={work.role}
                      onChange={(e) => handleChange(index, 'role', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      Từ
                    </label>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formatDateForInput(work.from)}
                        onChange={(e) => handleChange(index, "from", toISOFromDateInput(e.target.value))}
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      Đến
                    </label>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formatDateForInput(work.to)}
                        onChange={(e) => handleChange(index, "to", toISOFromDateInput(e.target.value))}
                        disabled={work.isCurrentJob}
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    Đang làm việc tại đây
                  </label>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={work.isCurrentJob}
                      onCheckedChange={(checked) => handleChange(index, 'isCurrentJob', checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {work.isCurrentJob ? "Có" : "Không"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Mô tả công việc
                  </label>
                  <Textarea
                    className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Mô tả về công việc, trách nhiệm, thành tựu..."
                    rows={3}
                    value={work.description || ""}
                    onChange={(e) => handleChange(index, 'description', e.target.value || null)}
                    onClick={(e) => e.stopPropagation()}
                  />
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
                    <div className="font-semibold text-lg">{work.company || "Chưa có công ty"}</div>
                    <div className="text-sm text-gray-600 mt-1">{work.role || "Chưa có vị trí"}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {work.from
                        ? `${formatDateForInput(work.from)} - ${work.isCurrentJob ? "Hiện tại" : formatDateForInput(work.to)}`
                        : "Chưa có thời gian"}
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
