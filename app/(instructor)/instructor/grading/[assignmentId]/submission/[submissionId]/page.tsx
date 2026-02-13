"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetAssignmentById, useGetSubmissionSumaryBySection } from "@/hooks/useAssignment"
import { useUserById } from "@/hooks/useUserProfile"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { GradingInterface } from "@/app/(instructor)/instructor/grading/components/GradingInterface"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { AssignmentDialog } from "@/components/widget/assignment/AssignmentDialog"

export default function GradingSubmissionPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const params = useParams()
    const router = useRouter()
    const assignmentId = params.assignmentId as string
    const submissionId = params.submissionId as string

    // Fetch assignment to get sectionId
    const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentById(assignmentId)
    const sectionId = assignment?.sectionId

    // Fetch submissions using sectionId (this fetches all submissions for the section)
    const { submissions: sectionData, isLoading: isLoadingSubmissions } = useGetSubmissionSumaryBySection(sectionId || "")

    // Find the specific submission
    const assignmentsList = sectionData || []
    const assignmentData = Array.isArray(assignmentsList) ? assignmentsList.find(a => a.assignmentId === assignmentId) : null
    const submission = assignmentData?.submissions.find(s => s.id === submissionId)

    // Fetch student profile
    const { user: student } = useUserById(submission?.studentId)

    // Navigation logic
    const submissions = assignmentData?.submissions || []
    const currentIndex = submissions.findIndex(s => s.id === submissionId)
    const prevSubmission = currentIndex > 0 ? submissions[currentIndex - 1] : null
    const nextSubmission = currentIndex < submissions.length - 1 ? submissions[currentIndex + 1] : null

    // Loading State
    if (isLoadingAssignment || (sectionId && isLoadingSubmissions)) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-7xl space-y-6">
                    <Skeleton className="h-12 w-1/3" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-[600px] rounded-xl" />
                        <Skeleton className="h-[600px] rounded-xl" />
                        <Skeleton className="h-[600px] rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    // Error / Not Found State
    if (!assignment) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p>Không tìm thấy bài tập</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p>Không tìm thấy bài nộp hoặc bạn không có quyền truy cập.</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    return (
        <div className="bg-gray-50/50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/instructor/grading?courseId=${assignment?.courseId}&assignmentId=${assignmentId}`)} className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-lg leading-tight line-clamp-1 max-w-[500px]">{assignment.title}</h1>
                        <div className="h-4 w-px bg-border/60 mx-1" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Bài nộp của:</span>
                            {student ? (
                                <div className="flex items-center gap-2 bg-secondary/50 pr-3 pl-1 py-0.5 rounded-full transition-colors">
                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                        <AvatarImage
                                            src={formatImageUrl(student.avatarUrl)}
                                            alt={student.fullName}
                                            referrerPolicy="no-referrer"
                                        />
                                        <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700 font-bold">
                                            {student.fullName?.charAt(0).toUpperCase() || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm text-foreground/80 whitespace-nowrap">{student.fullName}</span>
                                </div>
                            ) : (
                                <span className="text-sm font-medium text-foreground">{submission.studentId}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        className="h-9 px-4 gap-2 rounded-xl"
                    >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                    </Button>
                    <div className="h-4 w-px bg-border/60" />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (prevSubmission) {
                                router.push(`/instructor/grading/${assignmentId}/submission/${prevSubmission.id}`)
                            }
                        }}
                        disabled={!prevSubmission}
                        className="h-9 px-4 gap-2 rounded-xl"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            if (nextSubmission) {
                                router.push(`/instructor/grading/${assignmentId}/submission/${nextSubmission.id}`)
                            }
                        }}
                        disabled={!nextSubmission}
                        className="h-9 px-4 gap-2 rounded-xl"
                    >
                        Tiếp
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Grading Interface */}
            <div className="flex-1 p-6 lg:overflow-hidden overflow-auto">
                <GradingInterface
                    submission={submission}
                    assignment={assignment}
                    onGraded={() => {
                        if (assignment?.courseId) {
                            router.push(`/instructor/grading?courseId=${assignment.courseId}&assignmentId=${assignmentId}`)
                        } else {
                            router.back()
                        }
                    }}
                />
            </div>

            <AssignmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                assignment={assignment}
                sectionId={sectionId || ""}
                readOnly={true}
            />
        </div>
    )
}
