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

interface CourseGridItemProps {
    course: Course
}

export default function CourseGridItem({ course }: CourseGridItemProps) {
    // Format currency
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(course.price)

    return (
        <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden hover:shadow-black/10 transition-all duration-300">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">
                        Đang hoạt động
                    </Badge>
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
                            <span className="text-xs font-semibold">{course.totalDurationMinutes}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 w-fit px-2 py-0.5 rounded-full">
                            <Home className="w-3 h-3" />
                            <span>{course.level}</span>
                            <span className="mx-1">•</span>
                            <span>Online</span>
                        </div>
                        <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors">
                            {course.title}
                        </h3>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-2 grid grid-cols-2 gap-2 items-center">
                    <Button variant="secondary" className="w-full h-9 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Duyệt
                    </Button>
                    <Button variant="destructive" className="w-full h-9 rounded-lg">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Từ chối
                    </Button>
                </div>
                <div className="mt-2">
                    <Button className="w-full h-9 rounded-lg">
                        Xem chi tiết
                    </Button>
                </div>

            </div>
        </div>
    )
}
