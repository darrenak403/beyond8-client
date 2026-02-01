"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Video, FileText, ClipboardList, Loader2, Plus, BookOpen, GripVertical, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetSectionsByCourseId, useCreateSection, useReoderSection } from "@/hooks/useSection";
import { useGetLessonBySectionId, useReorderLessonInSection, useReorderLessonOtherSection } from "@/hooks/useLesson";
import { cn } from "@/lib/utils";
import { Lesson } from "@/lib/api/services/fetchLesson";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
});

interface CompactSectionListProps {
  courseId: string;
  selectedSectionId: string | null;
  selectedLessonId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
  onCreateSection: () => void;
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video className="h-4 w-4" />;
    case "Text":
      return <FileText className="h-4 w-4" />;
    case "Quiz":
      return <ClipboardList className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

interface SectionItemProps {
  section: { id: string; orderIndex: number; title: string };
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (sectionId: string) => void;
  selectedLessonId: string | null;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
  onDragStart: (sectionId: string) => void;
  onDragOver: (e: React.DragEvent, sectionId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, sectionId: string) => void;
  onLessonDragStart: (lessonId: string, sectionId: string) => void;
  onLessonDragOver: (e: React.DragEvent, lessonId: string) => void;
  onLessonDragLeave: (e: React.DragEvent) => void;
  onLessonDrop: (e: React.DragEvent, sectionId: string, lessonId: string, lessons: Lesson[]) => void;
  isDragging: boolean;
}

const SectionItem = ({
  section,
  isSelected,
  isExpanded,
  onToggle,
  onSelect,
  selectedLessonId,
  onSelectLesson,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onLessonDragStart,
  onLessonDragOver,
  onLessonDragLeave,
  onLessonDrop,
  isDragging,
}: SectionItemProps) => {
  const { lessons, isLoading } = useGetLessonBySectionId(section.id);
  const [isDraggingLesson, setIsDraggingLesson] = React.useState<string | null>(null);

  return (
    <div
      className="border-b border-gray-200 last:border-0 transition-all duration-200"
      draggable
      onDragStart={() => onDragStart(section.id)}
      onDragOver={(e) => onDragOver(e, section.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, section.id)}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-3.5 cursor-pointer transition-colors hover:bg-gray-100 group",
          isSelected && !selectedLessonId && "bg-purple-50 hover:bg-purple-100"
        )}
        onClick={() => onSelect(section.id)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-0.5 hover:bg-gray-200 rounded shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          )}
        </button>
        <BookOpen className="h-4 w-4 text-purple-600 shrink-0" />
        <span className={cn("text-base font-medium flex-1 truncate min-w-0", isSelected && !selectedLessonId && "text-purple-700")}>
          Chương {section.orderIndex}: {section.title}
        </span>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-gray-400 shrink-0" />}
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang tải...
              </div>
            ) : lessons && lessons.length > 0 ? (
              <div className="bg-gray-50/50">
                {lessons.map((lesson: { id: string; title: string; type: string }, index: number) => (
                  <div
                    key={lesson.id}
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      setIsDraggingLesson(lesson.id);
                      onLessonDragStart(lesson.id, section.id);
                    }}
                    onDragEnd={() => setIsDraggingLesson(null)}
                    onDragOver={(e) => {
                      e.stopPropagation();
                      onLessonDragOver(e, lesson.id);
                    }}
                    onDragLeave={onLessonDragLeave}
                    onDrop={(e) => {
                      e.stopPropagation();
                      onLessonDrop(e, section.id, lesson.id, lessons);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 mx-2 py-2.5 pl-8 cursor-pointer transition-all duration-200 hover:bg-gray-100 group",
                      selectedLessonId === lesson.id && "bg-purple-100 hover:bg-purple-100 rounded-lg"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLesson(section.id, lesson.id);
                    }}
                  >
                    <span className="text-gray-400 text-sm font-medium min-w-5">{index + 1}</span>
                    <span className={cn("text-purple-500", selectedLessonId === lesson.id && "text-purple-700")}>
                      {getLessonIcon(lesson.type)}
                    </span>
                    <span
                      className={cn(
                        "text-base flex-1 truncate min-w-0",
                        selectedLessonId === lesson.id ? "text-purple-700 font-medium" : "text-gray-700"
                      )}
                    >
                      {lesson.title}
                    </span>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </div>
                ))}
                {/* Invisible drop zone for end of list */}
                <div
                  className="h-6 w-full transition-all duration-200"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add('border-t-4', 'border-purple-500');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-t-4', 'border-purple-500');
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-t-4', 'border-purple-500');
                    onLessonDrop(e, section.id, "END_OF_LIST", lessons);
                  }}
                />
              </div>
            ) : (
              <div
                className="px-4 py-2 pl-8 text-sm text-gray-400 transition-all duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('bg-purple-50', 'text-purple-500');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-purple-50', 'text-purple-500');
                }}
                onDrop={(e) => {
                  e.stopPropagation();
                  e.currentTarget.classList.remove('bg-purple-50', 'text-purple-500');
                  onLessonDrop(e, section.id, "END_OF_LIST", lessons || []);
                }}
              >
                Chưa có bài học
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CompactSectionList({
  courseId,
  selectedSectionId,
  selectedLessonId,
  onSelectSection,
  onSelectLesson,
  onCreateSection,
}: CompactSectionListProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [draggedLessonId, setDraggedLessonId] = useState<string | null>(null);
  const [draggedLessonSectionId, setDraggedLessonSectionId] = useState<string | null>(null);
  const [dragOverTimeout, setDragOverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { sections, isLoading } = useGetSectionsByCourseId(courseId);
  const { createSection, isPending: isCreating } = useCreateSection();
  const { reorderSection } = useReoderSection(courseId);
  const { reorderLessonInSection } = useReorderLessonInSection();
  const { reorderLessonOtherSection } = useReorderLessonOtherSection();
  const router = useRouter();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleAutoScroll = (clientY: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { top, bottom } = container.getBoundingClientRect();
    const threshold = 60;
    const scrollSpeed = 15;

    if (clientY < top + threshold) {
      container.scrollTop -= scrollSpeed;
    } else if (clientY > bottom - threshold) {
      container.scrollTop += scrollSpeed;
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newSection = await createSection({
      courseId,
      title: values.title,
      description: values.description || "",
      assignmentId: null,
    });
    setIsCreatingSection(false);
    form.reset();
    // Auto-select the newly created section
    if (newSection?.data?.[0]?.id) {
      onSelectSection(newSection.data[0].id);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Auto-expand selected section
  React.useEffect(() => {
    if (selectedSectionId) {
      setExpandedSections((prev) => new Set(prev).add(selectedSectionId));
    }
  }, [selectedSectionId]);

  // Section drag & drop handlers
  const handleSectionDragStart = (sectionId: string) => {
    setDraggedSectionId(sectionId);
  };

  const handleSectionDragOver = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    handleAutoScroll(e.clientY);

    // If dragging a lesson over a closed section, auto-expand it after a delay
    if (draggedLessonId && !expandedSections.has(targetSectionId)) {
      if (dragOverTimeout) {
        clearTimeout(dragOverTimeout);
      }
      const timeout = setTimeout(() => {
        setExpandedSections((prev) => new Set(prev).add(targetSectionId));
      }, 500); // 500ms delay before auto-expanding
      setDragOverTimeout(timeout);
    }

    // Only show visual indicator when dragging sections, not lessons
    if (draggedSectionId && draggedSectionId !== targetSectionId) {
      // Add visual drop zone indicator
      e.currentTarget.classList.add('border-t-4', 'border-purple-500', 'mt-2');
    }
  };

  const handleSectionDragLeave = (e: React.DragEvent) => {
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout);
      setDragOverTimeout(null);
    }
    e.currentTarget.classList.remove('border-t-4', 'border-purple-500', 'mt-2');
  };

  const handleSectionDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout);
      setDragOverTimeout(null);
    }
    e.currentTarget.classList.remove('border-t-4', 'border-purple-500', 'mt-2');

    if (draggedSectionId && draggedSectionId !== targetSectionId && sections) {
      const draggedIndex = sections.findIndex((s) => s.id === draggedSectionId);
      const targetIndex = sections.findIndex((s) => s.id === targetSectionId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        if (draggedIndex !== -1 && targetIndex !== -1) {
          let newOrderIndex = targetIndex;
          if (draggedIndex < targetIndex) {
            newOrderIndex = targetIndex;
          }

          reorderSection({
            sectionId: draggedSectionId,
            newOrderIndex: Math.max(0, newOrderIndex) + 1
          });
        }
      }
    } else if (draggedLessonId) {
      // Handle dropping a lesson onto a section header (move to that section)
      if (draggedLessonSectionId) {
        if (draggedLessonId === selectedLessonId) {
          onSelectSection(targetSectionId);
          onSelectLesson(targetSectionId, draggedLessonId);
        }

        reorderLessonOtherSection({
          lessonId: draggedLessonId,
          newSectionId: targetSectionId,
          newOrderIndex: 0, // Move to top of the section
          oldSectionId: draggedLessonSectionId
        });
      }
      // Wait! We don't have source section id in state.
      // I should update state to store draggedLessonSectionId.
    }
    setDraggedSectionId(null);
  };

  // Lesson drag & drop handlers
  const handleLessonDragStart = (lessonId: string, sectionId: string) => {
    setDraggedLessonId(lessonId);
    setDraggedLessonSectionId(sectionId);
  };

  const handleLessonDragOver = (e: React.DragEvent, targetLessonId: string) => {
    e.preventDefault();
    handleAutoScroll(e.clientY);
    if (draggedLessonId && draggedLessonId !== targetLessonId) {
      e.currentTarget.classList.add('border-t-4', 'border-purple-500', 'mt-1');
    }
  };

  const handleLessonDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-t-4', 'border-purple-500', 'mt-1');
  };

  const handleLessonDrop = (e: React.DragEvent, sectionId: string, targetLessonId: string, lessons: Lesson[]) => {
    e.preventDefault();
    if (dragOverTimeout) {
      clearTimeout(dragOverTimeout);
      setDragOverTimeout(null);
    }
    e.currentTarget.classList.remove('border-t-4', 'border-purple-500', 'mt-1');

    if (draggedLessonId) {
      const draggedIndex = lessons.findIndex((l) => l.id === draggedLessonId);
      let targetIndex: number;

      if (targetLessonId === "END_OF_LIST") {
        targetIndex = lessons.length;
      } else {
        targetIndex = lessons.findIndex((l) => l.id === targetLessonId);
      }

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Same section reorder
        let newOrderIndex = targetIndex;
        if (draggedIndex < targetIndex) {
          // No adjustment needed, backend expects the target index directly
          newOrderIndex = targetIndex;
        }

        reorderLessonInSection({
          lessonId: draggedLessonId,
          newOrderIndex: Math.max(0, newOrderIndex) + 1,
          sectionId: sectionId
        });
      } else if (draggedIndex === -1 && targetIndex !== -1 && draggedLessonSectionId) {
        // Cross-section reorder (dropped on specific lesson)
        // Insert before target
        if (draggedLessonId === selectedLessonId) {
          onSelectSection(sectionId);
          onSelectLesson(sectionId, draggedLessonId);
        }

        reorderLessonOtherSection({
          lessonId: draggedLessonId,
          newSectionId: sectionId, // Target section ID
          newOrderIndex: targetIndex + 1,
          oldSectionId: draggedLessonSectionId
        });
      }
    }
    setDraggedLessonId(null);
    setDraggedLessonSectionId(null);
  };

  if (isLoading) {
    return (
      <div className="w-80 border-r bg-white flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white flex flex-col h-[calc(100vh-100px)] overflow-hidden border-r border-gray-100">
      {/* Header */}
      <div className="border-b bg-gray-50/50 px-4 py-2 shrink-0 flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-900">Danh sách các chương</h3>
        <Button
          onClick={() => setIsCreatingSection(!isCreatingSection)}
          size="sm"
          variant="outline"
          className="h-8"
        >
          <motion.div
            animate={{ rotate: isCreatingSection ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Sections List */}
      {/* Sections List */}
      <div
        ref={scrollContainerRef}
        onDragOver={(e) => {
          e.preventDefault();
          handleAutoScroll(e.clientY);
        }}
        className="flex-1 overflow-y-auto pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
        {sections && sections.length > 0 ? (
          <>
            {/* Inline Create Form */}
            <AnimatePresence>
              {isCreatingSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t bg-white"
                >
                  <div className="p-3">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Chương {sections.length + 1}
                          </span>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isCreating}
                            className="h-7 px-3 rounded-full"
                          >
                            {isCreating ? "Đang thêm..." : "Thêm chương"}
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormControl>
                                <Input
                                  placeholder="Tiêu đề chương"
                                  className="h-9 text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormControl>
                                <Input
                                  placeholder="Mô tả (tùy chọn)"
                                  className="h-9 text-sm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {sections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                isExpanded={expandedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
                onSelect={onSelectSection}
                selectedLessonId={selectedLessonId}
                onSelectLesson={onSelectLesson}
                onDragStart={handleSectionDragStart}
                onDragOver={handleSectionDragOver}
                onDragLeave={handleSectionDragLeave}
                onDrop={handleSectionDrop}
                onLessonDragStart={handleLessonDragStart}
                onLessonDragOver={handleLessonDragOver}
                onLessonDragLeave={handleLessonDragLeave}
                onLessonDrop={handleLessonDrop}
                isDragging={draggedSectionId === section.id}
              />
            ))}
          </>
        ) : (
          <>
            {isCreatingSection ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Chương 1</span>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isCreating}
                        className="h-7 px-3"
                      >
                        {isCreating ? "Đang lưu..." : "Thêm"}
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input placeholder="Tiêu đề chương" className="h-9 text-sm" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input placeholder="Mô tả (tùy chọn)" className="h-9 text-sm" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-4">Chưa có chương nào</p>
                <Button onClick={() => setIsCreatingSection(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo chương đầu tiên
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
