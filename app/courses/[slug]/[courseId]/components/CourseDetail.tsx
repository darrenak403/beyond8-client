'use client'

import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'
import CourseHero from './CourseHero'
import CourseSidebar from './CourseSidebar'
import CourseCurriculum from './CourseCurriculum'
import CourseDescription from './CourseDescription'
interface CourseDetailProps {
  courseData: CourseSummary | CourseDetailType
}

export default function CourseDetail({ courseData }: CourseDetailProps) {
  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section - Full Width */}
      <CourseHero course={courseData} />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description & Outcomes */}
            <div id="description">
               <CourseDescription course={courseData} />
            </div>

            {/* Curriculum */}
            <div id="curriculum" className="scroll-mt-24">
               <CourseCurriculum course={courseData} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 relative">
             <CourseSidebar course={courseData} />
          </div>
        </div>
      </div>
    </div>
  )
}
