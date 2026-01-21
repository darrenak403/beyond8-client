"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthYearPicker } from "@/components/ui/calendar";
import { Plus, Trash2, Building, Briefcase, Calendar as CalendarIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

interface WorkExperience {
  company: string;
  role: string;
  from: string;
  to: string;
}

interface Step5Props {
  data: { workExperience: WorkExperience[] };
  onChange: (data: { workExperience: WorkExperience[] }) => void;
}

export default function Step5WorkExperience({ data, onChange }: Step5Props) {
  const isMobile = useIsMobile();
  const handleAdd = () => {
    onChange({
      workExperience: [...data.workExperience, { company: "", role: "", from: "", to: "" }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      workExperience: data.workExperience.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, field: keyof WorkExperience, value: string) => {
    const newWorkExperience = [...data.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    onChange({ workExperience: newWorkExperience });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Kinh nghiệm làm việc</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Chia sẻ kinh nghiệm làm việc của bạn</p>
      </div>

      <div className={`space-y-4 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto`}>
        {data.workExperience.map((work, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Kinh nghiệm #{index + 1}</h4>
                  {data.workExperience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
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
                      className="w-full pl-10 pr-3 py-2 border rounded-md"
                      placeholder="VD: FPT Software"
                      value={work.company}
                      onChange={(e) => handleChange(index, 'company', e.target.value)}
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
                      className="w-full pl-10 pr-3 py-2 border rounded-md"
                      placeholder="VD: Senior Full-stack Developer"
                      value={work.role}
                      onChange={(e) => handleChange(index, 'role', e.target.value)}
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
                    <MonthYearPicker
                      value={work.from}
                      onChange={(value) => handleChange(index, 'from', value)}
                      placeholder="Chọn tháng/năm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      Đến
                    </label>
                    <MonthYearPicker
                      value={work.to}
                      onChange={(value) => handleChange(index, 'to', value)}
                      placeholder="Chọn tháng/năm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm kinh nghiệm
        </Button>
      </div>
    </div>
  );
}
