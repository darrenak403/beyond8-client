"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { useIdentity } from "@/hooks/useIdentity";
import Image from "next/image";

interface Step1Props {
  onNext: (data: { frontImg: string; backImg: string; frontFileId: string; backFileId: string }) => void;
  initialData?: { frontImg: string; backImg: string; frontFileId?: string; backFileId?: string };
}

export default function Step1UploadDocuments({ onNext, initialData }: Step1Props) {
  const { uploadFrontAsync, uploadBackAsync, isUploadingFront, isUploadingBack } = useIdentity();
  
  const [frontImg, setFrontImg] = useState<string>(initialData?.frontImg || "");
  const [backImg, setBackImg] = useState<string>(initialData?.backImg || "");
  const [frontFileId, setFrontFileId] = useState<string>(initialData?.frontFileId || "");
  const [backFileId, setBackFileId] = useState<string>(initialData?.backFileId || "");
  const [frontPreview, setFrontPreview] = useState<string>(initialData?.frontImg || "");
  const [backPreview, setBackPreview] = useState<string>(initialData?.backImg || "");

  const handleFileSelect = async (file: File, type: 'front' | 'back') => {
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'front') {
        setFrontPreview(result);
      } else {
        setBackPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Upload automatically
    try {
      const result = type === 'front' 
        ? await uploadFrontAsync(file)
        : await uploadBackAsync(file);

      if (type === 'front') {
        setFrontImg(result.fileUrl);
        setFrontFileId(result.fileId);
      } else {
        setBackImg(result.fileUrl);
        setBackFileId(result.fileId);
      }
    } catch (error) {
      // Error handled by hook, clear preview
      if (type === 'front') {
        setFrontPreview("");
      } else {
        setBackPreview("");
      }
    }
  };

  const handleRemove = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImg("");
      setFrontFileId("");
      setFrontPreview("");
    } else {
      setBackImg("");
      setBackFileId("");
      setBackPreview("");
    }
  };

  const canProceed = frontImg && backImg && frontFileId && backFileId && !isUploadingFront && !isUploadingBack;

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Tải lên CCCD</h2>
        <p className="text-gray-600">Vui lòng tải lên ảnh chụp rõ ràng mặt trước và mặt sau của CCCD</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Mặt trước</h3>
            {frontImg && !isUploadingFront && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt trước CCCD</p>
          
          {isUploadingFront ? (
            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
              <Skeleton className="w-12 h-12 rounded-full mb-2" />
              <span className="text-sm text-purple-600 font-medium">Đang xử lý ảnh CCCD...</span>
              <span className="text-xs text-gray-500 mt-1">Kiểm tra tính hợp lệ</span>
            </div>
          ) : !frontPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click để tải ảnh lên</span>
              <span className="text-xs text-gray-500 mt-1">Sẽ tự động kiểm tra</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, 'front');
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
                disabled={isUploadingFront}
              >
                <X className="w-4 h-4" />
              </Button>
              {frontImg && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã xác thực
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Mặt sau</h3>
            {backImg && !isUploadingBack && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt sau CCCD</p>
          
          {isUploadingBack ? (
            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
              <Skeleton className="w-12 h-12 rounded-full mb-2" />
              <span className="text-sm text-purple-600 font-medium">Đang xử lý ảnh CCCD...</span>
              <span className="text-xs text-gray-500 mt-1">Kiểm tra tính hợp lệ</span>
            </div>
          ) : !backPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click để tải ảnh lên</span>
              <span className="text-xs text-gray-500 mt-1">Sẽ tự động kiểm tra</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, 'back');
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
                disabled={isUploadingBack}
              >
                <X className="w-4 h-4" />
              </Button>
              {backImg && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã xác thực
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          disabled={!canProceed}
          onClick={() => onNext({ frontImg, backImg, frontFileId, backFileId })}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isUploadingFront || isUploadingBack ? "Đang xử lý..." : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}
