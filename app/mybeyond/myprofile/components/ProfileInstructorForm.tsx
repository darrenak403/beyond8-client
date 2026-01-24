"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Globe,
  Facebook,
  Linkedin,
  Plus,
  Trash2,
  School,
  Award,
  BookOpen,
  Calendar,
  Building,
  Edit3,
  Check,
  Video,
  Upload,
  Medal,
} from "lucide-react";
import { useGetInstructorProfile, useUpdateMyRegistration } from "@/hooks/useInstructorRegistration";
import type {
  InstructorEducation,
  InstructorWorkExperience,
  Certificates,
  InstructorRegistrationRequest,
  UpdateRegistrationRequest,
} from "@/lib/api/services/fetchInstructorRegistration";
import { Switch } from "@/components/ui/switch";
import { useUnHiddenProfile } from "@/hooks/useInstructorRegistration";
import { useMedia } from "@/hooks/useMedia";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";

export default function ProfileInstructorForm() {
  const { instructorProfile, isLoading, error } = useGetInstructorProfile();
  const { updateMyRegistration, isUpdating } = useUpdateMyRegistration();
  const { unhideProfile, isUnhiding } = useUnHiddenProfile();
  const [editingEducation, setEditingEducation] = useState<number | null>(null);
  const [editingWork, setEditingWork] = useState<number | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<number | null>(null);
  // Check if profile is hidden
  const isHidden = instructorProfile?.verificationStatus === "Hidden";
  const [educationList, setEducationList] = useState<InstructorEducation[]>([]);
  const [workList, setWorkList] = useState<InstructorWorkExperience[]>([]);
  const [certificateList, setCertificateList] = useState<Certificates[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { uploadCertificateAsync, isUploadingCertificate, uploadIntroVideoAsync } = useMedia();

  // Memoize form data from API
  const initialFormData = useMemo(() => {
    if (!instructorProfile) {
      return {
        bio: "",
        headline: "",
        expertise: "",
        education: "",
        workExperience: "",
        socialLinks: {
          facebook: "",
          linkedIn: "",
          website: "",
        },
        teachingLanguages: "",
        certificates: "",
      };
    }

    return {
      bio: instructorProfile.bio || "",
      headline: instructorProfile.headline || "",
      expertise: instructorProfile.expertiseAreas.join(", ") || "",
      education:
        instructorProfile.education
          .map((edu) => `${edu.degree} - ${edu.school} (${edu.start}-${edu.end})`)
          .join("\n") || "",
      workExperience:
        instructorProfile.workExperience
          .map((work) => {
            const toDate = work.isCurrentJob
              ? "Hiện tại"
              : work.to
                ? new Date(work.to).getFullYear()
                : "";
            const fromDate = work.from ? new Date(work.from).getFullYear() : "";
            return `${work.role} tại ${work.company} (${fromDate} - ${toDate})${work.description ? "\n" + work.description : ""}`;
          })
          .join("\n\n") || "",
      socialLinks: {
        facebook: instructorProfile.socialLinks.facebook || "",
        linkedIn: instructorProfile.socialLinks.linkedIn || "",
        website: instructorProfile.socialLinks.website || "",
      },
      teachingLanguages: instructorProfile.teachingLanguages.join(", ") || "",
      certificates:
        instructorProfile.certificates
          .map((cert) => `${cert.name} - ${cert.issuer} (${cert.year})`)
          .join("\n") || "",
    };
  }, [instructorProfile]);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (instructorProfile) {
      // eslint-disable-next-line
      setFormData(initialFormData);
      setEducationList(instructorProfile.education || []);
      setWorkList(instructorProfile.workExperience || []);
      setCertificateList(instructorProfile.certificates || []);
      setIntroVideoUrl(instructorProfile.introVideoUrl || null);
    }
  }, [initialFormData, instructorProfile]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {

    const data: UpdateRegistrationRequest = {
      bio: formData.bio,
      headline: formData.headline,
      socialLinks: formData.socialLinks,
      education: educationList,
      workExperience: workList,
      certificates: certificateList,
      expertiseAreas: formData.expertise ? formData.expertise.split(',').map(s => s.trim()).filter(Boolean) : [],
      teachingLanguages: formData.teachingLanguages ? formData.teachingLanguages.split(',').map(s => s.trim()).filter(Boolean) : [],
      introVideoUrl: introVideoUrl,
    };

    updateMyRegistration(data);
  };

  const handleRequestReopen = async () => {
    if (!instructorProfile) return;
    try {
      await unhideProfile(instructorProfile.id);
    } catch (error) {
      console.error("Error requesting profile reopen:", error);
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: InstructorEducation = {
      school: "",
      degree: "",
      fieldOfStudy: "",
      start: new Date().getFullYear(),
      end: new Date().getFullYear(),
    };
    setEducationList([...educationList, newEdu]);
    setEditingEducation(educationList.length);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
    if (editingEducation === index) setEditingEducation(null);
  };

  const handleChangeEducation = (
    index: number,
    field: keyof InstructorEducation,
    value: string | number
  ) => {
    const newList = [...educationList];
    newList[index] = { ...newList[index], [field]: value };
    setEducationList(newList);
  };

  // Work Experience handlers
  const handleAddWork = () => {
    const newWork: InstructorWorkExperience = {
      company: "",
      role: "",
      from: "",
      to: "",
      isCurrentJob: false,
      description: null,
    };
    setWorkList([...workList, newWork]);
    setEditingWork(workList.length);
  };

  const handleRemoveWork = (index: number) => {
    setWorkList(workList.filter((_, i) => i !== index));
    if (editingWork === index) setEditingWork(null);
  };

  const handleChangeWork = (
    index: number,
    field: keyof InstructorWorkExperience,
    value: string | boolean
  ) => {
    const newList = [...workList];
    newList[index] = { ...newList[index], [field]: value };
    setWorkList(newList);
  };

  // Certificate handlers
  const handleAddCertificate = () => {
    const newCert: Certificates = {
      name: "",
      url: "",
      issuer: "",
      year: new Date().getFullYear(),
    };
    setCertificateList([...certificateList, newCert]);
    setEditingCertificate(certificateList.length);
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificateList(certificateList.filter((_, i) => i !== index));
    if (editingCertificate === index) setEditingCertificate(null);
  };

  const handleChangeCertificate = (
    index: number,
    field: keyof Certificates,
    value: string | number
  ) => {
    const newList = [...certificateList];
    newList[index] = { ...newList[index], [field]: value };
    setCertificateList(newList);
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
      handleChangeCertificate(index, 'url', uploadedFile.fileUrl);
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
      setIntroVideoUrl(formatImageUrl(uploadedFile.fileUrl) || uploadedFile.fileUrl);
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Card 1: Basic Info Skeleton */}
        <Card className="flex flex-col gap-2">
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gray-200 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Education Skeleton */}
        <Card>
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gray-200 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              Học vấn
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>

        {/* Card 3: Work Experience Skeleton */}
        <Card>
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              Kinh nghiệm làm việc
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>

        {/* Card 4: Teaching Languages & Certificates */}
        <Card>
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gray-200 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              Ngôn ngữ giảng dạy & Chứng chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Social Links Skeleton */}
        <Card>
          <CardHeader className="bg-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              Liên kết mạng xã hội
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Buttons Skeleton */}
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error || !instructorProfile) {
    return (
      <Card className="border-2 border-purple-100 rounded-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full">
              <GraduationCap className="w-12 h-12 text-purple-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-gray-900 text-lg">Chưa có hồ sơ giảng viên</p>
              <p className="text-sm text-gray-500 max-w-md">
                Bạn chưa đăng ký trở thành giảng viên. Đăng ký ngay để bắt đầu chia sẻ kiến thức và
                kiếm thêm thu nhập.
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/instructor-registration")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all mt-4 cursor-pointer"
              size="lg"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Đăng ký trở thành giảng viên
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isHidden ? (
        <div className="flex flex-row items-center justify-between gap-5 p-3 bg-white border-2 border-red-500 rounded-3xl">
          <p className="flex-1 text-sm text-red-700 font-medium text-center">
            Hồ sơ của bạn đang ở trạng thái ẩn. Vui lòng yêu cầu mở lại để chỉnh sửa.
          </p>

          <Button
            type="button"
            onClick={handleRequestReopen}
            className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 cursor-pointer"
          >
            {isUnhiding ? "Đang xử lý..." : "Yêu cầu mở lại"}
          </Button>
        </div>
      ) : instructorProfile?.verificationStatus === "RequestUpdate" ? (
        <div className="flex flex-row items-center justify-between gap-5 p-3 bg-white border-2 border-yellow-500 rounded-3xl">
          <p className="flex-1 text-sm text-yellow-700 font-medium text-center">
            Hồ sơ của bạn đang ở trạng thái yêu cầu cập nhật. Vui lòng chỉnh sửa.
          </p>
        </div>
      ) : instructorProfile?.verificationStatus === "Pending" ? (
        <div className="flex flex-row items-center justify-between gap-5 p-3 bg-white border-2 border-orange-500 rounded-3xl">
          <p className="flex-1 text-sm text-orange-700 font-medium text-center">
            Hồ sơ của bạn đang ở trạng thái chờ duyệt.
          </p>
        </div>
      ) : instructorProfile?.verificationStatus === "Verified" ? (
        <div className="flex flex-row items-center justify-between gap-5 p-3 bg-white border-2 border-green-500 rounded-3xl">
          <p className="flex-1 text-sm text-green-700 font-medium text-center">
            Hồ sơ của bạn đã được duyệt.
          </p>
        </div>
      ) : instructorProfile?.verificationStatus === "Recovering" && (
        <div className="flex flex-row items-center justify-between gap-5 p-3 bg-white border-2 border-blue-500 rounded-3xl">
          <p className="flex-1 text-sm text-blue-700 font-medium text-center">
            Hồ sơ của bạn đang ở trạng thái đang chờ khôi phục.
          </p>
        </div>
      )}
      {/* Card 1: Headline, Bio, Expertise */}
      <Card
        className={`flex flex-col gap-2 border-2 transition-colors rounded-4xl ${isHidden ? "border-gray-300 bg-gray-50" : "border-purple-100 hover:border-purple-300"}`}
      >
        <CardHeader
          className={`rounded-t-4xl ${isHidden ? "bg-gray-200" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`p-2 bg-white rounded-lg shadow-sm ${isHidden ? "opacity-50" : ""}`}>
              <User className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`} />
            </div>
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="headline" className="text-sm font-medium">
              Tiêu đề chuyên môn
            </Label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="VD: Senior Full-stack Developer & Instructor"
              disabled={isHidden}
              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Giới thiệu
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              placeholder="Giới thiệu ngắn gọn về bản thân và kinh nghiệm..."
              disabled={isHidden}
              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="expertise" className="text-sm font-medium">
              Lĩnh vực chuyên môn
            </Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => handleChange("expertise", e.target.value)}
              placeholder="VD: Web Development, React, Node.js"
              disabled={isHidden}
              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
            {formData.expertise && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertise.split(",").map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`${isHidden ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"} px-3 py-1 shadow-sm`}
                  >
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Education */}
      <Card
        className={`border-2 transition-colors rounded-4xl ${isHidden ? "border-gray-300 bg-gray-50" : "border-purple-100 hover:border-purple-300"}`}
      >
        <CardHeader
          className={`rounded-t-4xl ${isHidden ? "bg-gray-200" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 bg-white rounded-lg shadow-sm ${isHidden ? "opacity-50" : ""}`}>
                <GraduationCap
                  className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`}
                />
              </div>
              Học vấn
            </div>
            <Button
              type="button"
              onClick={handleAddEducation}
              size="icon"
              disabled={isHidden}
              className={`border h-8 w-8 ${isHidden ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed" : "border-purple-300 bg text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 hover:bg-purple-50 hover:text-purple-700 shadow-sm"}`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {educationList.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {educationList.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    {editingEducation === index ? (
                      <div className="p-4 bg-white rounded-xl border-2 border-purple-300 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-50">
                              <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800">Học vấn #{index + 1}</h4>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isHidden}
                            className={`${isHidden ? "cursor-not-allowed opacity-50" : "hover:bg-red-50 hover:text-red-600"}`}
                            onClick={() => handleRemoveEducation(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <School className="w-4 h-4 text-purple-600" />
                              Tên trường <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={edu.school}
                              onChange={(e) =>
                                handleChangeEducation(index, "school", e.target.value)
                              }
                              placeholder="VD: Đại học Bách Khoa Hà Nội"
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-purple-600" />
                              Bằng cấp <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                handleChangeEducation(index, "degree", e.target.value)
                              }
                              placeholder="VD: Cử nhân Khoa học Máy tính"
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                              Chuyên ngành <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={edu.fieldOfStudy}
                              onChange={(e) =>
                                handleChangeEducation(index, "fieldOfStudy", e.target.value)
                              }
                              placeholder="VD: Khoa học Máy tính"
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                Năm bắt đầu
                              </label>
                              <Input
                                type="number"
                                value={edu.start}
                                onChange={(e) =>
                                  handleChangeEducation(
                                    index,
                                    "start",
                                    parseInt(e.target.value) || new Date().getFullYear()
                                  )
                                }
                                min="1950"
                                max={new Date().getFullYear() + 10}
                                disabled={isHidden}
                                className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                Năm kết thúc
                              </label>
                              <Input
                                type="number"
                                value={edu.end}
                                onChange={(e) =>
                                  handleChangeEducation(
                                    index,
                                    "end",
                                    parseInt(e.target.value) || new Date().getFullYear()
                                  )
                                }
                                min="1950"
                                max={new Date().getFullYear() + 10}
                                disabled={isHidden}
                                className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={() => setEditingEducation(null)}
                          disabled={isHidden}
                          className={`w-full rounded-3xl ${isHidden ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"}`}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Lưu thông tin
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-xl border border-purple-100 transition-all group ${isHidden ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-purple-300"}`}
                        onClick={() => !isHidden && setEditingEducation(index)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">
                                {edu.start} - {edu.end}
                              </span>
                              <Edit3 className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{edu.school}</p>
                          <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có thông tin học vấn</p>
          )}
        </CardContent>
      </Card>

      {/* Card 3: Work Experience */}
      <Card
        className={`border-2 transition-colors rounded-4xl ${isHidden ? "border-gray-300 bg-gray-50" : "border-purple-100 hover:border-purple-300"}`}
      >
        <CardHeader
          className={`rounded-t-4xl ${isHidden ? "bg-gray-200" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 bg-white rounded-lg shadow-sm ${isHidden ? "opacity-50" : ""}`}>
                <Briefcase
                  className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`}
                />
              </div>
              Kinh nghiệm làm việc
            </div>
            <Button
              type="button"
              onClick={handleAddWork}
              size="icon"
              disabled={isHidden}
              className={`border h-8 w-8 ${isHidden ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed" : "border-purple-300 bg text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 hover:bg-purple-50 hover:text-purple-700 shadow-sm"}`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {workList.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {workList.map((work, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    {editingWork === index ? (
                      <div className="p-4 bg-white rounded-xl border-2 border-purple-300 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-50">
                              <Briefcase className="w-5 h-5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800">
                              Kinh nghiệm #{index + 1}
                            </h4>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isHidden}
                            className={`${isHidden ? "cursor-not-allowed opacity-50" : "hover:bg-red-50 hover:text-red-600"}`}
                            onClick={() => handleRemoveWork(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-purple-600" />
                              Công ty <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={work.company}
                              onChange={(e) => handleChangeWork(index, "company", e.target.value)}
                              placeholder="VD: Google Vietnam"
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <Briefcase className="w-4 h-4 text-purple-600" />
                              Vị trí <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={work.role}
                              onChange={(e) => handleChangeWork(index, "role", e.target.value)}
                              placeholder="VD: Senior Software Engineer"
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                Từ ngày
                              </label>
                              <Input
                                type="date"
                                value={work.from}
                                onChange={(e) => handleChangeWork(index, "from", e.target.value)}
                                disabled={isHidden}
                                className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                Đến ngày
                              </label>
                              <Input
                                type="date"
                                value={work.to || ""}
                                onChange={(e) => handleChangeWork(index, "to", e.target.value)}
                                disabled={work.isCurrentJob || isHidden}
                                className={`border-2 rounded-xl focus:outline-none focus:ring-2 disabled:opacity-50 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                            <label className="text-sm font-semibold text-gray-700">
                              Đang làm việc tại đây
                            </label>
                            <Switch
                              checked={work.isCurrentJob}
                              disabled={isHidden}
                              onCheckedChange={(checked) => {
                                const newList = [...workList];
                                newList[index] = {
                                  ...newList[index],
                                  isCurrentJob: checked,
                                  to: checked
                                    ? new Date().toISOString().split("T")[0]
                                    : newList[index].to,
                                };
                                setWorkList(newList);
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                              Mô tả công việc
                            </label>
                            <Textarea
                              value={work.description || ""}
                              onChange={(e) =>
                                handleChangeWork(index, "description", e.target.value)
                              }
                              placeholder="Mô tả ngắn gọn về công việc và trách nhiệm..."
                              rows={3}
                              disabled={isHidden}
                              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={() => setEditingWork(null)}
                          disabled={isHidden}
                          className={`w-full rounded-3xl ${isHidden ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"}`}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Lưu thông tin
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-xl border border-purple-100 transition-all group ${isHidden ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-purple-300"}`}
                        onClick={() => !isHidden && setEditingWork(index)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{work.role}</h4>
                            <div className="flex items-center gap-2">
                              {work.isCurrentJob && (
                                <Badge className="border border-green-500 bg-white text-green-500 hover:bg-white hover:text-green-500 text-xs">
                                  Hiện tại
                                </Badge>
                              )}
                              <Edit3 className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{work.company}</p>
                          <p className="text-sm text-gray-600">
                            {work.from
                              ? new Date(work.from).toLocaleDateString("vi-VN", {
                                month: "long",
                                year: "numeric",
                              })
                              : ""}{" "}
                            -{" "}
                            {work.isCurrentJob
                              ? "Hiện tại"
                              : work.to
                                ? new Date(work.to).toLocaleDateString("vi-VN", {
                                  month: "long",
                                  year: "numeric",
                                })
                                : ""}
                          </p>
                          {work.description && (
                            <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-purple-100">
                              {work.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Chưa có thông tin kinh nghiệm làm việc
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 4: Teaching Languages & Certificates */}
      <Card
        className={`border-2 transition-colors rounded-4xl ${isHidden ? "border-gray-300 bg-gray-50" : "border-purple-100 hover:border-purple-300"}`}
      >
        <CardHeader
          className={`rounded-t-4xl ${isHidden ? "bg-gray-200" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`p-2 bg-white rounded-lg shadow-sm ${isHidden ? "opacity-50" : ""}`}>
              <GraduationCap
                className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`}
              />
            </div>
            Ngôn ngữ giảng dạy & Chứng chỉ
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="teachingLanguages" className="text-sm font-medium">
              Ngôn ngữ giảng dạy
            </Label>
            <Input
              id="teachingLanguages"
              value={formData.teachingLanguages}
              onChange={(e) => handleChange("teachingLanguages", e.target.value)}
              placeholder="VD: Tiếng Việt, English"
              disabled={isHidden}
              className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
            {formData.teachingLanguages && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.teachingLanguages.split(",").map((lang, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`${isHidden ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"} px-3 py-1 shadow-sm`}
                  >
                    {lang.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="certificates" className="text-sm font-medium">
                Chứng chỉ
              </Label>
              <Button
                type="button"
                onClick={handleAddCertificate}
                size="icon"
                disabled={isHidden}
                className={`border h-8 w-8 ${isHidden ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed" : "border-purple-300 bg text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 hover:bg-purple-50 hover:text-purple-700 shadow-sm"}`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {certificateList.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {certificateList.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      {editingCertificate === index ? (
                        <div className="p-4 bg-white rounded-xl border-2 border-purple-300 space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-purple-50">
                                <Award className="w-5 h-5 text-purple-600" />
                              </div>
                              <h4 className="font-semibold text-gray-800">
                                Chứng chỉ #{index + 1}
                              </h4>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isHidden}
                              className={`${isHidden ? "cursor-not-allowed opacity-50" : "hover:bg-red-50 hover:text-red-600"}`}
                              onClick={() => handleRemoveCertificate(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Two Column Layout */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column - Image Upload */}
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Award className="w-4 h-4 text-purple-600" />
                                Ảnh chứng chỉ <span className="text-red-500">*</span>
                              </label>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && editingCertificate !== null) {
                                    handleFileSelect(editingCertificate, file);
                                  }
                                }}
                              />
                              <div 
                                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isHidden ? "border-gray-300 bg-gray-100 cursor-not-allowed" : "border-purple-300 hover:border-purple-400 cursor-pointer bg-purple-50/50"}`}
                                onClick={() => !isHidden && !isUploadingCertificate && fileInputRef.current?.click()}
                              >
                                {uploadingIndex === index ? (
                                  <div className="aspect-[4/3] w-full flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2 animate-pulse">
                                      <Upload className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-700">Đang tải lên...</p>
                                  </div>
                                ) : cert.url ? (
                                  <div className="relative aspect-[4/3] w-full">
                                    <SafeImage
                                      src={formatImageUrl(cert.url) || cert.url}
                                      alt="Certificate preview"
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={isHidden}
                                      className="absolute top-2 right-2 bg-white/90 hover:bg-white h-7 w-7 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isHidden) {
                                          handleChangeCertificate(index, 'url', '');
                                          if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                          }
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
                              <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-purple-600" />
                                  Tên chứng chỉ <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  value={cert.name}
                                  onChange={(e) =>
                                    handleChangeCertificate(index, "name", e.target.value)
                                  }
                                  placeholder="VD: AWS Certified Solutions Architect"
                                  disabled={isHidden}
                                  className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                                />
                              </div>

                              <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                  <Building className="w-4 h-4 text-purple-600" />
                                  Tổ chức cấp <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  value={cert.issuer}
                                  onChange={(e) =>
                                    handleChangeCertificate(index, "issuer", e.target.value)
                                  }
                                  placeholder="VD: Amazon Web Services"
                                  disabled={isHidden}
                                  className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                                />
                              </div>

                              <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-purple-600" />
                                  Năm cấp
                                </label>
                                <Input
                                  type="number"
                                  value={cert.year}
                                  onChange={(e) =>
                                    handleChangeCertificate(
                                      index,
                                      "year",
                                      parseInt(e.target.value) || new Date().getFullYear()
                                    )
                                  }
                                  min="1950"
                                  max={new Date().getFullYear()}
                                  disabled={isHidden}
                                  className={`border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
                                />
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={() => setEditingCertificate(null)}
                            disabled={isHidden}
                            className={`w-full rounded-3xl ${isHidden ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"}`}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Lưu thông tin
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`p-4 rounded-xl border border-purple-100 transition-all group ${isHidden ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-purple-300"}`}
                          onClick={() => !isHidden && setEditingCertificate(index)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">
                                  {cert.year}
                                </span>
                                <Edit3 className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-600 hover:text-purple-700 underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Xem chứng chỉ
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
                Chưa có chứng chỉ
              </p>
            )}
          </div>

          {/* Video Introduction Section */}
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center gap-2 pb-3 border-b">
              <div className={`p-2 rounded-lg ${isHidden ? "bg-gray-200" : "bg-purple-50"}`}>
                <Video className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`} />
              </div>
              <h3 className="font-semibold text-gray-800">Video giới thiệu</h3>
            </div>

            <div className="space-y-3 mt-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Video className={`w-4 h-4 ${isHidden ? "text-gray-500" : "text-purple-600"}`} />
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
                  if (file && !isHidden) {
                    handleVideoFileSelect(file);
                  }
                }}
              />
              
              {/* Video Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-lg transition-colors ${
                  isHidden 
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed" 
                    : "border-purple-300 hover:border-purple-400 cursor-pointer bg-purple-50/50"
                }`}
                onClick={() => !uploadingVideo && !introVideoUrl && !isHidden && videoInputRef.current?.click()}
              >
                {uploadingVideo ? (
                  <div className="aspect-video w-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 animate-pulse">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Đang tải lên video...</p>
                  </div>
                ) : introVideoUrl ? (
                  <div className="relative">
                    <div className="aspect-video w-full bg-gray-900 rounded-lg flex items-center justify-center">
                      <video
                        src={introVideoUrl}
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
                      disabled={isHidden}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white h-8 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isHidden) {
                          setIntroVideoUrl(null);
                          if (videoInputRef.current) {
                            videoInputRef.current.value = '';
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-xs">Xóa</span>
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video w-full flex flex-col items-center justify-center text-center p-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      isHidden ? "bg-gray-200" : "bg-purple-100"
                    }`}>
                      <Video className={`w-8 h-8 ${isHidden ? "text-gray-500" : "text-purple-600"}`} />
                    </div>
                    <p className={`text-sm font-medium mb-2 ${isHidden ? "text-gray-500" : "text-gray-700"}`}>
                      Upload video giới thiệu
                    </p>
                    <p className={`text-xs mb-1 ${isHidden ? "text-gray-400" : "text-gray-500"}`}>MP4, MOV, AVI</p>
                    <p className={`text-xs ${isHidden ? "text-gray-400" : "text-gray-400"}`}>Tối đa 100MB</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className={`rounded-lg p-4 space-y-2 ${isHidden ? "bg-gray-100" : "bg-purple-50"}`}>
                <p className={`text-xs ${isHidden ? "text-gray-500" : "text-gray-600"}`}>
                  <strong>Lưu ý:</strong> Video giới thiệu giúp học viên hiểu rõ hơn về bạn và phong cách giảng dạy của bạn.
                </p>
                <ul className={`text-xs space-y-1 ml-4 list-disc ${isHidden ? "text-gray-500" : "text-gray-600"}`}>
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

      {/* Card 5: Social Links */}
      <Card
        className={`border-2 transition-colors rounded-4xl ${isHidden ? "border-gray-300 bg-gray-50" : "border-purple-100 hover:border-purple-300"}`}
      >
        <CardHeader
          className={`rounded-t-4xl ${isHidden ? "bg-gray-200" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`p-2 bg-white rounded-lg shadow-sm ${isHidden ? "opacity-50" : ""}`}>
              <Globe className={`w-5 h-5 ${isHidden ? "text-gray-500" : "text-purple-600"}`} />
            </div>
            Liên kết mạng xã hội
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          <div className="relative">
            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Facebook URL"
              value={formData.socialLinks.facebook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                })
              }
              disabled={isHidden}
              className={`pl-10 border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
          </div>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedIn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedIn: e.target.value },
                })
              }
              disabled={isHidden}
              className={`pl-10 border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Website URL"
              value={formData.socialLinks.website}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, website: e.target.value },
                })
              }
              disabled={isHidden}
              className={`pl-10 border-2 rounded-xl focus:outline-none focus:ring-2 ${isHidden ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200 focus:ring-purple-500 focus:border-transparent"}`}
            />
          </div>
        </CardContent>
      </Card>
      {/* Header with Save Button */}
      <div className="flex justify-end gap-3">
        {(instructorProfile?.verificationStatus === "RequestUpdate" || instructorProfile?.verificationStatus === "Verified") && (
          <>
            {/* <Button
              type="button"
              variant="outline"
              className="border-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 rounded-2xl"
            >
              Hủy thay đổi
            </Button> */}
            <Button type="button" size="sm" onClick={handleSubmit} className="rounded-2xl">
              {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
