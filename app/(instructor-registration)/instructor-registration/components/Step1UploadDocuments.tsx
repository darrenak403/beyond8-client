"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle2, CreditCard } from "lucide-react";
import { useIdentity } from "@/hooks/useIdentity";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { useIsMobile } from "@/hooks/useMobile";
import SafeImage from "@/components/ui/SafeImage";

interface Step1Props {
  data: { 
    frontImg: string; 
    backImg: string; 
    frontFileId: string; 
    backFileId: string;
    frontClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
    backClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
  };
  onChange: (data: { 
    frontImg: string; 
    backImg: string; 
    frontFileId: string; 
    backFileId: string;
    frontClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
    backClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
  }) => void;
}

export default function Step1UploadDocuments({ data, onChange }: Step1Props) {
  const { uploadFrontAsync, uploadBackAsync, isUploadingFront, isUploadingBack } = useIdentity();
  const isMobile = useIsMobile();
  
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  // Initialize preview from data when component mounts or data changes
  useEffect(() => {
    if (data.frontImg) {
      // If it's a data URL (from FileReader), use it directly
      // Otherwise, format it as server URL
      if (data.frontImg.startsWith('data:')) {
      // eslint-disable-next-line
        setFrontPreview(data.frontImg);
      } else {
        const formattedUrl = formatImageUrl(data.frontImg);
        setFrontPreview(formattedUrl || data.frontImg);
      }
    } else {
      setFrontPreview("");
    }
  }, [data.frontImg]);

  useEffect(() => {
    if (data.backImg) {
      if (data.backImg.startsWith('data:')) {
        // eslint-disable-next-line
        setBackPreview(data.backImg);
      } else {
        const formattedUrl = formatImageUrl(data.backImg);
        setBackPreview(formattedUrl || data.backImg);
      }
    } else {
      setBackPreview("");
    }
  }, [data.backImg]);

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
        const updatedData = { 
          ...data, 
          frontImg: result.fileUrl, 
          frontFileId: result.fileId,
          frontClassifyResult: result.classifyResult
        };
        onChange(updatedData);
      } else {
        const updatedData = { 
          ...data, 
          backImg: result.fileUrl, 
          backFileId: result.fileId,
          backClassifyResult: result.classifyResult
        };
        console.log('Step1 - Back classifyResult:', result.classifyResult);
        console.log('Step1 - Updated back data:', updatedData);
        onChange(updatedData);
      }
    } catch {
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
      onChange({ ...data, frontImg: "", frontFileId: "", frontClassifyResult: undefined });
      setFrontPreview("");
    } else {
      onChange({ ...data, backImg: "", backFileId: "", backClassifyResult: undefined });
      setBackPreview("");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Tải lên CCCD</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Vui lòng tải lên ảnh chụp rõ ràng mặt trước và mặt sau của CCCD</p>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {/* Front Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Mặt trước</h3>
            {data.frontImg && !isUploadingFront && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt trước CCCD</p>
          
          {isUploadingFront ? (
            <div className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 ${isMobile ? 'h-48' : 'h-64'}`}>
              <Skeleton className="w-12 h-12 rounded-full mb-2" />
              <span className="text-sm text-purple-600 font-medium">Đang xử lý ảnh CCCD...</span>
              <span className="text-xs text-gray-500 mt-1">Kiểm tra tính hợp lệ</span>
            </div>
          ) : !frontPreview ? (
            <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${isMobile ? 'h-48' : 'h-64'}`}>
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
              <SafeImage
                src={frontPreview}
                alt="CCCD mặt trước"
                width={100}
                height={100100}
                className={`w-full object-cover rounded-lg ${isMobile ? 'h-48' : 'h-64'}`}
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
              {data.frontImg && (
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
            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Mặt sau</h3>
            {data.backImg && !isUploadingBack && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>
          <p className="text-sm text-gray-600">Tải lên ảnh mặt sau CCCD</p>
          
          {isUploadingBack ? (
            <div className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 ${isMobile ? 'h-48' : 'h-64'}`}>
              <Skeleton className="w-12 h-12 rounded-full mb-2" />
              <span className="text-sm text-purple-600 font-medium">Đang xử lý ảnh CCCD...</span>
              <span className="text-xs text-gray-500 mt-1">Kiểm tra tính hợp lệ</span>
            </div>
          ) : !backPreview ? (
            <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${isMobile ? 'h-48' : 'h-64'}`}>
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
              <SafeImage
                src={backPreview}
                alt="CCCD mặt sau"
                width={100}
                height={100}
                className={`w-full object-cover rounded-lg ${isMobile ? 'h-48' : 'h-64'}`}
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
              {data.backImg && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã xác thực
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Information Cards */}
      {(data.frontClassifyResult || data.backClassifyResult) && (
        <div className={`grid gap-6 mt-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          {/* Front Card Info */}
          {data.frontClassifyResult && (
            <Card className="border-2 border-green-100 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-green-200">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Thông tin mặt trước</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Loại:</span>
                      <span className="text-sm text-gray-900">{data.frontClassifyResult.type_name || "-"}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Tên thẻ:</span>
                      <span className="text-sm text-gray-900">{data.frontClassifyResult.card_name || "-"}</span>
                    </div>
                    
                    {data.frontClassifyResult.id_number && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Số CCCD:</span>
                        <span className="text-sm font-mono text-gray-900">{data.frontClassifyResult.id_number}</span>
                      </div>
                    )}
                    
                    {data.frontClassifyResult.issue_date && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Ngày cấp:</span>
                        <span className="text-sm text-gray-900">{data.frontClassifyResult.issue_date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back Card Info */}
          {data.backClassifyResult && (
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-blue-200">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Thông tin mặt sau</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Loại:</span>
                      <span className="text-sm text-gray-900">{data.backClassifyResult.type_name || "-"}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Tên thẻ:</span>
                      <span className="text-sm text-gray-900">{data.backClassifyResult.card_name || "-"}</span>
                    </div>
                    
                    {data.backClassifyResult.id_number && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Số CCCD:</span>
                        <span className="text-sm font-mono text-gray-900">{data.backClassifyResult.id_number}</span>
                      </div>
                    )}
                    
                    {data.backClassifyResult.issue_date && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">Ngày cấp:</span>
                        <span className="text-sm text-gray-900">{data.backClassifyResult.issue_date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
