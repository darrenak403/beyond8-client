import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Trash2,
    Home,
    CheckCircle2,
    Clock
} from 'lucide-react'
import { Course } from '@/lib/api/services/fetchCourse'

interface CourseListItemProps {
    course: Course
}

export default function CourseListItem({ course }: CourseListItemProps) {
    // Format currency
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(course.price)

    // Format duration from minutes to hours
    const formattedDuration = `${Math.floor(course.totalDurationMinutes / 60)} giờ`

    return (
        <div className="group flex bg-white rounded-xl overflow-hidden border border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-300 p-3 gap-4">
            {/* Image Section */}
            <div className="relative w-72 shrink-0 aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm text-xs h-5 px-1.5">
                        Đang hoạt động
                    </Badge>
                </div>

                {/* Date/Time overlay example (from reference) */}
                <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-white border-0 text-xs h-5 px-1.5 font-normal">
                        19/01/2026 lúc 09:00
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-xl text-primary">
                                {formattedPrice}
                            </h3>
                            <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">{formattedDuration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                                <Home className="w-3 h-3 mr-1" />
                                {course.categoryName}
                            </Badge>
                            <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-200">
                                Bán
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-semibold text-base text-slate-800 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {course.instructorName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
                    {/* Stats removed */}
                </div>
            </div>

            {/* Action Section (Right) */}
            <div className="flex flex-col justify-center gap-2 shrink-0 w-auto pl-4 border-l border-border/50 my-1">
                <Button variant="secondary" className="h-8 text-xs px-3 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Duyệt
                </Button>
                <Button variant="destructive" className="h-8 text-xs px-3 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Từ chối
                </Button>
                <Button variant="default" className="h-8 text-xs px-3 rounded-lg">
                    Xem chi tiết
                </Button>
            </div>
        </div>
    )
}
