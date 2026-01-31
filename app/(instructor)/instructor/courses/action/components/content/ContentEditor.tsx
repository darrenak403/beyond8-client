"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Trash2, FileText, BookOpen, Video, ClipboardList, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useUpdateSection, useDeleteSection } from "@/hooks/useSection";
import { useGetLessonBySectionId, useUpdateLesson, useDeleteLesson } from "@/hooks/useLesson";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { LessonType } from "@/lib/api/services/fetchLesson";

interface ContentEditorProps {
  courseId: string;
  selectedSectionId: string | null;
  selectedLessonId: string | null;
  section: { id: string; orderIndex: number; title: string; description?: string } | undefined;
  onDeleted?: () => void;
  onLessonSelect?: (lessonId: string) => void;
  onBackToInfo?: () => void;
}

export interface ContentEditorRef {
  hasUnsavedChanges: () => boolean;
  save: () => Promise<void>;
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
  ({ courseId, selectedSectionId, selectedLessonId, section, onDeleted, onLessonSelect, onBackToInfo }, ref) => {
    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [lessonTitleValue, setLessonTitleValue] = useState("");
    const [lessonDescriptionValue, setLessonDescriptionValue] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
    
    const { updateSection, isPending: isUpdating } = useUpdateSection(courseId);
    const { deleteSection, isPending: isDeleting } = useDeleteSection(courseId);
    const { lessons } = useGetLessonBySectionId(selectedSectionId || "");
    const { updateLesson, isPending: isUpdatingLesson } = useUpdateLesson(selectedSectionId || "");
    const { deleteLesson, isPending: isDeletingLesson } = useDeleteLesson(selectedSectionId || "");

    // Get current lesson
    const selectedLesson = lessons?.find((l) => l.id === selectedLessonId);

    // Update local state when section changes
    useEffect(() => {
      if (section) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitleValue(section.title);
        setDescriptionValue(section.description || "");
      }
    }, [section]);

