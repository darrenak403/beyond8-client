"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
                  <label className="text-sm font-medium">Công ty</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: FPT Software"
                    value={work.company}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Vị trí</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: Senior Full-stack Developer"
                    value={work.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Từ</label>
                    <input
                      type="month"
                      className="w-full px-3 py-2 border rounded-md"
                      value={work.from}
                      onChange={(e) => handleChange(index, 'from', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Đến</label>
                    <input
                      type="month"
                      className="w-full px-3 py-2 border rounded-md"
                      value={work.to}
                      onChange={(e) => handleChange(index, 'to', e.target.value)}
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
