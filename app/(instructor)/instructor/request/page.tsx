'use client'

import React, { useState } from 'react'
import {
    useGetReassignRequests,
    useResetQuizAttempt,
    useResetAssignmentAttempt,
} from '@/hooks/useReassign'
import { useUserById } from '@/hooks/useUserProfile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { CheckCircle, Clock, FileText, Layout } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { RequestSkeleton } from './components/RequestSkeleton'

export default function InstructorRequestPage() {
    const [params] = useState({
        pageNumber: 1,
        pageSize: 50,
        isDecending: true,
    })

    const { requests, isLoading, refetch } = useGetReassignRequests(params)
    const { resetQuizAttempt, isPending: isResettingQuiz } = useResetQuizAttempt()
    const { resetAssignmentAttempt, isPending: isResettingAssignment } = useResetAssignmentAttempt()

    const handleApprove = async (request: { type: string; sourceId: string; studentId: string }) => {
        try {
            if (request.type === 'Quiz') {
                await resetQuizAttempt({ quizId: request.sourceId, studentId: request.studentId })
            } else {
                await resetAssignmentAttempt({ assignmentId: request.sourceId, studentId: request.studentId })
            }
            refetch()
        } catch (error) {
            console.error('Error approving request:', error)
        }
    }

    if (isLoading) {
        return <RequestSkeleton />
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Layout className="w-8 h-8 text-brand-magenta" />
                    Yêu cầu cấp lại lượt
                </h1>
                <p className="text-muted-foreground mt-2">
                    Quản lý các yêu cầu từ học sinh muốn nộp lại bài hoặc làm lại bài kiểm tra.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-4">Học viên</TableHead>
                            <TableHead className="py-4">Nội dung</TableHead>
                            <TableHead className="py-4">Lý do & Ghi chú</TableHead>
                            <TableHead className="py-4">Ngày yêu cầu</TableHead>
                            <TableHead className="py-4">Trạng thái</TableHead>
                            <TableHead className="py-4 text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <TableRow key={request.id} className="hover:bg-gray-50/30 transition-colors">
                                    <TableCell className="py-4 font-medium">
                                        <StudentInfo studentId={request.studentId} />
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        request.type === 'Quiz'
                                                            ? 'text-blue-600 bg-blue-50 border-blue-100'
                                                            : 'text-amber-600 bg-amber-50 border-amber-100'
                                                    }
                                                >
                                                    {request.type === 'Quiz' ? 'Bài kiểm tra' : 'Bài tập'}
                                                </Badge>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={request.sourceTitle}>
                                                {request.sourceTitle}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-900 font-medium">
                                                {translateReason(request.reason)}
                                            </span>
                                            {request.note && (
                                                <span className="text-xs text-muted-foreground italic truncate max-w-[200px]" title={request.note}>
                                                    &quot;{request.note}&quot;
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-sm text-gray-500">
                                        {format(new Date(request.requestedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <StatusBadge status={request.status} />
                                    </TableCell>
                                    <TableCell className="py-4 text-right">
                                        {request.status === 'Pending' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprove(request)}
                                                disabled={isResettingQuiz || isResettingAssignment}
                                                className="bg-brand-magenta hover:bg-brand-magenta/90 text-white rounded-xl"
                                            >
                                                Chấp nhận
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="w-12 h-12 text-gray-200" />
                                        <p>Chưa có yêu cầu nào cần xử lý</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function StudentInfo({ studentId }: { studentId: string }) {
    const { user } = useUserById(studentId)

    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-100">
                {user?.avatarUrl && (
                    <AvatarImage
                        src={formatImageUrl(user.avatarUrl)}
                        alt={user.fullName}
                        referrerPolicy="no-referrer"
                    />
                )}
                <AvatarFallback className="bg-brand-purple/10 text-brand-purple font-semibold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900">
                    {user?.fullName || 'Đang tải...'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user?.email || studentId}
                </span>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'Approved':
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 px-2">
                    <CheckCircle className="w-3 h-3" /> Đã chấp nhận
                </Badge>
            )
        case 'Pending':
            return (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1 px-2">
                    <Clock className="w-3 h-3" /> Đang chờ
                </Badge>
            )
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

function translateReason(reason: string) {
    const reasons: Record<string, string> = {
        TechnicalIssue: 'Lỗi kỹ thuật',
        UnfairGrading: 'Chấm điểm chưa thỏa đáng',
        NeedMorePractice: 'Cần luyện tập thêm',
        Other: 'Khác',
    }
    return reasons[reason] || reason
}
