"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  ArrowLeft,
  Trash2,
  Video,
  FileText,
  ClipboardList,
  Upload,
  Image as ImageIcon,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderPortal } from "./HeaderPortal";
import { Progress } from "@/components/ui/progress";
import { getHubConnection } from "@/lib/realtime/signalr";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { UnsaveDialog } from "@/components/widget/UnsaveDialog";

import { useUpdateLesson, useDeleteLesson, useActivationLesson } from "@/hooks/useLesson";
import { useMediaDocumentCourse, useMediaVideoLesson } from "@/hooks/useMedia";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import SafeImage from "@/components/ui/SafeImage";
import { Lesson, LessonType } from "@/lib/api/services/fetchLesson";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DocumentUploadDialog from "@/components/widget/document/DocumentUploadDialog";
import {
  useGetLessonDocument,
  useCreateLessonDocument,
  useDeleteLessonDocument,
  useToggleDownloadLessonDocument,
} from "@/hooks/useLesson";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useGetQuizById } from "@/hooks/useQuiz";
import { CreateQuizDialog } from "@/components/widget/quiz/CreateQuizDialog";
import { CreateQuizAIDialog } from "@/components/widget/quiz/CreateQuizAIDialog";
import { QuizDialog } from "@/components/widget/quiz/QuizDialog";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { ToolbarProvider } from "@/components/ui/toolbar-provider";
import { EditorToolbar } from "./EditorToolbar";

export interface LessonEditorRef {
  hasUnsavedChanges: () => boolean;
  save: () => Promise<void>;
}

interface LessonEditorProps {
  lessonId: string;
  selectedSectionId: string;
  sectionTitle: string;
  sectionOrder: number;
  lessons: Lesson[]; // Ideally type this properly
  onBack: () => void;
  onBackToInfo?: () => void;
}

