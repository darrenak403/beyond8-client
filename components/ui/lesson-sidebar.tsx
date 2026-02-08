'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, Play, CheckCircle2, Lock, FileText, Download, ListChecks, ClipboardCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CourseDetail, SectionDetail, LessonType } from '@/lib/api/services/fetchCourse'
import { cn } from '@/lib/utils'
import { Lesson } from '@/lib/api/services/fetchLesson'

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
  onNavigate
}: LessonSidebarProps) {
  const params = useParams() as { slug: string; courseId: string; sectionId?: string; lessonId?: string }
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false)

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
    return `/courses/${slug}/${courseId}/${section.id}/${lesson.id}`
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
              "fixed inset-y-0 right-0 z-40 bg-[#12121a] border-l border-white/10 w-[85vw] sm:w-[400px] shadow-2xl lg:relative lg:block lg:shadow-none flex flex-col h-full",
              isMobile && "top-[64px]"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <h3 className="font-bold text-lg text-white">Nội dung khóa học</h3>
            </div>

            <div
              className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="space-y-4">
                {/* Course Documents */}
                {course.documents && course.documents.length > 0 && (
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 text-left">
                        <FileText className="w-4 h-4 text-brand-pink" />
                        <span className="text-sm font-medium text-white/90">
                          Tài liệu khóa học
                        </span>
                        <span className="text-xs text-white/50">
                          ({course.documents.length})
                        </span>
                      </div>
                      <span className={cn(
                        "text-white/50 transition-transform",
                        isDocumentsExpanded && "rotate-90"
                      )}>
                        ▶
                      </span>
                    </button>

                    {isDocumentsExpanded && (
                      <div className="border-t border-white/10 p-2 space-y-2">
                        {course.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-white/90 truncate">{doc.title}</div>
                                {doc.description && <div className="text-xs text-white/50 truncate">{doc.description}</div>}
                              </div>
                            </div>
                            {doc.isDownloadable ? (
                              <a
                                href={doc.courseDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-brand-pink transition-colors"
                                title="Tải xuống"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            ) : (
                              <a
                                href={doc.courseDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-brand-pink hover:underline px-2"
                              >
                                Xem
                              </a>
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
                    <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          <span className="text-sm font-medium text-white/90">
                            {section.orderIndex}. {section.title}
                          </span>
                          <span className="text-xs text-white/50">
                            ({section.lessons.length} bài)
                          </span>
                        </div>
                        <span className={cn(
                          "text-white/50 transition-transform",
                          expandedSections[section.id] && "rotate-90"
                        )}>
                          ▶
                        </span>
                      </button>

                      {expandedSections[section.id] && (
                        <div className="border-t border-white/10">
                          {section.lessons.map((lesson) => {
                            const isActive = currentLessonId === lesson.id
                            const lessonUrl = getLessonUrl(section, lesson)
                            const canAccessLesson = isEnrolled || lesson.isPreview

                            const renderLessonIcon = () => {
                              if (!canAccessLesson) return <Lock className="h-4 w-4 text-white/30" />

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
                                <div className="flex-shrink-0">
                                  {renderLessonIcon()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={cn(
                                      "text-sm truncate",
                                      isActive ? "text-white font-medium" : "text-white/70"
                                    )}
                                  >
                                    {lesson.orderIndex}. {lesson.title}
                                  </div>
                                  <div className="text-xs text-white/50 mt-0.5">
                                    {lesson.durationSeconds
                                      ? `${Math.floor(lesson.durationSeconds / 60)}:${String(
                                        lesson.durationSeconds % 60
                                      ).padStart(2, "0")}`
                                      : "N/A"}
                                  </div>
                                </div>
                                {isActive && (
                                  <CheckCircle2 className="h-4 w-4 text-brand-pink flex-shrink-0" />
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
                                      "block px-4 py-2.5 hover:bg-white/5 transition-colors border-l-2 cursor-pointer",
                                      isActive
                                        ? "border-brand-pink bg-white/5"
                                        : "border-transparent"
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
                                    "block px-4 py-2.5 hover:bg-white/5 transition-colors border-l-2",
                                    isActive
                                      ? "border-brand-pink bg-white/5"
                                      : "border-transparent"
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
                                  "block px-4 py-2.5 border-l-2 cursor-not-allowed opacity-60",
                                  isActive
                                    ? "border-brand-pink bg-white/5"
                                    : "border-transparent"
                                )}
                                aria-disabled="true"
                              >
                                {content}
                              </div>
                            )
                          })}

                          {/* Section Assignment */}
                          {('assignmentId' in section && section.assignmentId) && (
                            <div className="block px-4 py-2.5 border-l-2 border-transparent hover:bg-white/5 transition-colors cursor-pointer opacity-70 hover:opacity-100">
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-white/70 truncate">
                                    Bài tập cuối chương
                                  </div>
                                  <div className="text-xs text-white/50 mt-0.5">
                                    Bắt buộc
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-[#12121a] border border-white/10 border-r-0 rounded-l-xl p-2 text-white/70 hover:text-brand-pink shadow-lg hover:pr-4 transition-all"
          onClick={onOpen}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}
    </>
  )
}
