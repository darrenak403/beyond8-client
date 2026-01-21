"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

interface Education {
  school: string;
  degree: string;
  start: number;
  end: number;
}

interface Step3Props {
  data: { education: Education[] };
  onChange: (data: { education: Education[] }) => void;
}

export default function Step3Education({ data, onChange }: Step3Props) {
  const isMobile = useIsMobile();
  const handleAdd = () => {
    onChange({
      education: [...data.education, { school: "", degree: "", start: new Date().getFullYear(), end: new Date().getFullYear() }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      education: data.education.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, field: keyof Education, value: string | number) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ education: newEducation });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Học vấn</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thêm thông tin về trình độ học vấn của bạn</p>
      </div>

      <div className={`space-y-4 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto`}>
        {data.education.map((edu, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Học vấn #{index + 1}</h4>
                  {data.education.length > 1 && (
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
                  <label className="text-sm font-medium">Tên trường</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: Đại học Bách Khoa Hà Nội"
                    value={edu.school}
                    onChange={(e) => handleChange(index, 'school', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bằng cấp</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: Cử nhân Khoa học Máy tính"
                    value={edu.degree}
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Năm bắt đầu</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="2015"
                      value={edu.start}
                      onChange={(e) => handleChange(index, 'start', parseInt(e.target.value) || new Date().getFullYear())}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Năm kết thúc</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="2019"
                      value={edu.end}
                      onChange={(e) => handleChange(index, 'end', parseInt(e.target.value) || new Date().getFullYear())}
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
          Thêm học vấn
        </Button>
      </div>
    </div>
  );
}
