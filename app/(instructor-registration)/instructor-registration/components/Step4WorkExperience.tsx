"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Building, Briefcase, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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

    // Nếu đang bật "Đang làm việc tại đây", tự động set ngày hiện tại vào trường "to"
    if (field === 'isCurrentJob' && value === true) {
      newWorkExperience[index] = {
        ...newWorkExperience[index],
        [field]: value,
        to: new Date().toISOString()
      };
    } else {
      newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    }

    onChange({ workExperience: newWorkExperience });
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Target className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Kinh nghiệm làm việc
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Chia sẻ hành trình sự nghiệp và kinh nghiệm thực tế của bạn
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
          Thêm kinh nghiệm
        </Button>
      </div>

      {/* Work Experience List - Fixed Scroll Container */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {data.workExperience.map((work, index) => (
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
                              <Briefcase className="w-5 h-5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800">Kinh nghiệm #{index + 1}</h4>
                          </div>
                          {data.workExperience.length > 1 && (
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
                          {/* Company */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Building className="w-4 h-4 text-purple-600" />
                              Công ty <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="VD: FPT Software"
                              value={work.company}
                              onChange={(e) => handleChange(index, 'company', e.target.value)}
                            />
                          </div>

                          {/* Role */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-purple-600" />
                              Vị trí <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                              placeholder="VD: Senior Full-stack Developer"
                              value={work.role}
                              onChange={(e) => handleChange(index, 'role', e.target.value)}
                            />
                          </div>

                          {/* From & To Dates */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-purple-600" />
                                Từ <span className="text-red-500">*</span>
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
                                      !work.from && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {work.from ? (
                                      new Date(work.from).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                    ) : (
                                      <span>Chọn ngày bắt đầu</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-4" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={work.from ? new Date(work.from) : undefined}
                                    onSelect={(date) => {
                                      if (date) {
                                        handleChange(index, "from", date.toISOString());
                                      } else {
                                        handleChange(index, "from", "");
                                      }
                                    }}
                                    captionLayout="dropdown"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-purple-600" />
                                Đến {!work.isCurrentJob && <span className="text-red-500">*</span>}
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    disabled={work.isCurrentJob}
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed",
                                      !work.to && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {work.to ? (
                                      new Date(work.to).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                    ) : (
                                      <span>Chọn ngày kết thúc</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-4" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={work.to ? new Date(work.to) : undefined}
                                    onSelect={(date) => {
                                      if (date) {
                                        handleChange(index, "to", date.toISOString());
                                      } else {
                                        handleChange(index, "to", "");
                                      }
                                    }}
                                    captionLayout="dropdown"
                                    disabled={(date) => work.from ? date < new Date(work.from) : false}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          {/* Current Job Toggle */}
                          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                            <label className="text-sm font-semibold text-gray-700">
                              Đang làm việc tại đây
                            </label>
                            <Switch
                              checked={work.isCurrentJob}
                              onCheckedChange={(checked) => handleChange(index, 'isCurrentJob', checked)}
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-purple-600" />
                              Mô tả công việc
                            </label>
                            <Textarea
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-sm"
                              placeholder="Mô tả về công việc, trách nhiệm, dự án và thành tựu của bạn..."
                              rows={4}
                              value={work.description || ""}
                              onChange={(e) => handleChange(index, 'description', e.target.value || null)}
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
                            <Building className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-800">
                              {work.role || "Chưa có vị trí"}
                            </h3>
                            <p className="text-purple-600 font-medium mt-1">
                              {work.company || "Chưa có công ty"}
                            </p>
                            {work.description && (
                              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                {work.description}
                              </p>
                            )}
                            {work.isCurrentJob ? (
                              <div className="inline-block mt-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  Đang làm việc
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <CalendarIcon className="w-4 h-4" />
                                <span>
                                  {work.from
                                    ? `${formatDisplayDate(work.from)} - ${formatDisplayDate(work.to) || "N/A"}`
                                    : "Chưa có thời gian"}
                                </span>
                              </div>
                            )}
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

          {data.workExperience.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Chưa có kinh nghiệm làm việc</p>
              <p className="text-sm mt-2">Nhấn nút &ldquo;Thêm kinh nghiệm&rdquo; để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
