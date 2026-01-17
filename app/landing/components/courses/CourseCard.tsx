import Image from 'next/image'
import {Badge} from '@/components/ui/badge'
import {Star, Users, Clock} from 'lucide-react'
import type {Course} from '@/lib/data/mockCourses'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({course}: CourseCardProps) {
  return (
    <div className="group cursor-pointer h-full flex flex-col">
      {/* Image - Square aspect ratio */}
      <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-primary rounded-xl">
          {course.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Badge variant="outline" className="rounded-lg">
            {course.level}
          </Badge>
          <span className="text-2xl font-bold text-primary">
            {course.price.toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  )
}
