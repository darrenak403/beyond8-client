"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

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
  const handleAdd = () => {
    onChange({
      certificates: [...data.certificates, { name: "", url: "", issuer: "", year: new Date().getFullYear() }]
    });
  };

  const handleRemove = (index: number) => {
    onChange({
      certificates: data.certificates.filter((_, i) => i !== index)
    });
  };

  const handleChange = (index: number, field: keyof Certificate, value: string | number) => {
    const newCertificates = [...data.certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    onChange({ certificates: newCertificates });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Chứng chỉ</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thêm các chứng chỉ và giấy chứng nhận của bạn</p>
      </div>

      <div className={`space-y-4 pr-2 scrollbar-hide ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'} overflow-y-auto`}>
        {data.certificates.map((cert, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Chứng chỉ #{index + 1}</h4>
                  {data.certificates.length > 1 && (
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
                  <label className="text-sm font-medium">Tên chứng chỉ</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tổ chức cấp</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="VD: Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link chứng chỉ</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://..."
                    value={cert.url}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Năm cấp</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="2023"
                    value={cert.year}
                    onChange={(e) => handleChange(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                  />
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
          Thêm chứng chỉ
        </Button>
      </div>
    </div>
  );
}