export const LessonEditor = forwardRef<LessonEditorRef, LessonEditorProps>(
  (
    { lessonId, selectedSectionId, sectionTitle, sectionOrder, lessons, onBack, onBackToInfo },
    ref
  ) => {
    const selectedLesson = lessons?.find((l) => l.id === lessonId);
    // ... (skip down to dialog)

    // Local State
    const [lessonTitleValue, setLessonTitleValue] = useState("");
    const [lessonDescriptionValue, setLessonDescriptionValue] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [isCreateQuizDialogOpen, setIsCreateQuizDialogOpen] = useState(false);
    const [isCreateQuizAIDialogOpen, setIsCreateQuizAIDialogOpen] = useState(false);

    const [isQuizDetailOpen, setIsQuizDetailOpen] = useState(false);

    // Quiz specific
    const [quizId, setQuizId] = useState("");

    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;

    const { quiz } = useGetQuizById(quizId || "");

    // Video specific
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [videoOriginalUrl, setVideoOriginalUrl] = useState("");
    const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
    const [durationValue, setDurationValue] = useState(0);
    const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Text specific
    const [textContent, setTextContent] = useState("");

    const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [showUnsaveDialog, setShowUnsaveDialog] = useState(false);
    // Track whether we are exiting or going back
    const [unsaveAction, setUnsaveAction] = useState<"exit" | "back" | null>(null);

    const [isFullScreen, setIsFullScreen] = useState(false);

    // Document specific
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [documentFileToUpload, setDocumentFileToUpload] = useState<File | null>(null);
    const [documentMetadata, setDocumentMetadata] = useState({
      title: "",
      description: "",
      isDownloadable: true,
    });
    const documentInputRef = React.useRef<HTMLInputElement>(null);

    // Hooks
    // Hooks
    const { updateLesson, isPending: isUpdatingLesson } = useUpdateLesson(
      selectedSectionId,
      courseId
    );
    const { deleteLesson, isPending: isDeletingLesson } = useDeleteLesson(
      selectedSectionId,
      courseId
    );
    const { activationLesson } = useActivationLesson(selectedSectionId, courseId);

    // Lesson Document Hooks
    const {
      lessonDocuments,
      isLoading: isLoadingDocs,
      refetch: refetchDocs,
    } = useGetLessonDocument(lessonId);
    const { createLessonDocument, isPending: isCreatingDoc } = useCreateLessonDocument(courseId);
    const { deleteLessonDocument } = useDeleteLessonDocument(courseId);
    const { toggleDownloadLessonDocument } = useToggleDownloadLessonDocument(courseId);
    const { uploadDocumentCourseAsync, isUploadingDocumentCourse } = useMediaDocumentCourse();

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
    const {
      uploadThumnailVideoLesson,
      isUploadingThumnailVideoLesson,
      uploadVideoLessonAsync,
      isUploadingVideoLesson,
    } = useMediaVideoLesson();

    const handleThumbnailUpload = async (file: File) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        // alert('Please upload an image file');
        return;
      }

      uploadThumnailVideoLesson(file, {
        onSuccess: (data) => {
          setVideoThumbnailUrl(formatImageUrl(data.fileUrl) || data.fileUrl);
        },
        onError: (error) => {
          console.error("Upload thumbnail failed", error);
        },
      });
    };

    const handleVideoUpload = async (file: File) => {
      if (!file) return;

      // Validate file type
      const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
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
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = titleRef.current.scrollHeight + "px";
      }
    }, [lessonTitleValue]);

    useEffect(() => {
      if (descriptionRef.current) {
        descriptionRef.current.style.height = "auto";
        descriptionRef.current.style.height = descriptionRef.current.scrollHeight + "px";
      }
    }, [lessonDescriptionValue]);

    // ... existing local state effects ...
    useEffect(() => {
      if (selectedLesson) {
        setLessonTitleValue(selectedLesson.title);
        setLessonDescriptionValue(selectedLesson.description || "");
        setIsPreview(selectedLesson.isPreview);
        setIsPublished(selectedLesson.isPublished);

        if (selectedLesson.type === "Video") {
          setIsDownloadable(selectedLesson.isDownloadable || false);
          setVideoOriginalUrl(
            selectedLesson.videoOriginalUrl
              ? formatImageUrl(selectedLesson.videoOriginalUrl) || selectedLesson.videoOriginalUrl
              : ""
          );
          setVideoThumbnailUrl(selectedLesson.videoThumbnailUrl || "");
          setDurationValue(selectedLesson.durationSeconds || 0);
        } else if (selectedLesson.type === "Text") {
          setTextContent(selectedLesson.textContent || "");
        } else if (selectedLesson.type === "Quiz") {
          setQuizId(selectedLesson.quizId || "");
        }
      }

      setPendingVideoFile(null);
      savedLessonRef.current = null; // Reset saved ref when prop updates
    }, [selectedLesson]);

    // Tiptap Editor Configuration
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal ml-4",
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc ml-4",
            },
          },
          code: {
            HTMLAttributes: {
              class: "bg-gray-100 rounded-md p-1 font-mono text-sm text-red-500",
            },
          },
          horizontalRule: {
            HTMLAttributes: {
              class: "my-4 border-t border-gray-200",
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class:
                "bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm my-2 overflow-x-auto",
            },
          },
          heading: {
            levels: [1, 2, 3, 4],
            HTMLAttributes: {
              class: "font-bold text-gray-900 mb-2 mt-4",
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2",
            },
          },
        }),
        Markdown.configure({
          html: false,
          transformPastedText: true,
          transformCopiedText: true,
        }),
      ],
      content: textContent,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 max-w-none",
          style: "word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word;",
        },
      },
      onUpdate: ({ editor }) => {
        const storage = editor.storage as unknown as {
          markdown: {
            getMarkdown: () => string;
          };
        };
        if (storage.markdown && storage.markdown.getMarkdown) {
          setTextContent(storage.markdown.getMarkdown());
        } else {
          console.warn("Markdown storage not available, falling back to HTML");
          setTextContent(editor.getHTML());
        }
      },
      immediatelyRender: false,
    });

    // Sync editor content when textContent changes externally (e.g. initial load)
    useEffect(() => {
      if (editor && selectedLesson?.type === "Text" && textContent) {
        const storage = editor.storage as unknown as {
          markdown: {
            getMarkdown: () => string;
          };
        };
        if (storage.markdown && storage.markdown.getMarkdown) {
          const currentMarkdown = storage.markdown.getMarkdown();
          if (currentMarkdown !== textContent) {
            if (editor.getText() === "") {
              editor.commands.setContent(textContent);
            }
          }
        }
      }
    }, [editor, selectedLesson, textContent]);

    // Reset editor content when switching lessons
    useEffect(() => {
      if (editor && selectedLesson && selectedLesson.type === "Text") {
        editor.commands.setContent(selectedLesson.textContent || "");
      }
    }, [selectedLesson, editor]);

    const baseLesson = savedLessonRef.current || selectedLesson;

    const hasLessonChanges =
      baseLesson &&
      (lessonTitleValue !== baseLesson.title ||
        lessonDescriptionValue !== (baseLesson.description || "") ||
        isPreview !== baseLesson.isPreview ||
        isPublished !== baseLesson.isPublished ||
        (baseLesson.type === "Video" &&
          (isDownloadable !== (baseLesson.isDownloadable || false) ||
            // Compare with potentially formatted state
            videoOriginalUrl !==
            (savedLessonRef.current
              ? baseLesson.videoOriginalUrl || ""
              : baseLesson.videoOriginalUrl
                ? formatImageUrl(baseLesson.videoOriginalUrl) || baseLesson.videoOriginalUrl
                : "") ||
            videoThumbnailUrl !== (baseLesson.videoThumbnailUrl || "") ||
            durationValue !== (baseLesson.durationSeconds || 0))) ||
        (baseLesson.type === "Text" && textContent !== (baseLesson.textContent || "")) ||
        (baseLesson.type === "Quiz" && quizId !== (baseLesson.quizId || "")));

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
            durationSeconds: durationValue,
          };
        } else if (selectedLesson.type === "Text") {
          specificData = {
            content: textContent,
          };
        } else if (selectedLesson.type === "Quiz") {
          specificData = {
            quizId: quizId || null,
          };
        }

        await updateLesson({
          lessonId: lessonId,
          lessonType: selectedLesson.type as LessonType,
          data: {
            ...commonData,
            ...specificData,
          },
        });

        // If we uploaded a video, wait for transcoding success signal
        if (pendingVideoFile) {
          await new Promise<void>((resolve) => {
            const connection = getHubConnection();

            // Define handler with type matching the event
            const handler = (data: { metadata?: { lessonId?: string } }) => {
              if (data?.metadata?.lessonId === lessonId) {
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
        const newVideoUrl = finalVideoUrl ? formatImageUrl(finalVideoUrl) || finalVideoUrl : "";
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
          ...(selectedLesson.type === "Video"
            ? {
              isDownloadable,
              videoOriginalUrl: newVideoUrl, // Store FORMATTED url to match state
              videoThumbnailUrl,
              durationSeconds: durationValue,
            }
            : {}),
          ...(selectedLesson.type === "Text"
            ? {
              textContent,
            }
            : {}),
          ...(selectedLesson.type === "Quiz"
            ? {
              quizId,
            }
            : {}),
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

    // Document Handlers
    const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setDocumentFileToUpload(file);
      setDocumentMetadata({
        title: file.name,
        description: "",
        isDownloadable: true,
      });
      setIsDocumentDialogOpen(true);

      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
    };

    const handleDocumentConfirmUpload = async () => {
      if (!documentFileToUpload) return;

      try {
        const mediaFile = await uploadDocumentCourseAsync(documentFileToUpload);

        if (mediaFile?.fileUrl) {
          await createLessonDocument({
            lessonId,
            lessonDocumentUrl: formatImageUrl(mediaFile.fileUrl) || "",
            title: documentMetadata.title,
            description: documentMetadata.description,
            isDownloadable: documentMetadata.isDownloadable,
            isIndexedInVectorDb: true,
          });
          refetchDocs();
          setIsDocumentDialogOpen(false);
          setDocumentFileToUpload(null);
        }
      } catch (error) {
        console.error("Failed to upload document:", error);
      }
    };

    const handleDocumentDelete = async (id: string) => {
      await deleteLessonDocument(id);
      refetchDocs();
    };

    const handleDocumentToggle = async (id: string) => {
      await toggleDownloadLessonDocument(id);
      refetchDocs();
    };

    const handleExit = () => {
      if (hasLessonChanges) {
        setUnsaveAction("exit");
        setShowUnsaveDialog(true);
      } else {
        router.push("/instructor/courses");
      }
    };

    const handleBackCheck = () => {
      if (hasLessonChanges) {
        setUnsaveAction("back");
        setShowUnsaveDialog(true);
      } else {
        onBack();
      }
    };

    const confirmUnsaveAction = () => {
      if (unsaveAction === "exit") {
        router.push("/instructor/courses");
      } else if (unsaveAction === "back") {
        onBack();
      }
      setShowUnsaveDialog(false);
    };

    const saveAndAction = async () => {
      await handleLessonSave();
      if (unsaveAction === "exit") {
        router.push("/instructor/courses");
      } else if (unsaveAction === "back") {
        onBack();
      }
      setShowUnsaveDialog(false);
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
      <div className="flex-1 flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white relative min-w-0 w-0">
        <HeaderPortal>
          {/* Header with Tab Switcher */}
          <div className="flex items-center justify-between px-8 py-3 h-14 bg-white w-full border-b">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExit}
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
          <UnsaveDialog
            open={showUnsaveDialog}
            onOpenChange={setShowUnsaveDialog}
            onDiscard={confirmUnsaveAction}
            onSave={saveAndAction}
            onCancel={() => setShowUnsaveDialog(false)}
            title="Chưa lưu thay đổi"
            description={`Bạn có thay đổi chưa lưu trong bài học "${selectedLesson?.title || ""}". Bạn có muốn lưu lại không?`}
          />
        </HeaderPortal>

        {/* Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
          <div className="max-w-4xl mx-auto px-16 py-12 pb-12">
            <div className="mb-6 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackCheck}
                className="gap-2 text-gray-500 hover:text-gray-900 pl-2 pr-4 rounded-full hover:bg-gray-100"
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
                    className="flex-1 text-4xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden wrap-break-word"
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
                  <ConfirmDialog
                    open={isPublishDialogOpen}
                    onOpenChange={setIsPublishDialogOpen}
                    onConfirm={async () => {
                      if (lessonId) {
                        await activationLesson({
                          lessonId: lessonId,
                          request: {
                            isPublished: !isPublished,
                          },
                        });
                        setIsPublishDialogOpen(false);
                      }
                    }}
                    title={isPublished ? "Ẩn bài học" : "Hiển thị bài học"}
                    description={
                      isPublished
                        ? "Học viên sẽ không thể nhìn thấy bài học này. Bạn có chắc chắn muốn ẩn không?"
                        : "Bài học sẽ hiển thị cho học viên. Bạn có chắc chắn muốn hiển thị không?"
                    }
                    confirmText={isPublished ? "Ẩn" : "Hiển thị"}
                    cancelText="Hủy"
                    variant={isPublished ? "destructive" : "default"}
                    isLoading={false}
                    trigger={
                      <Button
                        variant={isPublished ? "destructive" : "default"}
                        size="sm"
                        className="rounded-full"
                      >
                        {isPublished ? "Ẩn bài học" : "Hiển thị bài học"}
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Description - Editable */}
              <div>
                <textarea
                  ref={descriptionRef}
                  value={lessonDescriptionValue}
                  onChange={(e) => setLessonDescriptionValue(e.target.value)}
                  placeholder="Thêm mô tả cho bài học..."
                  className="w-full text-lg text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none bg-transparent overflow-hidden wrap-break-word"
                  rows={2}
                  style={{
                    minHeight: "60px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
              </div>

              {/* Metadata & Settings */}
              <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/60 space-y-6">
                {selectedLesson?.type !== "Video" ? (
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="is-preview"
                        checked={isPreview}
                        onCheckedChange={setIsPreview}
                        className="data-[state=checked]:bg-purple-600"
                      />
                      <Label
                        htmlFor="is-preview"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Xem trước
                        <span className="block text-xs font-normal text-gray-400">
                          Cho phép học viên xem thử
                        </span>
                      </Label>
                    </div>

                    <div className="h-10 w-px bg-slate-200" />

                    <div className="flex items-center gap-12">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Lượt xem
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.totalViews || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Hoàn thành
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.totalCompletions || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Cập nhật
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.updatedAt
                            ? new Date(selectedLesson.updatedAt).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Toggles Group */}
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="is-preview"
                          checked={isPreview}
                          onCheckedChange={setIsPreview}
                          className="data-[state=checked]:bg-purple-600"
                        />
                        <Label
                          htmlFor="is-preview"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Xem trước
                          <span className="block text-xs font-normal text-gray-400">
                            Cho phép học viên xem thử
                          </span>
                        </Label>
                      </div>

                      {selectedLesson?.type === "Video" && (
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="is-downloadable"
                            checked={isDownloadable}
                            onCheckedChange={setIsDownloadable}
                          />
                          <Label
                            htmlFor="is-downloadable"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Cho phép tải về
                            <span className="block text-xs font-normal text-gray-400">
                              Video bài học
                            </span>
                          </Label>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-slate-200" />

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {selectedLesson?.type === "Video" && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                            Thời lượng
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {durationValue
                              ? `${Math.floor(durationValue / 60)}p ${durationValue % 60}s`
                              : "0s"}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Lượt xem
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.totalViews || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Hoàn thành
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.totalCompletions || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Cập nhật
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedLesson?.updatedAt
                            ? new Date(selectedLesson.updatedAt).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Lesson Documents Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="documents"
                  className="border rounded-xl px-6 bg-white overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-900">Tài liệu bài học</span>
                      <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                        {lessonDocuments?.length || 0}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 pb-6 pt-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-200">
                        <div className="text-sm text-muted-foreground">
                          Tải lên tài liệu bổ trợ cho bài học này (PDF, Word, Excel...)
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-white hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all"
                          onClick={() => documentInputRef.current?.click()}
                          disabled={isUploadingDocumentCourse || isCreatingDoc}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploadingDocumentCourse ? "Đang tải..." : "Thêm tài liệu"}
                        </Button>
                        <input
                          ref={documentInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleDocumentFileSelect}
                        />
                      </div>

                      {/* Documents List */}
                      {isLoadingDocs ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                      ) : lessonDocuments && lessonDocuments.length > 0 ? (
                        <div className="grid gap-3">
                          {lessonDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-all group"
                            >
                              <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="font-medium truncate text-sm" title={doc.title}>
                                    {doc.title}
                                  </span>
                                  {doc.description && (
                                    <span
                                      className="text-xs text-gray-500 truncate"
                                      title={doc.description}
                                    >
                                      {doc.description}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                    <span>
                                      {format(new Date(doc.createdAt), "dd/MM/yyyy", {
                                        locale: vi,
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                {/* Status Badge */}
                                <div
                                  className={`
                                                                    flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-pointer transition-colors
                                                                    ${doc.isDownloadable
                                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    }
                                                                `}
                                  onClick={() => handleDocumentToggle(doc.id)}
                                  title={
                                    doc.isDownloadable
                                      ? "Click để tắt tải xuống"
                                      : "Click để bật tải xuống"
                                  }
                                >
                                  <Switch
                                    checked={doc.isDownloadable}
                                    onCheckedChange={() => handleDocumentToggle(doc.id)}
                                    id={`doc-toggle-${doc.id}`}
                                    className="scale-[0.6] data-[state=checked]:bg-green-600 origin-center"
                                  />
                                  <Label
                                    htmlFor={`doc-toggle-${doc.id}`}
                                    className="cursor-pointer whitespace-nowrap"
                                  >
                                    {doc.isDownloadable ? "Được tải" : "Không tải"}
                                  </Label>
                                </div>

                                <div className="h-4 w-px bg-gray-200 mx-1" />

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                  <a
                                    href={doc.lessonDocumentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Xem trước"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDocumentDelete(doc.id)}
                                    title="Xóa tài liệu"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500">Chưa có tài liệu nào được tải lên</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <DocumentUploadDialog
                open={isDocumentDialogOpen}
                onOpenChange={setIsDocumentDialogOpen}
                metadata={documentMetadata}
                setMetadata={setDocumentMetadata}
                onConfirm={handleDocumentConfirmUpload}
                onCancel={() => setIsDocumentDialogOpen(false)}
                isLoading={isUploadingDocumentCourse || isCreatingDoc}
              />

              {/* Content Area */}
              <div className="mt-8 space-y-6">
                {selectedLesson?.type === "Video" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Nội dung Video</h3>

                    {/* Thumbnail Upload Section - Step 1 */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Thumbnail Video <span className="text-red-500">*</span>
                      </Label>
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
                            onClick={() =>
                              !isUploadingThumnailVideoLesson && thumbnailInputRef.current?.click()
                            }
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
                                <p className="text-sm font-medium text-purple-700">
                                  Đang tải ảnh lên...
                                </p>
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
                          <p>
                            Ảnh bìa giúp bài học của bạn thu hút hơn. Nên sử dụng ảnh có tỷ lệ 16:9.
                          </p>
                          <p className="text-xs text-gray-400">Kích thước khuyến nghị: 1280x720.</p>
                        </div>
                      </div>
                    </div>

                    {/* Video Upload Section - Step 2 (Only visible if Thumbnail exists) */}
                    {videoThumbnailUrl && (
                      <div className="space-y-3 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Label className="text-sm font-medium text-gray-700">
                          Video Bài Học <span className="text-red-500">*</span>
                        </Label>

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
                            {isFakeLoading || isUploadingVideoLesson ? (
                              <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                      <Video className="w-5 h-5 text-purple-600 animate-pulse" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        Đang tải video lên...
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Vui lòng không tắt trình duyệt
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-purple-600">
                                    {uploadProgress}%
                                  </span>
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
                                  onLoadedMetadata={(e) => {
                                    const video = e.currentTarget;
                                    if (video.duration && !isNaN(video.duration)) {
                                      setDurationValue(Math.floor(video.duration));
                                    }
                                  }}
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
                                        videoInputRef.current.value = "";
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
                    {/* Fullscreen Mode */}
                    {isFullScreen && (
                      <div className="fixed inset-0 z-50 bg-gray-100">
                        {editor && (
                          <ToolbarProvider editor={editor}>
                            <div className="flex flex-col h-full overflow-hidden">
                              {/* Toolbar */}
                              <div className="bg-white border-b border-gray-200 shadow-sm">
                                <EditorToolbar
                                  isFullScreen={isFullScreen}
                                  onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                                />
                              </div>
                              {/* Editor Content with Gray Background */}
                              <div
                                className="flex-1 overflow-auto cursor-text"
                                onClick={() => {
                                  if (editor && !editor.isFocused) {
                                    editor.chain().focus().run();
                                  }
                                }}
                              >
                                <div className="max-w-5xl mx-auto py-12 px-8">
                                  <div className="bg-white shadow-2xl rounded-lg min-h-[calc(100vh-200px)]">
                                    <EditorContent
                                      editor={editor}
                                      className="[&_.ProseMirror]:min-h-[calc(100vh-200px)] [&_.ProseMirror]:p-12 [&_.ProseMirror]:focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ToolbarProvider>
                        )}
                      </div>
                    )}
                    {/* Normal Mode */}
                    {!isFullScreen && (
                      <div className="border rounded-lg bg-white shadow-sm min-h-[500px]">
                        {editor && (
                          <ToolbarProvider editor={editor}>
                            <div className="flex flex-col min-h-[500px] border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-400 transition-all">
                              <div className="border-b border-gray-100">
                                <EditorToolbar
                                  isFullScreen={isFullScreen}
                                  onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                                />
                              </div>
                              <div
                                className="bg-white cursor-text"
                                onClick={() => {
                                  if (editor && !editor.isFocused) {
                                    editor.chain().focus().run();
                                  }
                                }}
                              >
                                <EditorContent
                                  editor={editor}
                                  className="min-h-[500px] [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none h-full"
                                />
                              </div>
                            </div>
                          </ToolbarProvider>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedLesson?.type === "Quiz" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Nội dung Quiz</h3>
                      {quizId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuizId("")}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Chọn lại
                        </Button>
                      )}
                    </div>

                    {!quizId ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: Select from Question Bank */}
                        {/* Option 1: Create New Quiz (Config -> Select) */}
                        <div
                          onClick={() => setIsCreateQuizDialogOpen(true)}
                          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md hover:bg-purple-50/30 flex flex-col items-center text-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                            <ClipboardList className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700">
                              Tạo bài kiểm tra
                            </h4>
                            <p className="text-sm text-gray-500">
                              Thiết lập cấu hình và chọn câu hỏi từ ngân hàng
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => setIsCreateQuizAIDialogOpen(true)}
                          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md hover:bg-purple-50/30 flex flex-col items-center text-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700">
                              Tạo bằng AI
                            </h4>
                            <p className="text-sm text-gray-500">
                              Sử dụng AI để tạo bộ câu hỏi tự động từ tài liệu
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-purple-200 bg-purple-50/30 p-6 flex flex-col items-start gap-4 text-left">
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {quiz?.title || "Bài kiểm tra"}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {quiz?.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                                <Clock className="w-3.5 h-3.5 text-purple-600" />
                                <span className="text-xs font-medium text-purple-900">
                                  {quiz?.timeLimitMinutes || 0} phút
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs font-medium text-blue-900">
                                  Đạt: {quiz?.passScorePercent || 0}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                                <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-xs font-medium text-orange-900">
                                  {quiz?.questions?.length || quiz?.questionCount || 0} câu hỏi
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setIsQuizDetailOpen(true)}
                            className="rounded-full hover:bg-gray-200 hover:text-black"
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    )}

                    <CreateQuizDialog
                      open={isCreateQuizDialogOpen}
                      onOpenChange={setIsCreateQuizDialogOpen}
                      // questionIds prop removed - handled internally
                      courseId={courseId}
                      lessonId={lessonId}
                      onConfirm={(newQuizId) => {
                        setQuizId(newQuizId);
                      }}
                    />

                    <CreateQuizAIDialog
                      open={isCreateQuizAIDialogOpen}
                      onOpenChange={setIsCreateQuizAIDialogOpen}
                      courseId={courseId}
                      lessonId={lessonId}
                      sectionTitle={sectionTitle}
                      lessonTitle={selectedLesson?.title || ""}
                      sectionOrder={sectionOrder}
                      lessonOrder={selectedLesson?.orderIndex || 0}
                      onConfirm={(newQuizId) => {
                        setQuizId(newQuizId);
                      }}
                    />

                    <QuizDialog
                      open={isQuizDetailOpen}
                      onOpenChange={setIsQuizDetailOpen}
                      quizId={quizId}
                    />
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
