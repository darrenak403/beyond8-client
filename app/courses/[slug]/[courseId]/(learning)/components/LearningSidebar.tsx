'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { CheckCircle, PlayCircle, Lock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CourseDetail } from "@/lib/data/mockCourseDetail"
import { watchUrl } from '@/utils/courseUrls'
import { decodeId } from '@/utils/crypto'

export default function LearningSidebar({ course }: { course: CourseDetail }) {
   const params = useParams() as { slug: string; courseId: string; sectionId: string; lessonId: string }
   const currentLessonId = params.lessonId
   const decodedCourseId = decodeId(params.courseId) || ''

   // Find the section containing the current lesson
   const activeSectionId = course.sections.find(s =>
      s.lessons.some(l => l.id === currentLessonId)
   )?.id

   return (
      <div className="w-full">
         <Accordion type="single" collapsible className="w-full" defaultValue={activeSectionId}>
            {course.sections.map((section, index) => (
               <AccordionItem key={section.id} value={section.id} className="border-b border-white/5">
                  <AccordionTrigger className="px-4 py-4 hover:bg-white/5 hover:no-underline transition-colors">
                     <div className="flex flex-col items-start gap-1 text-left">
                        <h4 className="font-semibold text-sm text-white/90">
                           Phần {index + 1}: {section.title}
                        </h4>
                        <span className="text-xs text-white/50">{section.lessons.length} bài học</span>
                     </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                     <div className="flex flex-col">
                        {section.lessons.map((lesson, lIndex) => {
                           const isActive = lesson.id === currentLessonId
                           // Unlock if course is registered, or lesson is preview, or currently active
                           const isLocked = !course.isRegistered && !lesson.isPreview && !isActive

                           return (
                              <Link
                                 key={lesson.id}
                                 href={isLocked ? '#' : watchUrl(params.slug, decodedCourseId, section.id, lesson.id)}
                                 className={cn(
                                    "flex items-start gap-3 px-4 py-3 border-l-2 transition-all duration-200 group relative",
                                    isActive
                                       ? "bg-brand-purple/10 border-brand-pink"
                                       : "border-transparent hover:bg-white/5",
                                    isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                 )}
                              >
                                 <div className={cn(
                                    "mt-0.5",
                                    isActive ? "text-brand-pink" : "text-white/40 group-hover:text-white/70"
                                 )}>
                                    {isActive ? (
                                       <PlayCircle className="w-4 h-4 fill-current" />
                                    ) : isLocked ? (
                                       <Lock className="w-4 h-4" />
                                    ) : (
                                       <CheckCircle className="w-4 h-4" /> // Assume completed for older ones in real app
                                    )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className={cn(
                                       "text-sm font-medium truncate",
                                       isActive ? "text-brand-pink" : "text-white/80"
                                    )}>
                                       {lIndex + 1}. {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="text-xs text-white/40">{lesson.duration}</span>
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
      </div>
   )
}
