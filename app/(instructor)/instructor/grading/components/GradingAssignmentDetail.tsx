"use client"

import { useState } from "react"
import { useGetAssignmentById, useGetSubmissionSumaryBySection } from "@/hooks/useAssignment"
import { useUserById } from "@/hooks/useUserProfile"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { SubmissionAssigment } from "@/lib/api/services/fetchAssignment"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Eye } from "lucide-react"
import { AssignmentDialog } from "@/components/widget/assignment/AssignmentDialog"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface GradingAssignmentDetailProps {
    assignmentId: string
    onBack: () => void
}

export function GradingAssignmentDetail({ assignmentId, onBack }: GradingAssignmentDetailProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // 1. Get Assignment Details to find Section ID
    const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentById(assignmentId)

    // 2. Get Submissions for the section
    const sectionId = assignment?.sectionId
    const { submissions: sectionData, isLoading: isLoadingSubmissions } = useGetSubmissionSumaryBySection(sectionId || "")

    const router = useRouter()


    if (isLoadingAssignment) {
        return <div className="p-4"><Skeleton className="h-12 w-1/2" /></div>
    }

    if (!assignment) {
        return <div className="p-4 text-red-500">Không tìm thấy bài tập</div>
    }

    // Find the specific assignment data from the section response
    const assignmentsList = sectionData || []
    const assignmentData = Array.isArray(assignmentsList) ? assignmentsList.find(a => a.assignmentId === assignmentId) : null

    if (isLoadingSubmissions && sectionId) {
        return <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
    }

    const submissions: SubmissionAssigment[] = assignmentData?.submissions || []

    return (
        <>
            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">{assignment.title}</h2>
                        <p className="text-muted-foreground mt-1">
                            Tổng số bài nộp: {assignmentData?.totalSubmissions || 0} • Cần chấm: {assignmentData?.ungradedSubmissions || 0}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(true)}
                            className="gap-2 rounded-xl"
                        >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                        </Button>
                        <Button variant="outline" onClick={onBack} className="rounded-xl">Quay lại</Button>
                    </div>
                </div>

                <div className="border rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Học viên</TableHead>
                                <TableHead>Ngày nộp</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Điểm</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length > 0 ? (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">
                                            <StudentInfo studentId={submission.studentId} />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(submission.submittedAt), "dd/MM/yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={submission.status} />
                                        </TableCell>
                                        <TableCell>
                                            {submission.finalScore !== null ? (
                                                <span className="font-bold">{submission.finalScore} / {assignment.totalPoints}</span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={submission.status === 'Graded' ? "outline" : "default"}
                                                onClick={() => {
                                                    router.push(`/instructor/grading/${assignmentId}/submission/${submission.id}`)
                                                }}
                                                className="rounded-xl"
                                            >
                                                {submission.status === 'Graded' ? "Xem lại" : "Chấm điểm"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Chưa có bài nộp nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AssignmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                assignment={assignment}
                sectionId={sectionId || ""}
                readOnly={true}
            />
        </>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'Graded') {
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Đã chấm</Badge>
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> Chờ chấm</Badge>
}

function StudentInfo({ studentId }: { studentId: string }) {
    const { user } = useUserById(studentId)

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{studentId.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{studentId}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={formatImageUrl(user.avatarUrl)} alt={user.fullName} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                    {user.fullName?.charAt(0).toUpperCase() || "S"}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium text-sm">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        </div>
    )
}
