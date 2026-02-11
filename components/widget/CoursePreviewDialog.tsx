
import AssignmentPreview from "@/components/widget/assignment/AssignmentPreview";

import { useGetCourseDetailsPreview, useApproveCourse, useRejectCourse } from "@/hooks/useCourse";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import CourseDetail from "@/app/courses/[slug]/[courseId]/components/CourseDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import VideoLesson from "@/app/courses/[slug]/[courseId]/(learning)/[sectionId]/[lessonId]/components/VideoLesson";
import TextLesson from "@/app/courses/[slug]/[courseId]/(learning)/[sectionId]/[lessonId]/components/TextLesson";
import QuizPreview from "@/components/widget/quiz/QuizPreview";
import LessonInfo from "@/app/courses/[slug]/[courseId]/(learning)/[sectionId]/[lessonId]/components/LessonInfo";
import { ArrowLeft, X, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionDetail, LessonType, CourseStatus } from "@/lib/api/services/fetchCourse";
import LessonSidebar from "@/components/ui/lesson-sidebar";
import { formatHls } from "@/lib/utils/formatHls";
import { Lesson } from "@/lib/api/services/fetchLesson";
import { CourseActionDialog } from "@/app/(admin)/admin/course/components/CourseActionDialog";

interface CoursePreviewDialogProps {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    instructor?: {
        name: string;
        avatar?: string;
        bio?: string;
    }
    isAdmin?: boolean; // New prop for Admin Mode
}

