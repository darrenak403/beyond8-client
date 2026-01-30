"use client";

import React, { useState } from "react";
import { Plus, Loader2, Pencil, Trash2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateSection, useGetSectionsByCourseId } from "@/hooks/useSection";

interface SectionListProps {
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
});

export default function SectionList({ courseId }: SectionListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { sections, isLoading } = useGetSectionsByCourseId(courseId);
  const { createSection, isPending: isCreating } = useCreateSection();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createSection({
        courseId,
        title: values.title,
        description: values.description || "",
        assignmentId: "",
      });
      setIsCreateOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const nextSectionIndex = sections.length + 1;

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold tracking-tight">Nội dung khóa học</h2>
          <p className="text-muted-foreground">
            Tổ chức khóa học thành các chương và bài giảng để học viên dễ theo dõi.
          </p>
        </motion.div>

        {/* Add Chapter Button */}
        <Button
          onClick={() => setIsCreateOpen(true)}
          disabled={isCreateOpen}
          className="rounded-full font-semibold px-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm chương mới
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-4 w-full max-w-6xl">
        <AnimatePresence mode="popLayout">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-gray-200 bg-gray-50/50 rounded-lg "
            >
              <div className="flex items-center gap-3 p-3 group">
                <div className="font-bold text-gray-900 whitespace-nowrap">Chương {index + 1}:</div>
                <div className="flex-1 font-medium text-gray-800 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {section.title}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Placeholder for Curriculum Items */}
              <div className="px-10 pb-3">{/* Future: List lessons here */}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Inline Create Form */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-300 shadow-sm p-4 mt-4 rounded-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Title Row */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 whitespace-nowrap">
                      Chương {nextSectionIndex}:
                    </span>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Nhập tiêu đề chương"
                                className="bg-white h-9 focus-visible:ring-1 focus-visible:ring-gray-400 border-gray-300"
                                {...field}
                              />
                              <span className="absolute right-3 top-2 text-xs text-gray-400 font-medium">
                                80
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description Row */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Mô tả chương (tùy chọn):
                    </p>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Nhập mô tả của chương này"
                                className="bg-white h-9 focus-visible:ring-1 focus-visible:ring-gray-400 border-gray-300"
                                {...field}
                              />
                              <span className="absolute right-3 top-2 text-xs text-gray-400 font-medium">
                                200
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCreateOpen(false)}
                      className="font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-gray-900 hover:bg-black text-white font-bold rounded-md px-4"
                    >
                      {isCreating ? "Đang lưu..." : "Lưu chương"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
