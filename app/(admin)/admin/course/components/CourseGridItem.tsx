import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Star,
    Users,
    Clock,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Home,
    CheckCircle2
} from 'lucide-react'
import type { Course } from '@/lib/data/mockCourses'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                    src={course.image}
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
                        {course.category}
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

                {/* Stats Divider */}
                <div className="h-px w-full bg-slate-100" />

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 py-0.5">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors">
                        <Clock className="w-4 h-4 mb-1 text-slate-400 group-hover:text-primary" />
                        <span className="text-xs font-semibold text-slate-700">{course.duration}</span>
                        <span className="text-[10px] text-slate-400">Thời lượng</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors">
                        <Users className="w-4 h-4 mb-1 text-slate-400 group-hover:text-primary" />
                        <span className="text-xs font-semibold text-slate-700">{course.students}</span>
                        <span className="text-[10px] text-slate-400">Học viên</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors">
                        <Star className="w-4 h-4 mb-1 text-slate-400 group-hover:text-primary" />
                        <span className="text-xs font-semibold text-slate-700">{course.rating}</span>
                        <span className="text-[10px] text-slate-400">Đánh giá</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-2 grid grid-cols-1 gap-2 items-center">
                    <Button className="w-full bg-black hover:bg-slate-800 text-white h-9 rounded-lg">
                        Xem
                    </Button>
                </div>

            </div>
        </div>
    )
}
