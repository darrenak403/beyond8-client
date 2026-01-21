"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface Step1Props {
  onNext: (data: { frontImg: string; backImg: string }) => void;
  initialData?: { frontImg: string; backImg: string };
}

export default function Step1UploadDocuments({ onNext, initialData }: Step1Props) {
  const [frontImg, setFrontImg] = useState<string>(initialData?.frontImg || "");
  const [backImg, setBackImg] = useState<string>(initialData?.backImg || "");
  const [frontPreview, setFrontPreview] = useState<string>(initialData?.frontImg || "");
  const [backPreview, setBackPreview] = useState<string>(initialData?.backImg || "");

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'front') {
        setFrontImg(result);
        setFrontPreview(result);
      } else {
        setBackImg(result);
        setBackPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImg("");
      setFrontPreview("");
    } else {
      setBackImg("");
      setBackPreview("");
    }
  };

  const canProceed = frontImg && backImg;

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Tải lên CCCD/CMND</h2>
        <p className="text-gray-600">Vui lòng tải lên ảnh chụp rõ ràng mặt trước và mặt sau của CCCD/CMND</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Mặt trước</h3>
            {frontImg && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt trước CCCD/CMND</p>
          {!frontPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click để tải ảnh lên</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'front');
                }}
              />
            </label>
          ) : (
            <div className="relative">
              <Image
                src={frontPreview}
                alt="CCCD mặt trước"
                width={400}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleRemove('front')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Back Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Mặt sau</h3>
            {backImg && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt sau CCCD/CMND</p>
          {!backPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click để tải ảnh lên</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'back');
                }}
              />
            </label>
          ) : (
            <div className="relative">
              <Image
                src={backPreview}
                alt="CCCD mặt sau"
                width={400}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleRemove('back')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          disabled={!canProceed}
          onClick={() => onNext({ frontImg, backImg })}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
