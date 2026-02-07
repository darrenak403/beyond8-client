'use client'

import { useState, useEffect } from 'react'
import { CourseDetail, CourseSummary } from '@/lib/api/services/fetchCourse'
import LessonHeader from '@/components/ui/lesson-header'
import LessonSidebar from '@/components/ui/lesson-sidebar'

interface LearningLayoutClientProps {
  courseId: string
  slug: string
  course: CourseDetail | CourseSummary
  isEnrolled: boolean
  params: {
    slug: string
    courseId: string
    sectionId: string
  }
  children: React.ReactNode
}

export default function LearningLayoutClient({ course, isEnrolled, params: initialParams, children }: LearningLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setIsSidebarOpen(false)
      else setIsSidebarOpen(true)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!course) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-white overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <LessonHeader
          course={course as CourseDetail}
          params={initialParams}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0a0f] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>

      <LessonSidebar
        course={course as CourseDetail}
        slug={initialParams.slug}
        courseId={initialParams.courseId}
        isEnrolled={isEnrolled}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        onOpen={() => setIsSidebarOpen(true)}
      />
    </div>
  )
}
