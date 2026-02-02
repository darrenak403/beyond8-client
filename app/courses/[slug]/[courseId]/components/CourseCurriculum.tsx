'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Play,
  Lock,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'

interface CourseCurriculumProps {
  course: CourseSummary | CourseDetailType
}

// Format duration from minutes to readable string
const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  }
  return `${mins}m`
}

export default function CourseCurriculum({ course }: CourseCurriculumProps) {
  const totalLessons = course.totalLessons || course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
  const totalDuration = formatDuration(course.totalDurationMinutes)
  const params = useParams()
  const slug = params?.slug as string || 'course-slug'
  const courseId = params?.courseId as string || course.id

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between mb-4">
           <CardTitle className="text-2xl font-bold">Nội dung khóa học</CardTitle>
           <div className="text-sm text-muted-foreground">
              <span className="font-medium text-brand-dark">{course.sections.length}</span> phần •{' '}
              <span className="font-medium text-brand-dark">{totalLessons}</span> bài học •{' '}
              <span className="font-medium text-brand-dark">{totalDuration}</span> tổng thời lượng
           </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={course.sections[0]?.id}>
          {course.sections.map((section, index) => (
            <AccordionItem 
               key={section.id} 
               value={section.id} 
               className="border rounded-xl bg-card overflow-hidden data-[state=open]:border-brand-purple/50 transition-all duration-300 hover:border-brand-purple/30"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline [&[data-state=open]]:bg-brand-purple/5">
                <div className="flex items-center gap-4 text-left w-full">
                   <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-sm shrink-0">
                      {index + 1}
                   </div>
                   <div className="flex-1">
                      <div className="font-semibold text-lg text-brand-dark">{section.title}</div>
                      {section.description && (
                         <div className="text-sm text-muted-foreground mt-1 font-normal line-clamp-1">
                            {section.description}
                         </div>
                      )}
                   </div>
                   <div className="text-xs text-muted-foreground font-normal shrink-0 mr-2">
                      {section.lessons.length} bài học
                   </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0 ">
                <div className="divide-y">
                   {section.lessons.map((lesson) => {
                      const lessonUrl = `/courses/${slug}/${courseId}/${section.id}/${lesson.id}`
                      // Handle both Lesson (from summary) and LessonDetail (from details)
                      const lessonDuration = 'durationSeconds' in lesson && lesson.durationSeconds
                        ? formatDuration(Math.floor(lesson.durationSeconds / 60))
                        : 'duration' in lesson && typeof lesson.duration === 'string'
                        ? lesson.duration
                        : '0m'

                      return (
                        <Link 
                           key={lesson.id} 
                           href={lessonUrl}
                           className="block"
                        >
                          <div 
                             className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors group cursor-pointer"
                          >
                             <div className="shrink-0">
                                {lesson.isPreview ? (
                                   <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-colors text-brand-pink">
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                   </div>
                                ) : (
                                   <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                      <Lock className="w-3.5 h-3.5" />
                                   </div>
                                )}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                   <p className="font-medium text-sm text-foreground/80 group-hover:text-brand-magenta transition-colors truncate">
                                      {lesson.title}
                                   </p>
                                </div>
                                {lesson.description && (
                                   <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                      {lesson.description}
                                   </p>
                                )}
                             </div>
                             <div className="flex items-center gap-3 shrink-0">
                                {lesson.isPreview && (
                                   <Badge variant="outline" className="text-[10px] uppercase border-brand-pink/50 text-brand-pink bg-brand-pink/5">
                                      Xem trước
                                   </Badge>
                                )}
                                <span className="text-xs text-muted-foreground tabular-nums opacity-70">
                                   {lessonDuration}
                                </span>
                             </div>
                          </div>
                        </Link>
                      )
                   })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
