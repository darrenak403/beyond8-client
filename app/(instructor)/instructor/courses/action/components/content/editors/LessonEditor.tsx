"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ArrowLeft, Trash2, Video, FileText, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";

import { useUpdateLesson, useDeleteLesson, useActivationLesson } from "@/hooks/useLesson";
import { Lesson, LessonType } from "@/lib/api/services/fetchLesson";

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

        // Video specific
        const [isDownloadable, setIsDownloadable] = useState(false);
        const [videoOriginalUrl, setVideoOriginalUrl] = useState("");
        const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");

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
                    setVideoOriginalUrl(selectedLesson.videoOriginalUrl || "");
                    setVideoThumbnailUrl(selectedLesson.videoThumbnailUrl || "");
                } else if (selectedLesson.type === "Text") {
                    setTextContent(selectedLesson.textContent || "");
                } else if (selectedLesson.type === "Quiz") {
                    setQuizId(selectedLesson.quizId || "");
                }
            }
        }, [selectedLesson]);

        const hasLessonChanges = selectedLesson && (
            lessonTitleValue !== selectedLesson.title ||
            lessonDescriptionValue !== (selectedLesson.description || "") ||
            isPreview !== selectedLesson.isPreview ||
            isPublished !== selectedLesson.isPublished ||
            (selectedLesson.type === "Video" && (
                isDownloadable !== (selectedLesson.isDownloadable || false) ||
                videoOriginalUrl !== (selectedLesson.videoOriginalUrl || "") ||
                videoThumbnailUrl !== (selectedLesson.videoThumbnailUrl || "")
            )) ||
            (selectedLesson.type === "Text" && (
                textContent !== (selectedLesson.textContent || "")
            )) ||
            (selectedLesson.type === "Quiz" && (
                quizId !== (selectedLesson.quizId || "")
            ))
        );

        const handleLessonSave = async () => {
            if (!selectedLesson || !lessonTitleValue.trim()) {
                return;
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
                    videoOriginalUrl,
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
                    return <Video className="h-5 w-5 text-blue-500" />;
                case "Quiz":
                    return <ClipboardList className="h-5 w-5 text-green-500" />;
                default:
                    return <FileText className="h-5 w-5 text-gray-500" />;
            }
        };

        if (!selectedLesson) return null;

        return (
            <div className="flex-1 flex flex-col bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden relative">
                {/* Header with Tab Switcher */}
                <div className="flex items-center justify-between px-16 py-6 border-b bg-white relative">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onBack}
                            className="gap-2 rounded-full hover:bg-gray-100 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại chương
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
                                        disabled={isUpdatingLesson}
                                        className="gap-2 rounded-full"
                                    >
                                        {isUpdatingLesson ? "Đang cập nhật..." : "Cập nhật"}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-16 py-12">
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

                                        <div className="space-y-2">
                                            <Label htmlFor="video-url">URL Video Gốc</Label>
                                            <Input
                                                id="video-url"
                                                value={videoOriginalUrl}
                                                onChange={(e) => setVideoOriginalUrl(e.target.value)}
                                                placeholder="https://example.com/video.mp4"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="video-thumbnail">URL Thumbnail</Label>
                                            <Input
                                                id="video-thumbnail"
                                                value={videoThumbnailUrl}
                                                onChange={(e) => setVideoThumbnailUrl(e.target.value)}
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                        </div>

                                        {selectedLesson.videoOriginalUrl && (
                                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center p-6 border-2 border-dashed border-gray-300">
                                                <div className="text-center">
                                                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-sm text-gray-600 font-medium mb-1">Preview Video Gốc</p>
                                                    <a
                                                        href={selectedLesson.videoOriginalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline break-all"
                                                    >
                                                        {selectedLesson.videoOriginalUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Read-only technical fields */}
                                        {selectedLesson.hlsVariants && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">HLS Variants (Read-only)</p>
                                                <div className="p-4 bg-gray-50 rounded-lg border">
                                                    <code className="text-xs text-gray-600 break-all">{selectedLesson.hlsVariants}</code>
                                                </div>
                                            </div>
                                        )}

                                        {selectedLesson.videoQualities && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Video Qualities</p>
                                                <div className="p-4 bg-gray-50 rounded-lg border">
                                                    <code className="text-xs text-gray-600">{selectedLesson.videoQualities}</code>
                                                </div>
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

                {/* Delete Lesson Button - Bottom Left Fixed */}
                <div className="absolute bottom-8 left-16 z-10">
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
                                variant="outline"
                                size="sm"
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Xóa bài học
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }
);

LessonEditor.displayName = "LessonEditor";
