'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, Play, Lock, FileText, Download, ListChecks, ClipboardCheck, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CourseDetail, SectionDetail, LessonType } from '@/lib/api/services/fetchCourse'
import { cn } from '@/lib/utils'
import { useCheckEnrollment, useGetCurriculumProgress } from '@/hooks/useEnroll'
import { Lesson } from '@/lib/api/services/fetchLesson'
import { Badge } from '@/components/ui/badge'
import DocumentDownloadButton from './document-download-button'
import DocumentViewDialog from '../widget/document/DocumentViewDialog'

interface LessonSidebarProps {
  course: CourseDetail
  slug: string
  courseId: string
  isEnrolled: boolean
  isSidebarOpen: boolean
  isMobile: boolean
  onClose: () => void
  onOpen: () => void
  currentLessonId?: string
  onNavigate?: (sectionId: string, lessonId: string) => void
  mode?: 'default' | 'preview'
}

export default function LessonSidebar({
  course,
  slug,
  courseId,
  isEnrolled,
  isSidebarOpen,
  isMobile,
  onOpen,
  currentLessonId: propLessonId,
  onNavigate,
  mode = 'default'
}: LessonSidebarProps) {
  const params = useParams() as { slug: string; courseId: string; sectionId?: string; lessonId?: string }
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string, isDownloadable: boolean } | null>(null)

  // Fetch enrollment data to get ID
  const { enrollmentId } = useCheckEnrollment(courseId, { enabled: isEnrolled })
  // Fetch curriculum progress
  const { curriculumProgress } = useGetCurriculumProgress(enrollmentId as string, { enabled: !!enrollmentId })

  // Create a map of completion status (for lessons and assignments)
  const completionMap = useMemo(() => {
    if (!isEnrolled || !curriculumProgress) return new Map<string, { isCompleted: boolean; isPassed: boolean }>()

    const map = new Map<string, { isCompleted: boolean; isPassed: boolean }>()
    curriculumProgress.sections.forEach(s => {
      s.lessons.forEach(l => {
        map.set(l.lessonId, { isCompleted: l.isCompleted, isPassed: l.isPassed })
      })
      // Add assignment completion status if it exists
      if ('assignmentId' in course.sections.find(sec => sec.id === s.sectionId)!) {
        const section = course.sections.find(sec => sec.id === s.sectionId)
        if (section && 'assignmentId' in section && section.assignmentId) {
          map.set(section.assignmentId, { isCompleted: s.assignmentPassed, isPassed: s.assignmentPassed })
        }
      }
    })
    return map
  }, [curriculumProgress, isEnrolled, course.sections])

  // Calculate locked lessons
  const lockedLessonIds = useMemo(() => {
    if (!isEnrolled) return new Set<string>()

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
      // If any lesson in this section is incomplete OR if we already found an incomplete lesson before this section
      // Then the assignment is locked.
      // Note: foundFirstIncomplete covers "before this section" AND "in this section".
      // But we need to make sure we lock it if it's the *next* thing after the lessons.
      if (foundFirstIncomplete && section.assignmentId) {
        locked.add(section.assignmentId)
      } else if (section.assignmentId) {
        // Check if assignment is passed
        const assignmentProgress = completionMap.get(section.assignmentId)
        if (!assignmentProgress?.isPassed) {
          foundFirstIncomplete = true
        }
      }
    }
    return locked
  }, [course.sections, completionMap, isEnrolled])

  // Determine effective IDs (prop takes precedence over params)
  const currentLessonId = propLessonId || params.lessonId
  const currentSectionId = useMemo(() => {
    if (propLessonId) {
      return course.sections.find(s => s.lessons.some(l => l.id === propLessonId))?.id
    }
    return params.sectionId
  }, [propLessonId, params.sectionId, course.sections])

  // Find current lesson using useMemo
  const currentLesson = useMemo(() => {
    if (currentSectionId && currentLessonId) {
      const section = course.sections.find(s => s.id === currentSectionId)
      return section?.lessons.find(l => l.id === currentLessonId) || null
    }
    return null
  }, [currentSectionId, currentLessonId, course.sections])

  // Initialize expanded sections - only expand new section, keep existing ones
  useEffect(() => {
    if (currentLesson && currentSectionId) {
      setExpandedSections(prev => ({
        ...prev,
        [currentSectionId]: true
      }))
    } else if (course.sections.length > 0 && Object.keys(expandedSections).length === 0) {
      // Only set initial if no sections are expanded
      setExpandedSections({ [course.sections[0].id]: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSectionId, currentLessonId])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const getLessonUrl = (section: SectionDetail, lesson: Lesson) => {
    let baseUrl = `/courses/${slug}/${courseId}/${section.id}/${lesson.id}`

    if (lesson.type === LessonType.Quiz) {
      baseUrl += `/quiz-attempt?quizId=${lesson.quizId}`
    }

    return mode === 'preview' ? `${baseUrl}?source=summary` : baseUrl
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            key="lesson-sidebar-container"
            initial={isMobile && !isSidebarOpen ? { x: '100%' } : false}
            animate={isMobile ? { x: 0 } : { width: 400, opacity: 1 }}
            exit={isMobile ? { x: '100%' } : { width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 right-0 z-40 bg-white border-l border-gray-200 w-[85vw] sm:w-[500px] shadow-2xl lg:relative lg:block lg:shadow-none flex flex-col h-full",
              isMobile && "top-[64px]"
            )}
          >
            <div className="flex items-center justify-between p-6 shrink-0">
              <h3 className="font-bold text-xl text-black">Nội dung khóa học</h3>
            </div>

            <div
              className="flex-1 overflow-y-auto px-4 pb-4"
            >
              <div className="space-y-6">
                {/* Course Documents */}
                {course.documents && course.documents.length > 0 && (
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <button
                      onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 text-left">
                        <FileText className="w-4 h-4 text-brand-pink" />
                        <span className="text-sm font-medium text-gray-900">
                          Tài liệu khóa học
                        </span>
                        <span className="text-xs text-gray-500">
                          ({course.documents.length})
                        </span>
                      </div>
                      <span className={cn(
                        "text-gray-500 transition-transform",
                        isDocumentsExpanded && "rotate-90"
                      )}>
                        ▶
                      </span>
                    </button>

                    {isDocumentsExpanded && (
                      <div className="border-t border-gray-50 p-3 space-y-2">
                        {course.documents.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDoc({ url: doc.courseDocumentUrl, title: doc.title, isDownloadable: doc.isDownloadable })}
                            className="flex items-center justify-between p-3 rounded-xl border border-transparent bg-gray-50/50 hover:bg-gray-100/80 hover:border-gray-100 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate group-hover:text-brand-pink transition-colors">{doc.title}</div>
                                {doc.description && <div className="text-xs text-gray-500 truncate">{doc.description}</div>}
                              </div>
                            </div>
                            {doc.isDownloadable && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <DocumentDownloadButton
                                  url={doc.courseDocumentUrl}
                                  title={doc.title}
                                  className="p-2 hover:bg-gray-200 rounded-full text-gray-600 hover:text-brand-pink transition-colors block"
                                >
                                  <Download className="w-4 h-4" />
                                </DocumentDownloadButton>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sections List */}
                <div className="space-y-2">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          <span className="text-sm font-medium text-gray-900">
                            {section.orderIndex}. {section.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({section.lessons.length} bài)
                          </span>
                        </div>
                        <span className={cn(
                          "text-gray-500 transition-transform",
                          expandedSections[section.id] && "rotate-90"
                        )}>
                          ▶
                        </span>
                      </button>

                      {expandedSections[section.id] && (
                        <div className="border-t border-gray-50 p-2 space-y-1">
                          {section.lessons.map((lesson) => {
                            const isActive = currentLessonId === lesson.id
                            const lessonUrl = getLessonUrl(section, lesson)
                            // Lesson is accessible if:
                            // 1. It is preview (always accessible)
                            // 2. It is NOT locked by progress (if enrolled)

                            const isProgressLocked = isEnrolled && lockedLessonIds.has(lesson.id)
                            const isEnrollLocked = !isEnrolled && !lesson.isPreview
                            const isLocked = isProgressLocked || isEnrollLocked
                            const canAccessLesson = !isLocked

                            const renderLessonIcon = () => {
                              if (!canAccessLesson) return <Lock className="h-4 w-4 text-gray-400" />

                              const progress = completionMap.get(lesson.id)
                              const isCompleted = progress?.isCompleted || (lesson.type === LessonType.Quiz && progress?.isPassed)

                              if (isCompleted) {
                                return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              }

                              switch (lesson.type) {
                                case LessonType.Video:
                                  return <Play className="h-4 w-4 text-brand-pink" />
                                case LessonType.Text:
                                  return <FileText className="h-4 w-4 text-brand-purple" />
                                case LessonType.Quiz:
                                  return <ListChecks className="h-4 w-4 text-brand-magenta" />
                                default:
                                  return <Play className="h-4 w-4 text-brand-pink" />
                              }
                            }

                            const content = (
                              <div className="flex items-center gap-2">
                                <div className="shrink-0">
                                  {renderLessonIcon()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={cn(
                                      "text-sm truncate",
                                      isActive ? "text-black font-medium" : "text-gray-700",
                                      !canAccessLesson && "text-gray-400",
                                      (completionMap.get(lesson.id)?.isCompleted || (lesson.type === LessonType.Quiz && completionMap.get(lesson.id)?.isPassed)) && !isActive && "text-emerald-600"
                                    )}
                                  >
                                    {lesson.orderIndex}. {lesson.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {lesson.durationSeconds
                                      ? `${Math.floor(lesson.durationSeconds / 60)}:${String(
                                        lesson.durationSeconds % 60
                                      ).padStart(2, "0")}`
                                      : "N/A"}
                                  </div>
                                </div>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="mr-2 text-[10px] px-2 py-0 h-5 border-brand-pink text-brand-pink hover:bg-brand-pink/5 uppercase font-medium">Xem trước</Badge>
                                )}
                              </div>
                            )

                            if (canAccessLesson) {
                              if (onNavigate) {
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => onNavigate(section.id, lesson.id)}
                                    className={cn(
                                      "block px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                                      isActive
                                        ? "bg-brand-purple/10 text-brand-purple shadow-sm ring-1 ring-black/5"
                                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                    )}
                                  >
                                    {content}
                                  </div>
                                )
                              }
                              return (
                                <Link
                                  key={lesson.id}
                                  href={lessonUrl}
                                  className={cn(
                                    "block px-3 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                      ? "bg-brand-purple/10 text-brand-purple shadow-sm ring-1 ring-black/5"
                                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                  )}
                                >
                                  {content}
                                </Link>
                              )
                            }

                            return (
                              <div
                                key={lesson.id}
                                className={cn(
                                  "block px-3 py-3 rounded-xl cursor-not-allowed opacity-50 grayscale",
                                  isActive
                                    ? "bg-gray-100" // Should probably not highlight if locked, but if active somehow?
                                    : "transparent"
                                )}
                                aria-disabled="true"
                              >
                                {content}
                              </div>
                            )
                          })}

                          {/* Section Assignment */}
                          {('assignmentId' in section && section.assignmentId) && (() => {
                            const isAssignmentLocked = !isEnrolled || (isEnrolled && lockedLessonIds.has(section.assignmentId!))
                            const assignmentProgress = completionMap.get(section.assignmentId!)
                            const isAssignmentPassed = assignmentProgress?.isPassed || false

                            if (isAssignmentLocked) {
                              return (
                                <div className="block px-3 py-3 rounded-xl cursor-not-allowed opacity-50 grayscale bg-gray-100">
                                  <div className="flex items-center gap-2">
                                    <div className="shrink-0">
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-500 truncate">
                                        Bài tập cuối chương
                                      </div>
                                      <div className="text-xs text-gray-400 mt-0.5 font-medium">
                                        Hoàn thành các bài học trước để mở khóa
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            if (onNavigate) {
                              return (
                                <div
                                  key={`assignment-${section.assignmentId}`}
                                  onClick={() => onNavigate(section.id, section.assignmentId!)}
                                  className="block px-3 py-3 rounded-xl hover:bg-amber-50/50 transition-colors cursor-pointer opacity-80 hover:opacity-100 group/assign"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="shrink-0">
                                      {isAssignmentPassed ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                      ) : (
                                        <ClipboardCheck className="h-5 w-5 text-amber-500 group-hover/assign:scale-110 transition-transform" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={cn(
                                        "text-sm font-medium truncate",
                                        isAssignmentPassed ? "text-emerald-600" : "text-gray-800"
                                      )}>
                                        Bài tập cuối chương
                                      </div>
                                      <div className="text-xs text-amber-600/80 mt-0.5 font-medium">
                                        {isAssignmentPassed ? "Đã hoàn thành" : "Bắt buộc"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <Link
                                key={`assignment-${section.assignmentId}`}
                                href={`/courses/${slug}/${courseId}/${section.id}/asm-attempt/${section.assignmentId}`}
                                className="block px-3 py-3 rounded-xl hover:bg-amber-50/50 transition-colors cursor-pointer opacity-80 hover:opacity-100 group/assign"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="shrink-0">
                                    {isAssignmentPassed ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <ClipboardCheck className="h-5 w-5 text-amber-500 group-hover/assign:scale-110 transition-transform" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={cn(
                                      "text-sm font-medium truncate",
                                      isAssignmentPassed ? "text-emerald-600" : "text-gray-800"
                                    )}>
                                      Bài tập cuối chương
                                    </div>
                                    <div className="text-xs text-amber-600/80 mt-0.5 font-medium">
                                      {isAssignmentPassed ? "Đã hoàn thành" : "Bắt buộc"}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar Button (Desktop - When Closed) */}
      {!isSidebarOpen && !isMobile && (
        <motion.button
          initial={{ marginRight: -50 }}
          animate={{ marginRight: 0 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 border-r-0 rounded-l-xl p-2 text-gray-700 hover:text-brand-pink shadow-lg hover:pr-4 transition-all"
          onClick={onOpen}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}
      {/* Document Viewer Dialog */}
      <DocumentViewDialog
        open={!!selectedDoc}
        onOpenChange={(open: boolean) => !open && setSelectedDoc(null)}
        url={selectedDoc?.url || null}
        title={selectedDoc?.title}
        isDownloadable={selectedDoc?.isDownloadable}
      />
    </>
  )
}
