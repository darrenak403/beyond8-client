'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Play,
  Lock,
  FileText,
  ClipboardList,
  ListChecks,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseSummary, CourseDetail as CourseDetailType, LessonType } from '@/lib/api/services/fetchCourse'

interface CourseCurriculumProps {
  course: CourseSummary | CourseDetailType
  /**
   * summary: trang public dùng useGetCourseSummary -> chỉ cho xem bài preview
   * details: trang học của học viên (useGetCourseDetails) -> cho truy cập tất cả bài
   */
  mode?: 'summary' | 'details'
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

export default function CourseCurriculum({ course, mode = 'summary' }: CourseCurriculumProps) {
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
                      const baseUrl = `/courses/${slug}/${courseId}/${section.id}/${lesson.id}`
                      
                      // Handle Quiz lessons differently - route to quiz-attempt (without quizId first)
                      let lessonUrl: string
                      if (lesson.type === LessonType.Quiz && 'quizId' in lesson && lesson.quizId) {
                        lessonUrl = `/courses/${slug}/${courseId}/${section.id}/${lesson.id}/quiz-attempt?quizId=${lesson.quizId}`
                      } else {
                        lessonUrl =
                          mode === 'summary'
                            ? `${baseUrl}?source=summary`
                            : `${baseUrl}?source=details`
                      }
                      
                      // Handle both Lesson (from summary) and LessonDetail (from details)
                      const lessonDuration = 'durationSeconds' in lesson && lesson.durationSeconds
                        ? formatDuration(Math.floor(lesson.durationSeconds / 60))
                        : 'duration' in lesson && typeof lesson.duration === 'string'
                        ? lesson.duration
                        : '0m'

                      const canClick =
                        mode === 'details' ? true : lesson.isPreview

                      const renderLessonIcon = () => {
                        // Nếu không click được (bị khóa) thì luôn hiện icon ổ khóa
                        if (!canClick) {
                          return (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )
                        }

                        // Bài học truy cập được: hiển thị icon theo type
                        switch (lesson.type) {
                          case LessonType.Video:
                            return (
                              <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-colors text-brand-pink">
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </div>
                            )
                          case LessonType.Quiz:
                            return (
                              <div className="w-8 h-8 rounded-full bg-brand-magenta/10 flex items-center justify-center text-brand-magenta group-hover:bg-brand-magenta group-hover:text-white transition-colors">
                                <ListChecks className="w-3.5 h-3.5" />
                              </div>
                            )
                          case LessonType.Text:
                            return (
                              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-black transition-colors">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                            )
                          case LessonType.Assignment:
                            return (
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <ClipboardList className="w-3.5 h-3.5" />
                              </div>
                            )
                          default:
                            return (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Play className="w-3.5 h-3.5" />
                              </div>
                            )
                        }
                      }

                      const content = (
                        <div 
                           className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors group"
                        >
                           <div className="shrink-0">
                              {renderLessonIcon()}
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
                      )

                      if (canClick) {
                        return (
                          <Link 
                             key={lesson.id} 
                             href={lessonUrl}
                             className="block cursor-pointer"
                          >
                            {content}
                          </Link>
                        )
                      }

                      return (
                        <div
                           key={lesson.id}
                           className="block opacity-60 cursor-not-allowed"
                           aria-disabled="true"
                        >
                          {content}
                        </div>
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
