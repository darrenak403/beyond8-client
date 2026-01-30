"use client";

import React, { useState } from "react";
import { Plus, Loader2, Pencil, Trash2, Video, FileText, ClipboardList, Clock, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useCreateLesson,
  useDeleteLesson,
  useGetLessonBySectionId,
} from "@/hooks/useLesson";
import { LessonType } from "@/lib/api/services/fetchLesson";

interface LessonListProps {
  sectionId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  type: z.enum(["Video", "Text", "Quiz"]),
  durationSeconds: z.number().min(0, "Thời lượng phải lớn hơn 0"),
  minCompletionSeconds: z.number().min(0, "Thời gian tối thiểu phải lớn hơn 0"),
  isPreview: z.boolean(),
  isDownloadable: z.boolean(),
  // Video specific
  videoOriginalUrl: z.string().nullable(),
  // Text specific
  textContent: z.string().nullable(),
  // Quiz specific
  quizId: z.string().nullable(),
  requiredScore: z.number().min(0).max(100),
});

export default function LessonList({ sectionId }: LessonListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LessonType | null>(null);
  const { lessons, isLoading } = useGetLessonBySectionId(sectionId);
  const { createLesson, isPending: isCreating } = useCreateLesson();
  const { deleteLesson, isPending: isDeleting } = useDeleteLesson(sectionId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Video",
      durationSeconds: 0,
      minCompletionSeconds: 0,
      isPreview: false,
      isDownloadable: false,
      videoOriginalUrl: null,
      textContent: null,
      quizId: null,
      requiredScore: 70,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createLesson({
        sectionId,
        title: values.title,
        description: values.description,
        type: values.type as LessonType,
        durationSeconds: values.durationSeconds,
        minCompletionSeconds: values.minCompletionSeconds,
        isPreview: values.isPreview,
        isDownloadable: values.isDownloadable,
        videoOriginalUrl: values.type === "Video" ? values.videoOriginalUrl : null,
        textContent: values.type === "Text" ? values.textContent : null,
        quizId: values.type === "Quiz" ? values.quizId : null,
        requiredScore: values.type === "Quiz" ? values.requiredScore : 0,
      });
      toast.success("Tạo bài học thành công!");
      setIsCreateOpen(false);
      setSelectedType(null);
      form.reset();
    } catch (error) {
      toast.error("Không thể tạo bài học. Vui lòng thử lại.");
    }
  };

  const handleTypeSelect = (type: LessonType) => {
    setSelectedType(type);
    form.setValue("type", type as "Video" | "Text" | "Quiz");
  };

  const handleCancel = () => {
    setIsCreateOpen(false);
    setSelectedType(null);
    form.reset();
  };

  const onDelete = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);
      toast.success("Xóa bài học thành công!");
    } catch (error) {
      toast.error("Không thể xóa bài học. Vui lòng thử lại.");
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "Text":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "Quiz":
        return <ClipboardList className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Lessons List */}
      {lessons.length > 0 && (
        <Accordion type="multiple" className="space-y-1">
          {lessons.map((lesson, index) => (
          <AccordionItem
            key={lesson.id}
            value={lesson.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-gray-50 group">
              <div className="flex items-center gap-3 flex-1 pr-2">
                <div className="text-sm text-gray-500 font-medium w-8">
                  {index + 1}.
                </div>
                <div className="flex-1 flex items-center gap-2">
                  {getLessonIcon(lesson.type)}
                  <span className="text-sm font-medium text-gray-800">{lesson.title}</span>
                  {lesson.durationSeconds > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDuration(lesson.durationSeconds)}
                    </span>
                  )}
                  {lesson.isPreview && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      Xem trước
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lesson.id);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-3 pt-1">
              <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-md">
                <div>
                  <span className="font-semibold text-gray-700">Mô tả:</span>
                  <p className="text-gray-600 mt-1">{lesson.description || "Không có mô tả"}</p>
                </div>
                
                {lesson.type === "Video" && lesson.videoOriginalUrl && (
                  <div>
                    <span className="font-semibold text-gray-700">URL Video:</span>
                    <p className="text-gray-600 mt-1 break-all">{lesson.videoOriginalUrl}</p>
                  </div>
                )}
                
                {lesson.type === "Text" && lesson.textContent && (
                  <div>
                    <span className="font-semibold text-gray-700">Nội dung:</span>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">{lesson.textContent}</p>
                  </div>
                )}
                
                {lesson.type === "Quiz" && (
                  <div className="space-y-1">
                    {lesson.quizId && (
                      <div>
                        <span className="font-semibold text-gray-700">Quiz ID:</span>
                        <span className="text-gray-600 ml-2">{lesson.quizId}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-700">Điểm yêu cầu:</span>
                      <span className="text-gray-600 ml-2">{lesson.requiredScore}%</span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 pt-1">
                  {lesson.minCompletionSeconds > 0 && (
                    <div>
                      <span className="font-semibold text-gray-700">Thời gian tối thiểu:</span>
                      <span className="text-gray-600 ml-2">{formatDuration(lesson.minCompletionSeconds)}</span>
                    </div>
                  )}
                  {lesson.isDownloadable && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Có thể tải xuống
                    </span>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      )}

      {/* Add Lesson Button */}
      {!isCreateOpen && (
        <Button
          variant="ghost"
          onClick={() => setIsCreateOpen(true)}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm bài học
        </Button>
      )}

      {/* Inline Create Form */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-300 shadow-sm p-4 rounded-lg mt-2">
              {/* Type Selection Stage */}
              {!selectedType ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Chọn loại bài học:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTypeSelect(LessonType.Video)}
                      className="flex items-center gap-2 h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Video className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium text-black hover:text-black">Video</p>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTypeSelect(LessonType.Text)}
                      className="flex items-center gap-2 h-auto py-3 px-4 hover:bg-green-50 hover:border-green-300"
                    >
                      <FileText className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-black hover:text-black">Văn bản</p>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTypeSelect(LessonType.Quiz)}
                      className="flex items-center gap-2 h-auto py-3 px-4 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <p className="font-medium text-black hover:text-black">Bài kiểm tra</p>
                      </div>
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                /* Form Stage */
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Selected Type Header */}
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center gap-2">
                        {selectedType === "Video" && <Video className="h-5 w-5 text-blue-500" />}
                        {selectedType === "Text" && <FileText className="h-5 w-5 text-green-500" />}
                        {selectedType === "Quiz" && <ClipboardList className="h-5 w-5 text-purple-500" />}
                        <span className="font-semibold text-gray-700">
                          {selectedType === "Video" && "Video"}
                          {selectedType === "Text" && "Văn bản"}
                          {selectedType === "Quiz" && "Bài kiểm tra"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedType(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                      >
                        Đổi loại
                      </Button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Tiêu đề bài học
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề bài học"
                                className="h-9"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Mô tả
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập mô tả bài học"
                                className="min-h-20 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Type-Specific Fields */}
                      {selectedType === "Video" && (
                        <>
                          <FormField
                            control={form.control}
                            name="videoOriginalUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  URL Video
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập URL video"
                                    className="h-9"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="durationSeconds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Thời lượng (giây)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-9"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {selectedType === "Text" && (
                        <>
                          <FormField
                            control={form.control}
                            name="textContent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Nội dung
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Nhập nội dung bài học"
                                    className="min-h-32 resize-none"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="durationSeconds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Thời gian đọc ước tính (giây)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-9"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {selectedType === "Quiz" && (
                        <>
                          <FormField
                            control={form.control}
                            name="quizId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Quiz ID
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập Quiz ID"
                                    className="h-9"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="requiredScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Điểm yêu cầu (0-100)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="70"
                                    className="h-9"
                                    min={0}
                                    max={100}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Min Completion Time */}
                      <FormField
                        control={form.control}
                        name="minCompletionSeconds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Thời gian hoàn thành tối thiểu (giây)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="h-9"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Switches */}
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="isPreview"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-semibold">
                                  Xem trước miễn phí
                                </FormLabel>
                                <p className="text-xs text-gray-500">
                                  Cho phép học viên xem trước bài học này
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isDownloadable"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm font-semibold">
                                  Cho phép tải xuống
                                </FormLabel>
                                <p className="text-xs text-gray-500">
                                  Học viên có thể tải bài học về máy
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCreating}
                        className="text-white font-bold px-4 rounded-full"
                      >
                        {isCreating ? "Đang lưu..." : "Lưu bài học"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
