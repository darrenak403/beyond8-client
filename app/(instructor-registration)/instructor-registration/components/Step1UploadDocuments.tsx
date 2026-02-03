"use client";

import { useState, useEffect, useRef, useCallback, type ComponentRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle2, CreditCard, Camera, RotateCcw, User, Loader2 } from "lucide-react";
import { useIdentity, useFaceId } from "@/hooks/useIdentity";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { useIsMobile } from "@/hooks/useMobile";
import SafeImage from "@/components/ui/SafeImage";
import Webcam from "react-webcam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Step1Props {
  data: {
    facePhoto?: string; // Ảnh khuôn mặt
    frontImg: string;
    backImg: string;
    frontFileId: string;
    backFileId: string;
    frontClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
    backClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
  };
  onChange: (data: {
    facePhoto?: string;
    frontImg: string;
    backImg: string;
    frontFileId: string;
    backFileId: string;
    frontClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
    backClassifyResult?: { type_name: string; card_name: string; id_number: string | null; issue_date: string | null };
  }) => void;
}

// Helper to convert Data URL to File
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const match = arr[0].match(/:(.*?);/);
  if (!match) return null;
  const mime = match[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function Step1UploadDocuments({ data, onChange }: Step1Props) {
  const { uploadFrontAsync, uploadBackAsync, isUploadingFront, isUploadingBack } = useIdentity();
  const { faceIdAsync, isFaceId } = useFaceId();
  const isMobile = useIsMobile();

  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");
  const [facePhotoPreview, setFacePhotoPreview] = useState<string>("");
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  // const [frontFile, setFrontFile] = useState<File | null>(null); // Removed frontFile state
  const webcamRef = useRef<ComponentRef<typeof Webcam>>(null);

  // Check if CCCD is fully uploaded (both front and back)
  const hasCCCD = !!data.frontImg && !!data.backImg;

  // Chỉ cho phép upload mặt sau khi mặt trước đã upload & phân loại thành công
  const canUploadBack =
    !!data.frontImg &&
    !!data.frontFileId &&
    !!data.frontClassifyResult &&
    !isUploadingFront;

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

  useEffect(() => {
    if (data.facePhoto) {
      if (data.facePhoto.startsWith('data:')) {
        // eslint-disable-next-line
        setFacePhotoPreview(data.facePhoto);
      } else {
        const formattedUrl = formatImageUrl(data.facePhoto);
        setFacePhotoPreview(formattedUrl || data.facePhoto);
      }
    } else {
      setFacePhotoPreview("");
    }
  }, [data.facePhoto]);

  // Try to recover frontFile from URL if missing (e.g. after refresh)
  // Removed getFrontFile as it is no longer needed
  // const getFrontFile = useCallback(async (): Promise<File | null> => { ... }, [...]);

  const handleFileSelect = async (file: File, type: 'front' | 'back') => {
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'front') {
        setFrontPreview(result);
        // setFrontFile(file); // Removed setFrontFile
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
        // setFrontFile(null); // Removed setFrontFile
      } else {
        setBackPreview("");
      }
    }
  };

  const handleRemove = (type: 'front' | 'back') => {
    if (type === 'front') {
      onChange({ ...data, frontImg: "", frontFileId: "", frontClassifyResult: undefined });
      setFrontPreview("");
      // setFrontFile(null); // Removed setFrontFile
    } else {
      onChange({ ...data, backImg: "", backFileId: "", backClassifyResult: undefined });
      setBackPreview("");
    }
  };

  // Process Face Verification
  const processFaceVerification = useCallback(async (faceFile: File, previewSrc: string) => {
    try {
      // Use data.frontImg directly
      const currentFrontImg = data.frontImg;

      if (!currentFrontImg) {
        toast.error("Vui lòng tải lên lại mặt trước CCCD để thực hiện xác thực khuôn mặt.");
        return;
      }

      // Call API
      const result = await faceIdAsync({
        faceFile: faceFile,
        imgFrontHash: formatImageUrl(currentFrontImg) || '' // Pass URL string
      });

      if (result.isSuccess) {
        setFacePhotoPreview(previewSrc);
        onChange({ ...data, facePhoto: previewSrc });
        setShowWebcam(false);
      } else {
        // Handle explicit failure from API logic if needed
      }
    } catch (error) {
      console.error("Face verification error:", error);
      // Hook handles global error toast
    }
  }, [faceIdAsync, onChange, data]);

  // Handle face photo upload
  const handleFacePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Instead of just setting state, verify first
      processFaceVerification(file, result);
    };
    reader.readAsDataURL(file);
  };

  // Handle webcam capture
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const captureFacePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const file = dataURLtoFile(imageSrc, "face_capture.jpg");
      if (file) {
        processFaceVerification(file, imageSrc);
      } else {
        toast.error("Không thể xử lý ảnh từ camera");
      }
    }
  }, [processFaceVerification]);

  // Handle remove face photo
  const handleRemoveFacePhoto = () => {
    onChange({ ...data, facePhoto: undefined });
    setFacePhotoPreview("");
    setShowWebcam(false);
  };

  return (
    <div className="w-full h-full space-y-6 overflow-y-auto scrollbar-hide">
      {/* Loading Overlay */}
      {isFaceId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center flex-col gap-4 backdrop-blur-sm">
          <Loader2 className="w-16 h-16 text-white animate-spin" />
          <p className="text-white font-medium text-lg">Đang xác thực khuôn mặt...</p>
        </div>
      )}

      {/* Step 1: CCCD Upload - Shown FIRST */}
      {!hasCCCD && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="h-1 w-8 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">
                2
              </div>
            </div>
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
                    height={100}
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
              <p className="text-sm text-gray-600">
                {canUploadBack
                  ? "Tải lên ảnh mặt sau CCCD"
                  : "Vui lòng tải lên và xác thực mặt trước trước khi tiếp tục"}
              </p>

              {isUploadingBack ? (
                <div className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 ${isMobile ? 'h-48' : 'h-64'}`}>
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <span className="text-sm text-purple-600 font-medium">Đang xử lý ảnh CCCD...</span>
                  <span className="text-xs text-gray-500 mt-1">Kiểm tra tính hợp lệ</span>
                </div>
              ) : !backPreview ? (
                <label
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg transition ${isMobile ? 'h-48' : 'h-64'
                    } ${canUploadBack ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60 pointer-events-none'}`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click để tải ảnh lên</span>
                  <span className="text-xs text-gray-500 mt-1">Sẽ tự động kiểm tra</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={!canUploadBack}
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
      )}

      {/* Step 2: Face Photo - Shown SECOND (Only after CCCD) */}
      {hasCCCD && (
        <div className="space-y-8">
          {/* Header with gradient */}
          <div className="text-center space-y-3">
            {/* Progress Stepper - Step 2 Active */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="h-1 w-8 bg-green-600"></div>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                2
              </div>
            </div>

            <h2 className={`font-bold bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-pink bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Xác thực khuôn mặt
            </h2>
            <p className={`text-gray-600 dark:text-gray-400 max-w-md mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
              Chụp ảnh khuôn mặt rõ ràng để xác minh danh tính của bạn
            </p>
          </div>

          {!showWebcam ? (
            <div className="space-y-6">
              {!facePhotoPreview ? (
                <div className="space-y-4">
                  {/* Tabs with glassmorphism */}
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-brand-purple/10 via-brand-magenta/10 to-brand-pink/10 backdrop-blur-sm border border-brand-magenta/20">
                      <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-brand-magenta/10 transition-all duration-300"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Tải lên
                      </TabsTrigger>
                      <TabsTrigger
                        value="camera"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg data-[state=active]:shadow-brand-magenta/10 transition-all duration-300"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Chụp ảnh
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-6">
                      <label className={`group relative flex flex-col items-center justify-center w-full border-2 border-dashed border-brand-magenta/30 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:border-brand-magenta/60 hover:shadow-xl hover:shadow-brand-magenta/10 ${isMobile ? 'h-72' : 'h-96'}`}>
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-brand-magenta/5 to-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-purple/10 via-brand-magenta/10 to-brand-pink/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <User className="w-10 h-10 text-brand-magenta" />
                          </div>
                          <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold mb-2">Click để chọn ảnh</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG hoặc HEIC (tối đa 10MB)</span>

                          {/* Decorative elements */}
                          <div className="mt-6 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-brand-magenta animate-pulse delay-75" />
                            <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse delay-150" />
                          </div>
                        </div>

                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFacePhotoUpload(file);
                          }}
                        />
                      </label>
                    </TabsContent>

                    <TabsContent value="camera" className="mt-6">
                      <div className={`group relative flex flex-col items-center justify-center w-full border-2 border-dashed border-brand-magenta/30 rounded-2xl overflow-hidden ${isMobile ? 'h-72' : 'h-96'}`}>
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-brand-magenta/5 to-brand-pink/5" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-purple/10 via-brand-magenta/10 to-brand-pink/10 flex items-center justify-center mb-6">
                            <Camera className="w-10 h-10 text-brand-magenta" />
                          </div>
                          <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold mb-2">Chụp ảnh từ camera</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center px-4">Đảm bảo ánh sáng đủ và khuôn mặt rõ ràng</span>
                          <Button
                            onClick={() => setShowWebcam(true)}
                            className="gap-2 rounded-xl bg-brand-magenta hover:bg-brand-magenta/80 px-8"
                          >
                            <Camera className="w-4 h-4" />
                            Bật camera
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Info card */}
                  <div className="relative overflow-hidden rounded-xl border border-brand-magenta/20 bg-gradient-to-r from-brand-purple/5 via-brand-magenta/5 to-brand-pink/5 backdrop-blur-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Lưu ý quan trọng</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Khuôn mặt nhìn thẳng vào camera</li>
                          <li>• Không đeo kính râm hoặc khẩu trang</li>
                          <li>• Ánh sáng đủ, không bị tối hoặc quá sáng</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  {/* Image with glassmorphism overlay */}
                  <div className="relative overflow-hidden rounded-2xl border-2 border-brand-magenta/30 shadow-2xl shadow-brand-magenta/20">
                    <SafeImage
                      src={facePhotoPreview}
                      alt="Ảnh khuôn mặt"
                      width={400}
                      height={400}
                      className={`w-full object-cover ${isMobile ? 'h-72' : 'h-96'}`}
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Remove button */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-3 right-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={handleRemoveFacePhoto}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    {/* Success badge */}
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã xác thực
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Webcam container with premium styling */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-brand-magenta/40 shadow-2xl shadow-brand-magenta/20">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                  className={`w-full ${isMobile ? 'h-72' : 'h-96'} object-cover`}
                />

                {/* Animated face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Outer glow ring */}
                  <div className="absolute w-64 h-80 rounded-full border-4 border-brand-magenta/30 animate-pulse" />

                  {/* Main guide oval */}
                  <div className="relative w-56 h-72 rounded-full border-4 border-dashed border-brand-magenta shadow-lg shadow-brand-magenta/50">
                    {/* Corner markers */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-brand-purple rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-brand-purple rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-brand-pink rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-brand-pink rounded-br-lg" />
                  </div>

                  {/* Instruction text */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                    Đặt khuôn mặt vào khung hình
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowWebcam(false)}
                  className="gap-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </Button>
                <Button
                  onClick={captureFacePhoto}
                  className="gap-2 rounded-xl bg-brand-magenta hover:bg-brand-magenta/80 px-8"
                >
                  <Camera className="w-4 h-4" />
                  Chụp ảnh
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const imageSrc = webcamRef.current?.getScreenshot();
                    if (imageSrc) {
                      const file = dataURLtoFile(imageSrc, "face_capture.jpg");
                      if (file) {
                        processFaceVerification(file, imageSrc);
                      } else {
                        toast.error("Không thể xử lý ảnh từ camera");
                      }
                    }
                  }}
                  className="gap-2 border-brand-magenta/30 hover:border-brand-magenta/60 hover:bg-brand-magenta/5 hover:text-black transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Chụp lại
                </Button>
              </div>

              {/* Tips card with glassmorphism */}
              <div className="relative overflow-hidden rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 backdrop-blur-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                      <strong className="font-semibold">Mẹo:</strong> Đảm bảo khuôn mặt nằm trong khung oval, ánh sáng đủ và không đeo kính râm hoặc khẩu trang để có kết quả tốt nhất
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
