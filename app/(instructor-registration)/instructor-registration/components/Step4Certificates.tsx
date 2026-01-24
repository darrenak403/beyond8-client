"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award, Building, Calendar, Medal, Video, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useMedia } from "@/hooks/useMedia";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";

interface Certificate {
  name: string;
  imageUrl: string;
  issuer: string;
  year: number;
}

interface Step4Props {
  data: { 
    certificates: Certificate[];
    introVideoUrl: string | null;
  };
  onChange: (data: { 
    certificates: Certificate[];
    introVideoUrl: string | null;
  }) => void;
}

export default function Step4Certificates({ data, onChange }: Step4Props) {
  const isMobile = useIsMobile();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { uploadCertificateAsync, isUploadingCertificate, uploadIntroVideoAsync } = useMedia();

  const handleAdd = () => {
    const newCertificates = [...data.certificates, { name: "", imageUrl: "", issuer: "", year: new Date().getFullYear() }];
    onChange({ ...data, certificates: newCertificates });
    setEditingIndex(newCertificates.length - 1);
  };

  const handleRemove = (index: number) => {
    onChange({
      ...data,
      certificates: data.certificates.filter((_, i) => i !== index)
    });
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleChange = (index: number, field: keyof Certificate, value: string | number) => {
    const newCertificates = [...data.certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    onChange({ ...data, certificates: newCertificates });
  };

  const handleFileSelect = async (index: number, file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Vui lòng chọn file PNG, JPG hoặc PDF');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file tối đa là 5MB');
      return;
    }

    try {
      setUploadingIndex(index);
      const uploadedFile = await uploadCertificateAsync(file);
      handleChange(index, 'imageUrl', uploadedFile.fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingIndex(null);
      // Reset file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVideoFileSelect = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('Vui lòng chọn file MP4, MOV hoặc AVI');
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('Kích thước file tối đa là 100MB');
      return;
    }

    try {
      setUploadingVideo(true);
      const uploadedFile = await uploadIntroVideoAsync(file);
      onChange({ ...data, introVideoUrl: formatImageUrl(uploadedFile.fileUrl) || uploadedFile.fileUrl });
    } catch (error) {
      console.error('Upload video failed:', error);
    } finally {
      setUploadingVideo(false);
      // Reset file input to allow re-uploading the same file
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
          <Medal className="w-8 h-8 text-white" />
        </div> */}
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Chứng chỉ & Video giới thiệu
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          Thêm chứng chỉ và video giới thiệu để tăng uy tín của bạn
        </p>
      </div>

      {/* Content Container */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8">
        <div className="space-y-6">
          {/* Card 1: Certificates */}
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Chứng chỉ</h3>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAdd}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>

                {/* Certificates List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  <AnimatePresence mode="popLayout">
                    {data.certificates.map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        <Card className="border border-purple-100 hover:border-purple-300 transition-all">
                          <CardContent className="pt-4 px-4 pb-4">
                            {editingIndex === index ? (
                              // Edit Mode - Two Column Layout
                              <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <h4 className="font-semibold text-sm text-gray-800">Chứng chỉ #{index + 1}</h4>
                                  {data.certificates.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-red-50 hover:text-red-600 h-8"
                                      onClick={() => handleRemove(index)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>

                                {/* Two Column Layout */}
                                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                  {/* Left Column - Image Upload */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                      <Award className="w-3.5 h-3.5 text-purple-600" />
                                      Ảnh chứng chỉ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/png,image/jpeg,image/jpg,application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && editingIndex !== null) {
                                          handleFileSelect(editingIndex, file);
                                        }
                                      }}
                                    />
                                    <div 
                                      className="border-2 border-dashed border-purple-300 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer bg-purple-50/50"
                                      onClick={() => !isUploadingCertificate && fileInputRef.current?.click()}
                                    >
                                      {uploadingIndex === index ? (
                                        <div className="aspect-[4/3] w-full flex flex-col items-center justify-center text-center">
                                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2 animate-pulse">
                                            <Upload className="w-6 h-6 text-purple-600" />
                                          </div>
                                          <p className="text-xs font-medium text-gray-700">Đang tải lên...</p>
                                        </div>
                                      ) : cert.imageUrl ? (
                                        <div className="relative aspect-[4/3] w-full">
                                          <SafeImage
                                            src={formatImageUrl(cert.imageUrl) || cert.imageUrl}
                                            alt="Certificate preview"
                                            className="w-full h-full object-cover rounded-lg"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-white h-7 w-7 p-0"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleChange(index, 'imageUrl', '');
                                              // Reset file input
                                              if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                              }
                                            }}
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="aspect-[4/3] w-full flex flex-col items-center justify-center text-center">
                                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                            <Award className="w-6 h-6 text-purple-600" />
                                          </div>
                                          <p className="text-xs font-medium text-gray-700 mb-1">Upload ảnh chứng chỉ</p>
                                          <p className="text-xs text-gray-500">PNG, JPG hoặc PDF</p>
                                          <p className="text-xs text-gray-400 mt-1">Tối đa 5MB</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right Column - Certificate Information */}
                                  <div className="space-y-3">
                                    {/* Certificate Name */}
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-purple-600" />
                                        Tên chứng chỉ <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                        placeholder="VD: AWS Certified Solutions Architect"
                                        value={cert.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                      />
                                    </div>

                                    {/* Issuer */}
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Building className="w-3.5 h-3.5 text-purple-600" />
                                        Tổ chức cấp <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                        placeholder="VD: Amazon Web Services"
                                        value={cert.issuer}
                                        onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                                      />
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                                        Năm cấp
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs"
                                        placeholder="2023"
                                        min="1950"
                                        max={new Date().getFullYear()}
                                        value={cert.year}
                                        onChange={(e) => handleChange(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => setEditingIndex(null)}
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-9 text-xs"
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
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <Medal className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-gray-800 truncate">
                                      {cert.name || "Chưa có tên chứng chỉ"}
                                    </h3>
                                    <p className="text-purple-600 font-medium text-xs mt-0.5 truncate">
                                      {cert.issuer || "Chưa có tổ chức cấp"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="flex items-center gap-0.5 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{cert.year}</span>
                                      </div>
                                      {cert.imageUrl && (
                                        <span className="flex items-center gap-0.5 text-xs text-green-600">
                                          <Award className="w-3 h-3" />
                                          <span>Có ảnh</span>
                                        </span>
                                      )}
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

                  {data.certificates.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Medal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Chưa có chứng chỉ nào</p>
                      <p className="text-xs mt-1">Nhấn nút &ldquo;Thêm&rdquo; để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Intro Video */}
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Video giới thiệu</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    Upload video giới thiệu (không bắt buộc)
                  </label>
                  
                  {/* Hidden Video Input */}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleVideoFileSelect(file);
                      }
                    }}
                  />
                  
                  {/* Video Upload Area */}
                  <div className="border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer bg-purple-50/50"
                    onClick={() => !uploadingVideo && !data.introVideoUrl && videoInputRef.current?.click()}
                  >
                    {uploadingVideo ? (
                      <div className="aspect-video w-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 animate-pulse">
                          <Upload className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Đang tải lên video...</p>
                      </div>
                    ) : data.introVideoUrl ? (
                      <div className="relative">
                        <div className="aspect-video w-full bg-gray-900 rounded-lg flex items-center justify-center">
                          <video
                            src={data.introVideoUrl}
                            controls
                            className="w-full h-full rounded-lg"
                          >
                            Trình duyệt của bạn không hỗ trợ video.
                          </video>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white h-8 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange({ ...data, introVideoUrl: null });
                            if (videoInputRef.current) {
                              videoInputRef.current.value = '';
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-xs">Xóa</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="aspect-video w-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                          <Video className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Upload video giới thiệu</p>
                        <p className="text-xs text-gray-500 mb-1">MP4, MOV, AVI</p>
                        <p className="text-xs text-gray-400">Tối đa 100MB</p>
                        {/* <Button
                          type="button"
                          size="sm"
                          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            videoInputRef.current?.click();
                          }}
                        >
                        </Button> */}
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                    <p className="text-xs text-gray-600">
                      <strong>Lưu ý:</strong> Video giới thiệu giúp học viên hiểu rõ hơn về bạn và phong cách giảng dạy của bạn.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Độ dài video: <strong>Tối đa 1 phút</strong></li>
                      <li>Định dạng: <strong>Video ngang (horizontal/landscape)</strong></li>
                      <li>Giới thiệu bản thân, kinh nghiệm và lý do muốn giảng dạy</li>
                      <li>Quay ở nơi có ánh sáng tốt và âm thanh rõ ràng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