    // Update lesson local state when lesson changes
    useEffect(() => {
      if (selectedLesson) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLessonTitleValue(selectedLesson.title);
        setLessonDescriptionValue(selectedLesson.description || "");
      }
    }, [selectedLesson]);

    // Check if there are unsaved changes for section
    const hasChanges = section && (
      titleValue !== section.title || 
      descriptionValue !== (section.description || "")
    );

    // Check if there are unsaved changes for lesson
    const hasLessonChanges = selectedLesson && (
      lessonTitleValue !== selectedLesson.title || 
      lessonDescriptionValue !== (selectedLesson.description || "")
    );

    const handleSave = async () => {
      if (!selectedSectionId || !titleValue.trim()) {
        setTitleValue(section?.title || "");
        setDescriptionValue(section?.description || "");
        return;
      }
      await updateSection({
        sectionId: selectedSectionId,
        data: { title: titleValue, description: descriptionValue },
      });
    };

    const handleLessonSave = async () => {
      if (!selectedLessonId || !selectedLesson || !lessonTitleValue.trim()) {
        return;
      }
      await updateLesson({
        lessonId: selectedLessonId,
        lessonType: selectedLesson.type as LessonType,
        data: {
          id: selectedLessonId,  
          title: lessonTitleValue,
          description: lessonDescriptionValue,
        }
      });
    };

    const handleDelete = async () => {
      if (!selectedSectionId) return;
      await deleteSection(selectedSectionId);
      setIsDeleteDialogOpen(false);
      onDeleted?.();
    };

    const handleLessonDelete = async () => {
      if (!selectedLessonId) return;
      await deleteLesson(selectedLessonId);
      setIsDeleteLessonDialogOpen(false);
      onLessonSelect?.(""); // Go back to section view
    };

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

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      hasUnsavedChanges: () => !!(hasChanges || hasLessonChanges),
      save: async () => {
        if (hasChanges) {
          await handleSave();
        }
        if (hasLessonChanges) {
          await handleLessonSave();
        }
      },
    }));

    // Empty state when no section selected
    if (!section || !selectedSectionId) {
      return (
        <div className="flex-1 flex flex-col bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {/* Tab Switcher */}
            {onBackToInfo && (
              <div className="mb-8">
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
            
            <div className="text-center max-w-md">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Chưa có chương nào được chọn
              </h3>
              <p className="text-sm text-gray-500">
                Vui lòng chọn một chương từ danh sách bên trái hoặc tạo chương đầu tiên để bắt đầu.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Lesson detail view
    if (selectedLessonId) {
      
      return (
        <div key={`lesson-${selectedLessonId}`} className="flex-1 flex flex-col bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden">
          {/* Header with Tab Switcher */}
          <div className="flex items-center justify-between px-16 py-6 border-b bg-white relative">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLessonSelect?.("")}
                className="gap-2 rounded-full hover:bg-gray-100 hover:text-gray-900"
              >
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
          <div className="flex-1 overflow-y-auto relative">
            <div className="max-w-4xl mx-auto px-16 py-12">
              {/* Lesson Content */}
              <div className="space-y-6">
                {/* Title - Editable */}
                <div className="flex items-center gap-3">
                  {getLessonIcon(selectedLesson?.type)}
                  <textarea
                    value={lessonTitleValue}
                    onChange={(e) => setLessonTitleValue(e.target.value)}
                    placeholder="Untitled"
                    className="flex-1 text-4xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden"
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
                </div>

                {/* Description - Editable */}
                <div>
                  <textarea
                    value={lessonDescriptionValue}
                    onChange={(e) => setLessonDescriptionValue(e.target.value)}
                    placeholder="Thêm mô tả cho bài học..."
                    className="w-full text-lg text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden"
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

                {/* Metadata */}
                <div className="flex items-center gap-6 text-sm text-gray-500 border-b pb-6">
                  <div>
                    <span className="font-medium">Loại:</span> {selectedLesson?.type || "Text"}
                  </div>
                  {selectedLesson?.type === "Video" && selectedLesson?.durationSeconds && (
                    <div>
                      <span className="font-medium">Thời lượng:</span> {Math.floor(selectedLesson.durationSeconds / 60)} phút
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Xem trước:</span> {selectedLesson?.isPreview ? "Có" : "Không"}
                  </div>
                </div>

                {/* Content Area */}
                <div className="mt-8">
                  {selectedLesson?.type === "Video" && selectedLesson.videoOriginalUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Video className="h-16 w-16 text-gray-400" />
                      <p className="ml-4 text-gray-500">Video URL: {selectedLesson.videoOriginalUrl}</p>
                    </div>
                  )}
                  
                  {selectedLesson?.type === "Text" && selectedLesson.textContent && (
                    <div className="prose max-w-none">
                      <div className="p-6 bg-gray-50 rounded-lg">
                        {selectedLesson.textContent}
                      </div>
                    </div>
                  )}

                  {selectedLesson?.type === "Quiz" && (
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <ClipboardList className="h-12 w-12 text-blue-500 mb-4" />
                      <p className="text-gray-700">Quiz ID: {selectedLesson.quizId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Delete Lesson Button - Bottom Left */}
            <div className="absolute bottom-8 left-16">
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
        </div>
      );
    }

    // Section view with lesson list (Notion-like)
    return (
      <div key={`section-${selectedSectionId}`} className="flex-1 flex flex-col bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden">
        {/* Header with Tab Switcher */}
        <div className="flex items-center justify-between px-16 py-6 border-b bg-white relative">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chương {section.orderIndex}
            </h2>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto px-16 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title - Notion-like editable */}
            <div className="mb-6">
              <textarea
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                placeholder="Untitled"
                className="w-full text-4xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden"
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
            </div>

            {/* Description - Notion-like editable */}
            <div className="mb-12">
              <textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                placeholder="Thêm mô tả cho chương này..."
                className="w-full text-base text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden"
                rows={3}
                style={{ 
                  minHeight: '100px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Danh sách bài học
              </h2>
              
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
                      <div className="shrink-0">
                        {getLessonIcon(lesson.type)}
                      </div>
                      
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
                        {lesson.type === "Video" && lesson.durationSeconds && (
                          <span>{Math.floor(lesson.durationSeconds / 60)}phút</span>
                        )}
                        {lesson.isPreview && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            Xem trước
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
          </motion.div>
          
          {/* Delete Button - Bottom Left */}
          <div className="absolute bottom-8 left-16">
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
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa chương
                </Button>
              }
            />
          </div>
        </div>
        </div>
      </div>
    );
  }
);

ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
        