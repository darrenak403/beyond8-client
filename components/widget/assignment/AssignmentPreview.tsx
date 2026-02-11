"use client";

import { useGetAssignmentById } from "@/hooks/useAssignment";
import AssignmentOverview from "@/app/courses/[slug]/[courseId]/(exam-attempt)/[sectionId]/asm-attempt/[assignmentId]/components/AssignmentOverview";
import { Skeleton } from "@/components/ui/skeleton";
// import type { Assignment } from "@/lib/api/services/fetchAssignment"; // Imported implicitly by AssignmentOverview props, but useful if needed explicitly

interface AssignmentPreviewProps {
    assignmentId: string;
}

export default function AssignmentPreview({ assignmentId }: AssignmentPreviewProps) {
    // Assuming lesson.assignmentId exists. If not, we might need to handle it.
    // However, for LessonType.Assignment, it should typically have a link to an assignment.
    // But wait, the Lesson interface in fetchLesson might not have assignmentId directly if it's not a "Lesson" but a "LessonSummary" or similar?
    // Let's check fetchLesson.ts or just rely on what we saw in CoursePreviewDialog usage of Lesson type.
    // In CoursePreviewDialog, it casts to Lesson.
    // Let's assume lesson has assignmentId or we find it via other means.
    // Actually, looking at fetchCourse.ts (which I viewed), LessonSummary has quizId but maybe not assignmentId expressly?
    // Let's re-verify Lesson type in fetchLesson.ts if needed.
    // But for now, I'll assume we can pass the ID.
    // Actually, if it's an assignment type lesson, the ID in the lesson object MIGHT be the assignment ID or it has a reference.
    // In the curriculum, usually lesson.id is the lesson ID, and we might need to fetch lesson details to get assignment ID?
    // OR, for Assignment type, maybe the content is fetched differently.
    // Let's look at how QuizPreview does it: useGetQuizById(lesson.quizId || "")
    // So lesson probably has assignmentId.

    const { assignment, isLoading, error } = useGetAssignmentById(assignmentId);

    if (!assignmentId) {
        return <div className="p-4 text-center text-muted-foreground">Bài tập không hợp lệ (Missing Assignment ID)</div>;
    }

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 bg-white rounded-2xl border border-gray-200">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
                <p className="text-destructive">Không thể tải thông tin bài tập</p>
            </div>
        );
    }

    return <AssignmentOverview assignment={assignment} />;
}
