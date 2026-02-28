'use client'

import { Menu, X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CourseDetail } from '@/lib/api/services/fetchCourse'
import { courseUrl } from '@/utils/courseUrls'

interface LessonHeaderProps {
  course: CourseDetail
  params: {
    slug: string
    courseId: string
    sectionId: string
  }
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function LessonHeader({ course, params: initialParams, isSidebarOpen, onToggleSidebar }: LessonHeaderProps) {
  const urlParams = useParams() as { slug: string; courseId: string; sectionId: string; lessonId?: string }

  return (
    <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          href={courseUrl(urlParams.slug || initialParams.slug, initialParams.courseId)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Quay lại khóa học</span>
        </Link>
        <div className="h-6 w-px bg-gray-200 hidden sm:block" />
        <h1 className="font-semibold text-sm sm:text-base max-w-[200px] sm:max-w-md truncate">
          {course.title}
        </h1>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-black hover:bg-gray-100 lg:hidden"
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
    </header>
  )
}