export function CoursePreviewDialog({
    courseId,
    open,
    onOpenChange,
    instructor,
    isAdmin = false
}: CoursePreviewDialogProps) {
    const {
        courseDetailsPreview,
        isLoading,
        isError,
    } = useGetCourseDetailsPreview(courseId, { enabled: open });

    const { approveCourse, isPending: isApproving } = useApproveCourse()
    const { rejectCourse, isPending: isRejecting } = useRejectCourse()


    const [selectedLesson, setSelectedLesson] = useState<{ sectionId: string, lessonId: string } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const handleLessonSelect = (sectionId: string, lessonId: string) => {
        setSelectedLesson({ sectionId, lessonId });
    };

    const handleNavigate = (sectionId: string, lessonId: string) => {
        setSelectedLesson({ sectionId, lessonId });
    };

    // Find current lesson data if selected
    let currentLessonData: Lesson | undefined;
    let currentSectionData: SectionDetail | undefined;
    if (selectedLesson && courseDetailsPreview) {
        const section = (courseDetailsPreview.sections as SectionDetail[]).find(s => s.id === selectedLesson.sectionId);
        currentSectionData = section;
        currentLessonData = section?.lessons.find(l => l.id === selectedLesson.lessonId) as Lesson | undefined;
    }

    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedLesson) {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedLesson]);

    const handleApproveConfirm = async (note: string | null) => {
        if (!courseId) return;
        await approveCourse({ id: courseId, notes: note });
        setIsApproveOpen(false);
        onOpenChange(false);
    }

    const handleRejectConfirm = async (reason: string | null) => {
        if (!courseId) return;
        await rejectCourse({ id: courseId, reason: reason });
        setIsRejectOpen(false);
        onOpenChange(false);
    }

    const isPendingStatus = courseDetailsPreview?.status === CourseStatus.PendingApproval;

    return (
        <Sheet open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setSelectedLesson(null); // Reset when closing
        }}>
            <SheetContent side="bottom" className="h-[calc(100vh-3rem)] p-0 rounded-t-xl gap-0 border-none bg-transparent shadow-none [&>button]:hidden" size="full">
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="h-full flex flex-col bg-white rounded-t-xl overflow-hidden relative"
                >
                    <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-50">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                    <SheetHeader className={`px-4 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0 ${selectedLesson ? "py-2" : "py-3"}`}>
                        <div className="flex items-center gap-4">
                            {selectedLesson ? (
                                <Button variant="link" size="sm" onClick={() => setSelectedLesson(null)} className="my-0 py-0">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại khóa học
                                </Button>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <SheetTitle>Xem trước khóa học</SheetTitle>
                                    {/* Admin Actions in Header */}
                                    {isAdmin && isPendingStatus && !isLoading && courseDetailsPreview && (
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                size="sm"
                                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                                onClick={() => setIsApproveOpen(true)}
                                                disabled={isApproving || isRejecting}
                                            >
                                                {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                Duyệt ngay
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 gap-2"
                                                onClick={() => setIsRejectOpen(true)}
                                                disabled={isApproving || isRejecting}
                                            >
                                                {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </SheetHeader>

                    <ScrollArea className="h-full max-h-[calc(100vh-8rem)] bg-white">
                        {isLoading ? (
                            <div className="container mx-auto px-4 py-8">
                                <Skeleton className="h-96 w-full mb-8" />
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-4">
                                        <Skeleton className="h-64 w-full" />
                                        <Skeleton className="h-64 w-full" />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <Skeleton className="h-96 w-full" />
                                    </div>
                                </div>
                            </div>
                        ) : isError || !courseDetailsPreview ? (
                            <div className="flex items-center justify-center h-full min-h-[50vh]">
                                <p className="text-muted-foreground">Không thể tải thông tin khóa học</p>
                            </div>
                        ) : (
                            <div className="bg-white min-h-full">
                                <div ref={topRef} />
                                {selectedLesson && (currentLessonData || currentSectionData?.assignmentId === selectedLesson.lessonId) ? (
                                    <div className="w-full px-4 relative">
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
                                            <div className="lg:col-span-3 space-y-8">
                                                {currentLessonData && currentLessonData.type === LessonType.Video && (
                                                    <VideoLesson
                                                        lessonId={currentLessonData.id}
                                                        title={currentLessonData.title}
                                                        description={currentLessonData.description}
                                                        videoUrl={
                                                            (currentLessonData.hlsVariants
                                                                ? formatHls(currentLessonData.hlsVariants) : currentLessonData.videoOriginalUrl) || undefined
                                                        }
                                                        durationSeconds={
                                                            'durationSeconds' in currentLessonData ? currentLessonData.durationSeconds : null
                                                        }
                                                        thumbnailUrl={currentLessonData.videoThumbnailUrl}
                                                        originVideoUrl={currentLessonData.videoOriginalUrl || ''}
                                                        isDownloadable={'isDownloadable' in currentLessonData ? currentLessonData.isDownloadable : false}
                                                    />
                                                )}
                                                {currentLessonData && currentLessonData.type === LessonType.Text && (
                                                    <TextLesson
                                                        lessonId={currentLessonData.id}
                                                        title={currentLessonData.title}
                                                        content={currentLessonData.textContent}
                                                    />
                                                )}
                                                {currentLessonData && currentLessonData.type === LessonType.Quiz && (
                                                    <QuizPreview lesson={currentLessonData} />
                                                )}
                                                {currentSectionData?.assignmentId === selectedLesson.lessonId && (
                                                    <AssignmentPreview assignmentId={currentSectionData.assignmentId} />
                                                )}
                                                {currentLessonData && currentLessonData.type !== LessonType.Quiz && (
                                                    <LessonInfo
                                                        course={courseDetailsPreview}
                                                        currentLesson={currentLessonData}
                                                        slug={courseDetailsPreview.slug}
                                                        courseId={courseDetailsPreview.id}
                                                        onNavigate={handleNavigate}
                                                        instructor={instructor}
                                                    />
                                                )}
                                            </div>
                                            <div className="lg:col-span-1 relative">
                                                <div className="sticky top-4 h-[calc(100vh-12rem)] overflow-hidden rounded-xl border border-gray-200">
                                                    <LessonSidebar
                                                        course={courseDetailsPreview}
                                                        slug={courseDetailsPreview.slug}
                                                        courseId={courseDetailsPreview.id}
                                                        isEnrolled={true}
                                                        isSidebarOpen={isSidebarOpen}
                                                        isMobile={false}
                                                        onClose={() => setIsSidebarOpen(false)}
                                                        onOpen={() => setIsSidebarOpen(true)}
                                                        currentLessonId={currentLessonData?.id || selectedLesson.lessonId}
                                                        onNavigate={handleNavigate}
                                                        mode="preview"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <CourseDetail
                                        courseData={courseDetailsPreview}
                                        mode="preview"
                                        onLessonSelect={handleLessonSelect}
                                        instructor={instructor}
                                    />
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </motion.div>
            </SheetContent>

            {/* Course Action Dialogs */}
            <CourseActionDialog
                open={isApproveOpen}
                onOpenChange={setIsApproveOpen}
                title="Phê duyệt khóa học"
                description="Bạn có chắc chắn muốn phê duyệt khóa học này công khai không?"
                confirmLabel="Phê duyệt"
                onConfirm={handleApproveConfirm}
                isLoading={isApproving}
                placeholder="Nhập ghi chú phê duyệt (tùy chọn)..."
            />

            <CourseActionDialog
                open={isRejectOpen}
                onOpenChange={setIsRejectOpen}
                title="Sắp từ chối khóa học"
                description="Bạn có chắc chắn muốn từ chối khóa học này không? Vui lòng cung cấp lý do để giảng viên có thể sửa đổi."
                confirmLabel="Từ chối"
                onConfirm={handleRejectConfirm}
                isLoading={isRejecting}
                variant="destructive"
                placeholder="Nhập lý do từ chối..."
            />
        </Sheet>
    );
}
