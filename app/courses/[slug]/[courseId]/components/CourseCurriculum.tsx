'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Play,
  Lock,
  FileText,
  ListChecks,
  ClipboardCheck,
  Check,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useMemo } from 'react'
import { CourseSummary, CourseDetail as CourseDetailType, LessonType } from '@/lib/api/services/fetchCourse'
import { useGetCurriculumProgress, useCheckEnrollment } from '@/hooks/useEnroll'

interface CourseCurriculumProps {
  course: CourseSummary | CourseDetailType
  mode?: 'summary' | 'details' | 'preview'
  onLessonSelect?: (sectionId: string, lessonId: string) => void
  enrollmentId?: string
}

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

export default function CourseCurriculum({ course, mode = 'summary', onLessonSelect, enrollmentId }: CourseCurriculumProps) {
  const totalLessons = course.totalLessons || course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
  const totalDuration = formatDuration(course.totalDurationMinutes)
  const params = useParams()
  const slug = params?.slug as string || 'course-slug'
  const courseId = params?.courseId as string || course.id

  // If enrollmentId is not passed, try to fetch it
  const { enrollmentId: fetchedEnrollmentId } = useCheckEnrollment(courseId, { enabled: !enrollmentId })
  const effectiveEnrollmentId = enrollmentId || fetchedEnrollmentId

  const { curriculumProgress } = useGetCurriculumProgress(effectiveEnrollmentId as string, {
    enabled: !!effectiveEnrollmentId
  })

  // Calculate locked lessons
  const lockedLessonIds = useMemo(() => {
    if (!effectiveEnrollmentId || !curriculumProgress) return new Set<string>()

    // Create a map of completion status
    const completionMap = new Map<string, { isCompleted: boolean; isPassed: boolean }>()
    curriculumProgress.sections.forEach(s => {
      s.lessons.forEach(l => {
        completionMap.set(l.lessonId, { isCompleted: l.isCompleted, isPassed: l.isPassed })
      })
      // Add assignment completion status if it exists
      const section = course.sections.find(sec => sec.id === s.sectionId)
      if (section && 'assignmentId' in section && section.assignmentId) {
        completionMap.set(section.assignmentId, { isCompleted: s.assignmentPassed, isPassed: s.assignmentPassed })
      }
    })

    const locked = new Set<string>()
    let foundFirstIncomplete = false

    // Traverse course structure to determine locks based on linear progression
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (foundFirstIncomplete) {
          locked.add(lesson.id)
          continue
        }

        const progress = completionMap.get(lesson.id)

        // Determine if lesson is effectively "done" based on type
        // Quiz: must be passed
        // Others: must be completed
        let isEffectivelyDone = false
        if (progress) {
          if (lesson.type === LessonType.Quiz) {
            isEffectivelyDone = progress.isPassed
          } else {
            isEffectivelyDone = progress.isCompleted
          }
        }

        if (!isEffectivelyDone) {
          foundFirstIncomplete = true
          // This lesson is the "current" one, so it's accessible.
          // Subsequent ones will be locked.
        }
      }

      // Check Section Assignment Locking
      if (foundFirstIncomplete && 'assignmentId' in section && section.assignmentId) {
        locked.add(section.assignmentId)
      } else if ('assignmentId' in section && section.assignmentId) {
        // Check if assignment is passed
        const assignmentProgress = completionMap.get(section.assignmentId)
        if (!assignmentProgress?.isPassed) {
          foundFirstIncomplete = true
        }
      }
    }
    return locked
  }, [course.sections, curriculumProgress, effectiveEnrollmentId])

  const sectionProgressMap = new Map(
    curriculumProgress?.sections.map(section => [section.sectionId, section]) || []
  )
  const lessonProgressMap = new Map<string, { isCompleted: boolean }>()
  const assignmentProgressMap = new Map<string, { isPassed: boolean }>()
  curriculumProgress?.sections.forEach(section => {
    section.lessons.forEach(lesson => {
      lessonProgressMap.set(lesson.lessonId, { isCompleted: lesson.isCompleted })
    })
    // Add assignment progress
    const courseSection = course.sections.find(s => s.id === section.sectionId)
    if (courseSection && 'assignmentId' in courseSection && courseSection.assignmentId) {
      assignmentProgressMap.set(courseSection.assignmentId, { isPassed: section.assignmentPassed })
    }
  })

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
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline data-[state=open]:bg-brand-purple/5">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-brand-dark flex items-center gap-2">
                      {section.title}
                      {sectionProgressMap.get(section.id)?.isCompleted && (
                        <Badge variant="outline" className="text-[10px] border-green-500 text-green-600 bg-green-50">
                          Hoàn thành
                        </Badge>
                      )}
                    </div>
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


                    // Determine lock status
                    const isLocked = mode !== 'preview' && effectiveEnrollmentId && lockedLessonIds.has(lesson.id)
                    const isPreviewLesson = lesson.isPreview

                    // In preview mode, all lessons are accessible
                    // Otherwise: preview lessons are accessible, or enrolled users can access unlocked lessons
                    const canAccess = mode === 'preview' || isPreviewLesson || (effectiveEnrollmentId ? !isLocked : false)
                    const canClick = canAccess

                    const lessonProgress = lessonProgressMap.get(lesson.id)
                    const isLessonCompleted = lessonProgress?.isCompleted || false

                    const renderLessonIcon = () => {
                      // Nếu lesson đã hoàn thành, hiển thị icon tick xanh với background xanh nhạt
                      if (isLessonCompleted) {
                        return (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check className="w-4 h-4" />
                          </div>
                        )
                      }

                      if (!canClick) {
                        return (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )
                      }

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
                            <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
                              <FileText className="w-3.5 h-3.5" />
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
                        className={cn(
                          "flex items-center gap-4 px-6 py-3.5 transition-colors group",
                          canClick ? "hover:bg-muted/30 cursor-pointer" : "opacity-60 cursor-not-allowed bg-gray-50/50"
                        )}
                      >
                        <div className="shrink-0">
                          {renderLessonIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-medium text-sm transition-colors truncate",
                              canClick ? "text-foreground/80 group-hover:text-brand-magenta" : "text-gray-500"
                            )}>
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
                            <Badge variant="outline" className="text-[10px] uppercase border-brand-pink text-brand-pink hover:bg-brand-pink/5 font-medium px-2 py-0 h-5">
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
                      return onLessonSelect ? (
                        <div
                          key={lesson.id}
                          onClick={() => onLessonSelect(section.id, lesson.id)}
                          className="block cursor-pointer"
                        >
                          {content}
                        </div>
                      ) : (
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

                  {/* Section Assignment */}
                  {('assignmentId' in section && section.assignmentId) && (() => {
                    // Lock assignment if user hasn't enrolled OR if lessons in the section aren't completed
                    const isAssignmentLocked = mode !== 'preview' && (!effectiveEnrollmentId || lockedLessonIds.has(section.assignmentId!))
                    const assignmentProgress = assignmentProgressMap.get(section.assignmentId!)
                    const isAssignmentPassed = assignmentProgress?.isPassed || false

                    if (isAssignmentLocked) {
                      return (
                        <div className="block cursor-not-allowed opacity-60 bg-gray-50/50">
                          <div className="flex items-center gap-4 px-6 py-3.5 border-t border-dashed grayscale">
                            <div className="shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-gray-500 truncate">
                                  Bài tập cuối chương
                                </p>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                Hoàn thành các bài học trước để mở khóa
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    const AssignmentContent = (
                      <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors group border-t border-dashed">
                        <div className="shrink-0">
                          {isAssignmentPassed ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                              <ClipboardCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-medium text-sm transition-colors truncate",
                              isAssignmentPassed ? "text-green-600" : "text-foreground/80 group-hover:text-brand-magenta"
                            )}>
                              Bài tập cuối chương
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {isAssignmentPassed ? "Đã hoàn thành" : "Hoàn thành bài tập để tổng kết phần học này"}
                          </p>
                        </div>
                      </div>
                    )

                    if (onLessonSelect) {
                      return (
                        <div
                          key={`assignment-${section.assignmentId}`}
                          onClick={() => onLessonSelect(section.id, section.assignmentId!)}
                          className="block cursor-pointer"
                        >
                          {AssignmentContent}
                        </div>
                      )
                    }

                    return (
                      <Link href={`/courses/${slug}/${courseId}/${section.id}/asm-attempt/${section.assignmentId}`} className="block cursor-pointer">
                        {AssignmentContent}
                      </Link>
                    )
                  })()}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
