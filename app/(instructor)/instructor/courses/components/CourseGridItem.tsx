import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  Edit,
  Eye,
  Home,
  Clock,
  Users
} from 'lucide-react'
import type { Course } from '@/lib/data/mockCourses'

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
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Price & Title */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-xl text-primary truncate">
              {formattedPrice}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{course.duration}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 w-fit px-2 py-0.5 rounded-full">
              <Home className="w-3 h-3" />
              <span>{course.level}</span>
            </div>
            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button variant="outline" className="flex-1 h-9 rounded-xl">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button className="flex-1 h-9 rounded-xl">
            <Eye className="w-4 h-4 mr-2" />
            Xem
          </Button>
        </div>
      </div>
    </div>
  )
}
