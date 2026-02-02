"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ArrowLeft, Trash2, Video, FileText, ClipboardList, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderPortal } from "./HeaderPortal";
import { Progress } from "@/components/ui/progress";
import { getHubConnection } from "@/lib/realtime/signalr";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";

import { useUpdateLesson, useDeleteLesson, useActivationLesson } from "@/hooks/useLesson";
import { useMediaVideoLesson } from "@/hooks/useMedia";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";
import { Lesson, LessonType } from "@/lib/api/services/fetchLesson";
import { useRouter } from "next/navigation";

export interface LessonEditorRef {
    hasUnsavedChanges: () => boolean;
    save: () => Promise<void>;
}

interface LessonEditorProps {
    lessonId: string;
    selectedSectionId: string;
    lessons: Lesson[]; // Ideally type this properly
    onBack: () => void;
    onBackToInfo?: () => void;
}

export const LessonEditor = forwardRef<LessonEditorRef, LessonEditorProps>(
    ({ lessonId, selectedSectionId, lessons, onBack, onBackToInfo }, ref) => {
        // Local State
        const [lessonTitleValue, setLessonTitleValue] = useState("");
        const [lessonDescriptionValue, setLessonDescriptionValue] = useState("");
        const [isPreview, setIsPreview] = useState(false);
        const [isPublished, setIsPublished] = useState(false);
        const router = useRouter();

        // Video specific
        const [isDownloadable, setIsDownloadable] = useState(false);
        const [videoOriginalUrl, setVideoOriginalUrl] = useState("");
        const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
        const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
        const [isSaving, setIsSaving] = useState(false);

        // Text specific
        const [textContent, setTextContent] = useState("");

        // Quiz specific
        const [quizId, setQuizId] = useState("");

        const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);

        // Hooks
        const { updateLesson, isPending: isUpdatingLesson } = useUpdateLesson(selectedSectionId);
        const { deleteLesson, isPending: isDeletingLesson } = useDeleteLesson(selectedSectionId);
        const { activationLesson } = useActivationLesson(selectedSectionId);

        const selectedLesson = lessons?.find((l) => l.id === lessonId);

        // Refs
        const titleRef = React.useRef<HTMLTextAreaElement>(null);
        const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
        const videoInputRef = React.useRef<HTMLInputElement>(null);
        const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

        // Track the last successfully saved state to handle stale props delay
        const savedLessonRef = React.useRef<Lesson | null>(null);

        // Upload state
        const [uploadProgress, setUploadProgress] = useState(0);
        const [isFakeLoading, setIsFakeLoading] = useState(false);
        const { uploadThumnailVideoLesson, isUploadingThumnailVideoLesson, uploadVideoLessonAsync, isUploadingVideoLesson } = useMediaVideoLesson();

        const handleThumbnailUpload = async (file: File) => {
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                // alert('Please upload an image file');
                return;
            }

            uploadThumnailVideoLesson(file, {
                onSuccess: (data) => {
                    setVideoThumbnailUrl(formatImageUrl(data.fileUrl) || data.fileUrl);
                },
                onError: (error) => {
                    console.error("Upload thumbnail failed", error);
                }
            });
        };

        const handleVideoUpload = async (file: File) => {
            if (!file) return;

            // Validate file type
            const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
            if (!validTypes.includes(file.type)) {
                // alert('Please upload a valid video file (MP4, MOV, AVI)');
                return;
            }

            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setVideoOriginalUrl(objectUrl);
            setPendingVideoFile(file);
            setUploadProgress(100); // Show as full for preview
            setIsFakeLoading(false);
        };

        // Auto-resize on value change
        useEffect(() => {
            if (titleRef.current) {
                titleRef.current.style.height = 'auto';
                titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
            }
        }, [lessonTitleValue]);

        useEffect(() => {
            if (descriptionRef.current) {
                descriptionRef.current.style.height = 'auto';
                descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
            }
        }, [lessonDescriptionValue]);

        // ... existing local state effects ...
        useEffect(() => {
            if (selectedLesson) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLessonTitleValue(selectedLesson.title);
                setLessonDescriptionValue(selectedLesson.description || "");
                setIsPreview(selectedLesson.isPreview);
                setIsPublished(selectedLesson.isPublished);

                if (selectedLesson.type === "Video") {
                    setIsDownloadable(selectedLesson.isDownloadable || false);
                    setVideoOriginalUrl(selectedLesson.videoOriginalUrl ? (formatImageUrl(selectedLesson.videoOriginalUrl) || selectedLesson.videoOriginalUrl) : "");
                    setVideoThumbnailUrl(selectedLesson.videoThumbnailUrl || "");
                } else if (selectedLesson.type === "Text") {
                    setTextContent(selectedLesson.textContent || "");
                } else if (selectedLesson.type === "Quiz") {
                    setQuizId(selectedLesson.quizId || "");
                }
            }
            setPendingVideoFile(null);
            savedLessonRef.current = null; // Reset saved ref when prop updates
        }, [selectedLesson]);

        const baseLesson = savedLessonRef.current || selectedLesson;

        const hasLessonChanges = baseLesson && (
            lessonTitleValue !== baseLesson.title ||
            lessonDescriptionValue !== (baseLesson.description || "") ||
            isPreview !== baseLesson.isPreview ||
            isPublished !== baseLesson.isPublished ||
            (baseLesson.type === "Video" && (
                isDownloadable !== (baseLesson.isDownloadable || false) ||
                // Compare with potentially formatted state
                videoOriginalUrl !== (savedLessonRef.current ? (baseLesson.videoOriginalUrl || "") : (baseLesson.videoOriginalUrl ? (formatImageUrl(baseLesson.videoOriginalUrl) || baseLesson.videoOriginalUrl) : "")) ||
                videoThumbnailUrl !== (baseLesson.videoThumbnailUrl || "")
            )) ||
            (baseLesson.type === "Text" && (
                textContent !== (baseLesson.textContent || "")
            )) ||
            (baseLesson.type === "Quiz" && (
                quizId !== (baseLesson.quizId || "")
            ))
        );

        const handleLessonSave = async () => {
            if (!selectedLesson || !lessonTitleValue.trim()) {
                return;
            }

            try {
                setIsSaving(true);
                let finalVideoUrl = videoOriginalUrl;

                // Upload video if pending
                if (pendingVideoFile) {
                    // Start fake progress for real upload
                    setIsFakeLoading(true);
                    setUploadProgress(0);
                    const interval = setInterval(() => {
                        setUploadProgress((prev) => {
                            if (prev >= 90) return prev;
                            return prev + Math.floor(Math.random() * 5) + 1;
                        });
                    }, 500);

                    const data = await uploadVideoLessonAsync(pendingVideoFile);
                    finalVideoUrl = data.fileUrl; // Use the raw path returned from server
                    clearInterval(interval);
                    setUploadProgress(95);
                    // Keep isFakeLoading true to show progress bar
                }

                const commonData = {
                    id: lessonId,
                    title: lessonTitleValue,
                    description: lessonDescriptionValue,
                    isPreview,
                    isPublished,
                };

                let specificData = {};
                if (selectedLesson.type === "Video") {
                    specificData = {
                        isDownloadable,
                        videoOriginalUrl: finalVideoUrl, // Use the uploaded URL
                        videoThumbnailUrl,
                    };
                } else if (selectedLesson.type === "Text") {
                    specificData = {
                        content: textContent,
                    };
                } else if (selectedLesson.type === "Quiz") {
                    specificData = {
                        quizId,
                    };
                }

                await updateLesson({
                    lessonId: lessonId,
                    lessonType: selectedLesson.type as LessonType,
                    data: {
                        ...commonData,
                        ...specificData
                    }
                });

                // If we uploaded a video, wait for transcoding success signal
                if (pendingVideoFile) {
                    await new Promise<void>((resolve) => {
                        const connection = getHubConnection();
                        const timeout = setTimeout(() => {
                            resolve();
                        }, 60000); // 1 minute timeout

                        // Define handler with type matching the event
                        const handler = (data: { metadata?: { lessonId?: string } }) => {
                            if (data?.metadata?.lessonId === lessonId) {
                                clearTimeout(timeout);
                                connection.off("TranscodingVideoSuccess", handler);
                                resolve();
                            }
                        };

                        connection.on("TranscodingVideoSuccess", handler);
                    });
                    setUploadProgress(100);
                }

                // Clear pending state on success
                setPendingVideoFile(null);

                // Update saved ref to match current state (Clean State)
                const newVideoUrl = finalVideoUrl ? (formatImageUrl(finalVideoUrl) || finalVideoUrl) : "";
                // Update local state to match the "Clean" formatted URL immediately
                if (selectedLesson.type === "Video") {
                    setVideoOriginalUrl(newVideoUrl);
                }

                savedLessonRef.current = {
                    ...selectedLesson,
                    title: lessonTitleValue,
                    description: lessonDescriptionValue,
                    isPreview,
                    isPublished,
                    ...(selectedLesson.type === "Video" ? {
                        isDownloadable,
                        videoOriginalUrl: newVideoUrl, // Store FORMATTED url to match state
                        videoThumbnailUrl
                    } : {}),
                    ...(selectedLesson.type === "Text" ? {
                        textContent
                    } : {}),
                    ...(selectedLesson.type === "Quiz" ? {
                        quizId
                    } : {})
                };

            } finally {
                setIsSaving(false);
                setIsFakeLoading(false);
                setUploadProgress(0);
            }
        };

        const handleLessonDelete = async () => {
            await deleteLesson(lessonId);
            setIsDeleteLessonDialogOpen(false);
            onBack();
        };

        useImperativeHandle(ref, () => ({
            hasUnsavedChanges: () => !!hasLessonChanges,
            save: async () => {
                if (hasLessonChanges) {
                    await handleLessonSave();
                }
            },
        }));

        const getLessonIcon = (type?: string) => {
            switch (type) {
                case "Video":
                    return <Video className="h-8 w-8 text-gray-500" />;
                case "Quiz":
                    return <ClipboardList className="h-8 w-8 text-gray-500" />;
                default:
                    return <FileText className="h-8 w-8 text-gray-500" />;
            }
        };

        if (!selectedLesson) return null;

        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
                <HeaderPortal>
                    {/* Header with Tab Switcher */}
                    <div className="flex items-center justify-between px-8 py-3 h-14 bg-white w-full border-b">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => router.push('/instructor/courses')}
                                variant="outline"
                                className="w-full rounded-full hover:bg-gray-100 hover:text-gray-900"
                                size="sm"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Thoát
                            </Button>
                        </div>

                        {/* Tab Switcher in Center */}
                        {onBackToInfo && (
                            <div className="absolute left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                                    <button
                                        onClick={onBackToInfo}
                                        className="px-6 py-2 text-sm font-medium rounded-full transition-all text-gray-500 hover:text-gray-900"
                                    >
                                        Thông tin khóa học
                                    </button>
                                    <button
                                        className="px-6 py-2 text-sm font-medium rounded-full transition-all bg-white text-black shadow-sm"
                                    >
                                        Nội dung khóa học
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Update button - only show when there are changes */}
                        <div className="flex items-center gap-2">
                            {/* Delete Button */}
                            <ConfirmDialog
                                open={isDeleteLessonDialogOpen}
                                onOpenChange={setIsDeleteLessonDialogOpen}
                                onConfirm={handleLessonDelete}
                                title="Xóa bài học"
                                description={`Bạn có chắc chắn muốn xóa bài học "${selectedLesson?.title}" không? Hành động này không thể hoàn tác.`}
                                confirmText="Xóa"
                                cancelText="Hủy"
                                variant="destructive"
                                isLoading={isDeletingLesson}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Xóa
                                    </Button>
                                }
                            />

                            <AnimatePresence>
                                {hasLessonChanges && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleLessonSave}
                                            disabled={isUpdatingLesson || isSaving}
                                            className="gap-2 rounded-full"
                                        >
                                            {isUpdatingLesson || isSaving ? "Đang cập nhật..." : "Cập nhật"}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </HeaderPortal>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                    <div className="max-w-4xl mx-auto px-16 py-12">
                        <div className="mb-6 -ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="gap-2 text-gray-500 hover:text-gray-900 pl-2 pr-4 rounded-full hover:bg-gray-100 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại chương
                            </Button>
                        </div>

                        {/* Lesson Content */}
                        <div className="space-y-6">
                            {/* Title - Editable */}
                            <div className="flex items-center gap-3">
                                {getLessonIcon(selectedLesson?.type)}
                                <div className="flex-1 flex items-center gap-2">
                                    <textarea
                                        ref={titleRef}
                                        value={lessonTitleValue}
                                        onChange={(e) => setLessonTitleValue(e.target.value)}
                                        placeholder="Untitled"
                                        className="flex-1 text-4xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden break-words"
                                        rows={1}
                                        style={{
                                            height: 'auto',
                                            minHeight: '3rem'
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                    />
                                    <Button
                                        variant={isPublished ? "destructive" : "default"}
                                        size="sm"
                                        onClick={async () => {
                                            if (lessonId) {
                                                await activationLesson({
                                                    lessonId: lessonId,
                                                    request: {
                                                        isPublished: !isPublished,
                                                    },
                                                });
                                            }
                                        }}
                                        className="rounded-full"
                                    >
                                        {isPublished ? (
                                            <>
                                                Ẩn bài học
                                            </>
                                        ) : (
                                            <>
                                                Hiển thị bài học
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Description - Editable */}
                            <div>
                                <textarea
                                    ref={descriptionRef}
                                    value={lessonDescriptionValue}
                                    onChange={(e) => setLessonDescriptionValue(e.target.value)}
                                    placeholder="Thêm mô tả cho bài học..."
                                    className="w-full text-lg text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden break-words"
                                    rows={2}
                                    style={{
                                        minHeight: '60px'
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = target.scrollHeight + 'px';
                                    }}
                                />
                            </div>

                            {/* Metadata & Settings */}
                            <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/60 space-y-6">
                                {selectedLesson?.type !== "Video" ? (
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center space-x-3">
                                            <Switch id="is-preview" checked={isPreview} onCheckedChange={setIsPreview} className="data-[state=checked]:bg-purple-600" />
                                            <Label htmlFor="is-preview" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                Xem trước
                                                <span className="block text-xs font-normal text-gray-400">Cho phép học viên xem thử</span>
                                            </Label>
                                        </div>

                                        <div className="h-10 w-px bg-slate-200" />

                                        <div className="flex items-center gap-12">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Lượt xem</span>
                                                <span className="text-sm font-medium text-gray-900">{selectedLesson?.totalViews || 0}</span>
                                            </div>

                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Hoàn thành</span>
                                                <span className="text-sm font-medium text-gray-900">{selectedLesson?.totalCompletions || 0}</span>
                                            </div>

                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Cập nhật</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {selectedLesson?.updatedAt ? new Date(selectedLesson.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Toggles Group */}
                                        <div className="flex flex-wrap items-center gap-8">
                                            <div className="flex items-center space-x-3">
                                                <Switch id="is-preview" checked={isPreview} onCheckedChange={setIsPreview} className="data-[state=checked]:bg-purple-600" />
                                                <Label htmlFor="is-preview" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                    Xem trước
                                                    <span className="block text-xs font-normal text-gray-400">Cho phép học viên xem thử</span>
                                                </Label>
                                            </div>

                                            {selectedLesson?.type === "Video" && (
                                                <div className="flex items-center space-x-3">
                                                    <Switch id="is-downloadable" checked={isDownloadable} onCheckedChange={setIsDownloadable} />
                                                    <Label htmlFor="is-downloadable" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                        Cho phép tải về
                                                        <span className="block text-xs font-normal text-gray-400">Video bài học</span>
                                                    </Label>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-slate-200" />

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {selectedLesson?.type === "Video" && (
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Thời lượng</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedLesson?.durationSeconds
                                                            ? `${Math.floor(selectedLesson.durationSeconds / 60)}p ${selectedLesson.durationSeconds % 60}s`
                                                            : '0s'}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Lượt xem</span>
                                                <span className="text-sm font-medium text-gray-900">{selectedLesson?.totalViews || 0}</span>
                                            </div>

                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Hoàn thành</span>
                                                <span className="text-sm font-medium text-gray-900">{selectedLesson?.totalCompletions || 0}</span>
                                            </div>

                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Cập nhật</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {selectedLesson?.updatedAt ? new Date(selectedLesson.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="mt-8 space-y-6">
                                {selectedLesson?.type === "Video" && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Nội dung Video</h3>

                                        {/* Thumbnail Upload Section - Step 1 */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium text-gray-700">Thumbnail Video <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-6">
                                                {/* Left: Upload Area */}
                                                <div className="flex-1">
                                                    <input
                                                        ref={thumbnailInputRef}
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/jpg"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleThumbnailUpload(file);
                                                        }}
                                                    />
                                                    <div
                                                        onClick={() => !isUploadingThumnailVideoLesson && thumbnailInputRef.current?.click()}
                                                        className={`
                                                                border-2 border-dashed rounded-xl p-2 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-full max-w-sm aspect-video
                                                                ${videoThumbnailUrl
                                                                ? "border-purple-200 bg-purple-50/30 hover:bg-purple-50 hover:border-purple-300"
                                                                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                                                            }
                                                            `}
                                                    >
                                                        {isUploadingThumnailVideoLesson ? (
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 animate-pulse">
                                                                    <Upload className="w-5 h-5 text-purple-600" />
                                                                </div>
                                                                <p className="text-sm font-medium text-purple-700">Đang tải ảnh lên...</p>
                                                            </div>
                                                        ) : videoThumbnailUrl ? (
                                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                                                                <SafeImage
                                                                    src={videoThumbnailUrl}
                                                                    alt="Thumbnail preview"
                                                                    className="w-full h-full object-cover"
                                                                    width={500}
                                                                    height={280}
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                                        <Upload className="w-5 h-5 text-purple-600" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center mb-2 mx-auto transition-colors">
                                                                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                                                                        Tải ảnh bìa (Thumbnail)
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Kéo thả hoặc click để chọn ảnh (JPG, PNG)
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Helper Text or Info */}
                                                <div className="w-80 text-sm text-gray-500 space-y-3 pt-2">
                                                    <p>Ảnh bìa giúp bài học của bạn thu hút hơn. Nên sử dụng ảnh có tỷ lệ 16:9.</p>
                                                    <p className="text-xs text-gray-400">Kích thước khuyến nghị: 1280x720.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Video Upload Section - Step 2 (Only visible if Thumbnail exists) */}
                                        {videoThumbnailUrl && (
                                            <div className="space-y-3 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <Label className="text-sm font-medium text-gray-700">Video Bài Học <span className="text-red-500">*</span></Label>

                                                <input
                                                    ref={videoInputRef}
                                                    type="file"
                                                    accept="video/mp4,video/mov,video/avi"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleVideoUpload(file);
                                                    }}
                                                />

                                                {!videoOriginalUrl && !isFakeLoading ? (
                                                    <div
                                                        onClick={() => videoInputRef.current?.click()}
                                                        className="border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer group flex flex-col items-center justify-center text-center"
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
                                                            <Video className="w-8 h-8 text-purple-500 group-hover:text-purple-600 transition-colors" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-lg font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                                                                Tải video bài học
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Hỗ trợ MP4, MOV, AVI. Tối đa 2GB.
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Uploading State or Result
                                                    <div className="space-y-4">
                                                        {(isFakeLoading || isUploadingVideoLesson) ? (
                                                            <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-6 space-y-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                                            <Video className="w-5 h-5 text-purple-600 animate-pulse" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">Đang tải video lên...</p>
                                                                            <p className="text-xs text-gray-500">Vui lòng không tắt trình duyệt</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-bold text-purple-600">{uploadProgress}%</span>
                                                                </div>
                                                                <Progress value={uploadProgress} className="h-2 bg-purple-200" />
                                                            </div>
                                                        ) : (
                                                            // Video Preview
                                                            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video group">
                                                                <video
                                                                    src={videoOriginalUrl}
                                                                    controls
                                                                    className="w-full h-full"
                                                                    poster={videoThumbnailUrl}
                                                                />
                                                                {/* Change Video Button - Overlay */}
                                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="bg-white/90 h-8 px-3 shadow-sm hover:bg-gray-100 hover:text-gray-900"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setVideoOriginalUrl("");
                                                                            if (videoInputRef.current) {
                                                                                videoInputRef.current.value = '';
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Trash2 className="w-4 h-4 text-red-500 mr-1" />
                                                                        <span className="text-xs">Xóa</span>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedLesson?.type === "Text" && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Nội dung</h3>
                                        <textarea
                                            value={textContent}
                                            onChange={(e) => setTextContent(e.target.value)}
                                            placeholder="Nhập nội dung bài học..."
                                            className="w-full min-h-[300px] p-4 text-base text-gray-700 bg-white border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
                                        />
                                    </div>
                                )}

                                {selectedLesson?.type === "Quiz" && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Nội dung Quiz</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="quiz-id">Quiz ID</Label>
                                            <Input
                                                id="quiz-id"
                                                value={quizId}
                                                onChange={(e) => setQuizId(e.target.value)}
                                                placeholder="Nhập Quiz ID"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

LessonEditor.displayName = "LessonEditor";
