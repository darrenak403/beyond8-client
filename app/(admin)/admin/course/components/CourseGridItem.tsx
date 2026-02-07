import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Trash2,
    Home,
    CheckCircle2,
    Clock,
    Loader2
} from 'lucide-react'
import { Course, CourseStatus } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import SafeImage from '@/components/ui/SafeImage'
import { useApproveCourse, useRejectCourse } from '@/hooks/useCourse'
import { CourseActionDialog } from './CourseActionDialog'

interface CourseGridItemProps {
    course: Course
    onPreview?: () => void
}

export default function CourseGridItem({ course, onPreview }: CourseGridItemProps) {
    // Format currency
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(course.price)

    const { approveCourse, isPending: isApproving } = useApproveCourse()
    const { rejectCourse, isPending: isRejecting } = useRejectCourse()

    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | null;
    }>({
        open: false,
        type: null
    })

    const handleApproveClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActionDialog({ open: true, type: 'approve' })
    }

    const handleRejectClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActionDialog({ open: true, type: 'reject' })
    }

    const handleConfirmAction = async (note: string | null) => {
        if (actionDialog.type === 'approve') {
            await approveCourse({ id: course.id, notes: note })
        } else if (actionDialog.type === 'reject') {
            await rejectCourse({ id: course.id, reason: note })
        }
        setActionDialog({ open: false, type: null })
    }

    // Status Badge Logic
    const getStatusBadge = (status: CourseStatus) => {
        switch (status) {
            case CourseStatus.PendingApproval:
                return <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 backdrop-blur-sm">Chờ duyệt</Badge>
            case CourseStatus.Published:
                return <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">Đang hoạt động</Badge>
            case CourseStatus.Draft:
                return <Badge className="bg-slate-500/90 hover:bg-slate-500 text-white border-0 backdrop-blur-sm">Nháp</Badge>
            case CourseStatus.Rejected:
                return <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 backdrop-blur-sm">Đã từ chối</Badge>
            case CourseStatus.Approved:
                return <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">Đã duyệt</Badge>
            case CourseStatus.Archived:
                return <Badge className="bg-slate-500/90 hover:bg-slate-500 text-white border-0 backdrop-blur-sm">Đã khóa</Badge>
            case CourseStatus.Suspended:
                return <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-0 backdrop-blur-sm">Tạm ngưng</Badge>
            default:
                return <Badge variant="secondary" className="backdrop-blur-sm">{status}</Badge>
        }
    }

    return (
        <>
            <div
                className="group flex flex-col h-full bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/40"
                onClick={onPreview}
            >
                {/* Image Section */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <SafeImage
                        src={formatImageUrl(course.thumbnailUrl) || ''}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {getStatusBadge(course.status)}
                    </div>

                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-semibold shadow-sm">
                            {course.categoryName}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-4 gap-4">

                    {/* Price & Title */}
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-xl text-primary truncate">
                                {formattedPrice}
                            </h3>
                            <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">{course.totalDurationMinutes} phút</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 w-fit px-2 py-0.5 rounded-full">
                                <Home className="w-3 h-3" />
                                <span>{course.level}</span>
                                <span className="mx-1">•</span>
                                <span>{course.instructorName}</span>
                            </div>
                            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-2 grid grid-cols-2 gap-2 items-center">
                        {course.status === CourseStatus.PendingApproval && (
                            <>
                                <Button
                                    variant="secondary"
                                    className="w-full h-9 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200"
                                    onClick={handleApproveClick}
                                    disabled={isApproving || isRejecting}
                                >
                                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Duyệt
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full h-9 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 shadow-none"
                                    onClick={handleRejectClick}
                                    disabled={isApproving || isRejecting}
                                >
                                    {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Từ chối
                                </Button>
                            </>
                        )}
                        <div className="col-span-2">
                            <Button variant="outline" className="w-full h-9 rounded-lg">
                                Xem chi tiết
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            <CourseActionDialog
                open={actionDialog.open}
                onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}
                title={actionDialog.type === 'approve' ? "Phê duyệt khóa học" : "Từ chối khóa học"}
                description={actionDialog.type === 'approve'
                    ? "Bạn có chắc chắn muốn phê duyệt khóa học này? Bạn có thể để lại ghi chú (không bắt buộc)."
                    : "Bạn có chắc chắn muốn từ chối khóa học này? Vui lòng nhập lý do từ chối (không bắt buộc)."
                }
                confirmLabel={actionDialog.type === 'approve' ? "Phê duyệt" : "Từ chối"}
                variant={actionDialog.type === 'reject' ? "destructive" : "default"}
                isLoading={isApproving || isRejecting}
                onConfirm={handleConfirmAction}
                placeholder={actionDialog.type === 'approve' ? "Nhập ghi chú..." : "Nhập lý do từ chối..."}
            />
        </>
    )
}
