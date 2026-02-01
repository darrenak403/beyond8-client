"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, Video, FileText, ClipboardList, ChevronRight, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { HeaderPortal } from "./HeaderPortal";

import { useUpdateSection, useDeleteSection } from "@/hooks/useSection";
import { useCreateLesson, useGetLessonBySectionId } from "@/hooks/useLesson";
import { LessonType } from "@/lib/api/services/fetchLesson";
import { useRouter } from "next/navigation";

export interface SectionEditorRef {
    hasUnsavedChanges: () => boolean;
    save: () => Promise<void>;
}

interface SectionEditorProps {
    courseId: string;
    section: { id: string; orderIndex: number; title: string; description?: string };
    onBackToInfo?: () => void;
    onLessonSelect?: (lessonId: string) => void;
    onDeleted?: () => void;
}

export const SectionEditor = forwardRef<SectionEditorRef, SectionEditorProps>(
    ({ courseId, section, onBackToInfo, onLessonSelect, onDeleted }, ref) => {
        const [titleValue, setTitleValue] = useState(section.title);
        const [descriptionValue, setDescriptionValue] = useState(section.description || "");
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const router = useRouter();

        const { updateSection, isPending: isUpdating } = useUpdateSection(courseId);
        const { deleteSection, isPending: isDeleting } = useDeleteSection(courseId);
        const { createLesson } = useCreateLesson();
        const { lessons } = useGetLessonBySectionId(section.id);

        useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitleValue(section.title);
            setDescriptionValue(section.description || "");
        }, [section]);

        const hasChanges =
            titleValue !== section.title ||
            descriptionValue !== (section.description || "");

        const handleSave = async () => {
            if (!titleValue.trim()) {
                setTitleValue(section.title);
                setDescriptionValue(section.description || "");
                return;
            }
            await updateSection({
                sectionId: section.id,
                data: { title: titleValue, description: descriptionValue },
            });
        };

        const handleDelete = async () => {
            await deleteSection(section.id);
            setIsDeleteDialogOpen(false);
            onDeleted?.();
        };

        const handleCreateLesson = async (type: "Video" | "Text" | "Quiz") => {
            const baseData = {
                sectionId: section.id,
                title: "Bài học mới",
                description: "",
                isPreview: false,
            };

            if (type === "Video") {
                await createLesson({
                    type: LessonType.Video,
                    ...baseData,
                    videoOriginalUrl: "URL",
                    videoThumbnailUrl: "",
                    durationSeconds: 1,
                    isDownloadable: false,
                });
            } else if (type === "Text") {
                await createLesson({
                    type: LessonType.Text,
                    ...baseData,
                    content: "Bài học mới",
                });
            } else if (type === "Quiz") {
                await createLesson({
                    type: LessonType.Quiz,
                    ...baseData,
                    quizId: "",
                });
            }
        };

        useImperativeHandle(ref, () => ({
            hasUnsavedChanges: () => hasChanges,
            save: async () => {
                if (hasChanges) {
                    await handleSave();
                }
            },
        }));

        const getLessonIcon = (type?: string) => {
            switch (type) {
                case "Video":
                    return <Video className="h-5 w-5 text-gray-500" />;
                case "Quiz":
                    return <ClipboardList className="h-5 w-5 text-gray-500" />;
                default:
                    return <FileText className="h-5 w-5 text-gray-500" />;
            }
        };

        // Add refs
        const titleRef = React.useRef<HTMLTextAreaElement>(null);
        const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

        // Auto-resize on value change
        useEffect(() => {
            if (titleRef.current) {
                titleRef.current.style.height = 'auto';
                titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
            }
        }, [titleValue]);

        useEffect(() => {
            if (descriptionRef.current) {
                descriptionRef.current.style.height = 'auto';
                descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
            }
        }, [descriptionValue]);

        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
                <HeaderPortal>
                    {/* Header with Tab Switcher */}
                    <div className="flex items-center justify-between px-8 py-3 h-14 bg-white w-full">
                        <div className="flex items-center gap-4">
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
                                    <button className="px-6 py-2 text-sm font-medium rounded-full transition-all bg-white text-black shadow-sm">
                                        Nội dung khóa học
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Update button - only show when there are changes */}
                        <div className="flex items-center gap-2">
                            {/* Delete Button */}
                            <ConfirmDialog
                                open={isDeleteDialogOpen}
                                onOpenChange={setIsDeleteDialogOpen}
                                onConfirm={handleDelete}
                                title="Xóa chương"
                                description={`Bạn có chắc chắn muốn xóa chương "${section.title}" không? Hành động này không thể hoàn tác.`}
                                confirmText="Xóa"
                                cancelText="Hủy"
                                variant="destructive"
                                isLoading={isDeleting}
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
                                {hasChanges && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={isUpdating}
                                            className="gap-2 rounded-full"
                                        >
                                            {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
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
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Title - Notion-like editable */}
                            <div className="mb-6">
                                <textarea
                                    ref={titleRef}
                                    value={titleValue}
                                    onChange={(e) => setTitleValue(e.target.value)}
                                    placeholder="Untitled"
                                    className="w-full text-4xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden break-words"
                                    rows={1}
                                    style={{
                                        height: "auto",
                                        minHeight: "3rem",
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = target.scrollHeight + "px";
                                    }}
                                />
                            </div>

                            {/* Description - Notion-like editable */}
                            <div className="mb-12">
                                <textarea
                                    ref={descriptionRef}
                                    value={descriptionValue}
                                    onChange={(e) => setDescriptionValue(e.target.value)}
                                    placeholder="Thêm mô tả cho chương này..."
                                    className="w-full text-base text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden break-words"
                                    rows={3}
                                    style={{
                                        minHeight: "50px",
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = target.scrollHeight + "px";
                                    }}
                                />
                            </div>



                            {/* Lesson Count */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                <span className="text-sm text-gray-500">
                                    {lessons?.length || 0} bài học
                                </span>
                            </div>

                            {/* Lesson List - Notion-like rows */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                        Danh sách bài học
                                    </h2>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Thêm bài học
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleCreateLesson("Video")}>
                                                <Video className="h-4 w-4 mr-2" />
                                                Video
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCreateLesson("Text")}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Text
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCreateLesson("Quiz")}>
                                                <ClipboardList className="h-4 w-4 mr-2" />
                                                Quiz
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {lessons && lessons.length > 0 ? (
                                    <div className="space-y-1">
                                        {lessons.map((lesson, index) => (
                                            <motion.div
                                                key={lesson.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => onLessonSelect?.(lesson.id)}
                                                className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                {/* Icon */}
                                                <div className="shrink-0">{getLessonIcon(lesson.type)}</div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {lesson.title}
                                                    </h3>
                                                    {lesson.description && (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {lesson.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Meta info */}
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    {/* {lesson.type === "Video" && lesson.durationSeconds && (
                                                        <span>{Math.floor(lesson.durationSeconds / 60)}phút</span>
                                                    )} */}
                                                    {!lesson.isPublished ? (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                                                            Đã ẩn
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                                            Đang hoạt động
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Chevron */}
                                                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">Chưa có bài học nào</p>
                                    </div>
                                )}
                            </div>

                            {/* Assignment Section - Placeholder */}
                            <div className="mt-12">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                    Bài tập cuối chương
                                </h2>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                                    <ClipboardList className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500 mb-4">Chưa có bài tập nào cho chương này</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            // Placeholder action
                                            console.log("Create assignment clicked");
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tạo bài tập
                                    </Button>
                                </div>
                            </div>
                        </motion.div>


                    </div>
                </div>
            </div>
        );
    }
);

SectionEditor.displayName = "SectionEditor";
