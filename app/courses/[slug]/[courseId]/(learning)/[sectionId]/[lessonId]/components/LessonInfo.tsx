'use client'

import { ChevronLeft, ChevronRight, Download, FileText, MessageCircle, Share2, ThumbsUp, Play, Clock, Trophy, Target, Loader2, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseDetail, CourseSummary } from '@/lib/api/services/fetchCourse'
import { Lesson, LessonType } from '@/lib/api/services/fetchLesson'
import { useGetQuizOverview } from '@/hooks/useQuiz'
import { useGetLessonDocumentForStudent, useGetLessonDocumentPreview } from '@/hooks/useLesson'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { LessonSummary } from '@/lib/api/services/fetchCourse'
import { useState } from 'react'
import DocumentViewDialog from '@/components/widget/document/DocumentViewDialog'
import DocumentDownloadButton from '@/components/ui/document-download-button'

interface LessonInfoProps {
  course: CourseDetail | CourseSummary
  currentLesson: Lesson | LessonSummary
  slug: string
  courseId: string
  onNavigate?: (sectionId: string, lessonId: string) => void
  instructor?: {
    name: string
    avatar?: string
    bio?: string
  }
}

export default function LessonInfo({ course, currentLesson, slug, courseId, onNavigate, instructor }: LessonInfoProps) {

  // Find prev/next lesson
  const allLessons = course.sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: s.id })))
  // We need to cast currentLesson.id as it might be from the stricter Lesson type, but allLessons are LessonDetail
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Fetch quiz details if present
  const isQuizLesson = currentLesson.type === LessonType.Quiz;
  const quizId = isQuizLesson && 'quizId' in currentLesson ? currentLesson.quizId : null;

  const { quizOverview, isLoading: isLoadingQuiz } = useGetQuizOverview(quizId || "")

  // Fetch lesson documents
  const { lessonDocuments: studentDocs, isLoading: isLoadingStudent } = useGetLessonDocumentForStudent(currentLesson.id)
  const { lessonDocuments: previewDocs, isLoading: isLoadingPreview } = useGetLessonDocumentPreview(currentLesson.id)

  const lessonDocuments = (studentDocs && studentDocs.length > 0) ? studentDocs : (previewDocs || []);
  const isLoadingDocuments = isLoadingStudent || isLoadingPreview;

  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string, isDownloadable: boolean } | null>(null)

  // Helper to generate lesson URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLessonUrl = (lesson: any) => {
    let baseUrl = `/courses/${slug}/${courseId}/${lesson.sectionId}/${lesson.id}`
    if (lesson.type === LessonType.Quiz && lesson.quizId) {
      baseUrl += `/quiz-attempt?quizId=${lesson.quizId}`
    }
    return baseUrl
  }

  return (
    <div className="px-4 lg:px-0 pb-20">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-black to-gray-700">
            {currentLesson.title}
          </h1>

          <div className="flex items-center gap-3 shrink-0">
            {prevLesson ? (
              onNavigate ? (
                <Button
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white hover:bg-gray-50 hover:text-black text-gray-500 px-4 h-10"
                  onClick={() => onNavigate(prevLesson.sectionId, prevLesson.id)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Bài trước
                </Button>
              ) : (
                <Link href={getLessonUrl(prevLesson)}>
                  <Button variant="outline" className="rounded-full border-gray-200 bg-white hover:bg-gray-50 hover:text-black text-gray-500 px-4 h-10">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Bài trước
                  </Button>
                </Link>
              )
            ) : (
              <Button disabled variant="outline" className="rounded-full border-gray-100 bg-transparent text-gray-300 px-4 h-10">
                <ChevronLeft className="w-4 h-4 mr-1" /> Bài trước
              </Button>
            )}

            {nextLesson ? (
              onNavigate ? (
                <Button
                  className="rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium"
                  onClick={() => onNavigate(nextLesson.sectionId, nextLesson.id)}
                >
                  Bài tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Link href={getLessonUrl(nextLesson)}>
                  <Button className="rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium">
                    Bài tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )
            ) : (
              <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white border-none px-6 h-10 font-medium">
                Hoàn thành khóa học
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-100 border border-gray-200 w-full justify-start h-auto p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-gray-600 py-2.5 px-6 rounded-lg transition-all">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-gray-600 py-2.5 px-6 rounded-lg transition-all">
              Tài liệu
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-gray-600 py-2.5 px-6 rounded-lg transition-all">
              Hỏi đáp
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-gray-600 py-2.5 px-6 rounded-lg transition-all">
              Ghi chú
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="prose prose-gray max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Mô tả
                {currentLesson.type === LessonType.Quiz ? (
                  <span className="text-brand-pink"> (Bài kiểm tra)</span>
                ) : (
                  <span className="text-brand-pink"> (Bài học)</span>
                )}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentLesson.description || "Chào mừng bạn đến với bài học này. Hãy xem video kỹ lưỡng và đừng quên làm bài tập thực hành cuối bài."}
              </p>

              {isQuizLesson && quizOverview && (
                <div className="my-8 p-6 rounded-2xl bg-linear-to-br from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/30 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-magenta/20 text-brand-pink text-xs font-bold mb-2 border border-brand-magenta/20">
                          <Trophy className="w-3 h-3" /> Bài kiểm tra
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{quizOverview.title}</h4>
                        <p className="text-gray-600">{quizOverview.description || "Hãy hoàn thành bài kiểm tra để đánh giá kiến thức của bạn."}</p>
                      </div>
                      {/* Only show badge if needed */}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 rounded-xl bg-white/60 border border-gray-200 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Clock className="w-4 h-4" /> Thời gian
                        </div>
                        <div className="text-xl font-bold text-gray-900">{quizOverview.timeLimitMinutes} phút</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-gray-200 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <HelpCircle className="w-4 h-4" /> Câu hỏi
                        </div>
                        <div className="text-xl font-bold text-gray-900">{quizOverview.questionCount} câu</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-gray-200 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Target className="w-4 h-4" /> Điểm đạt
                        </div>
                        <div className="text-xl font-bold text-gray-900">{quizOverview.passScorePercent}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-gray-200 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Play className="w-4 h-4" /> Số lần làm
                        </div>
                        <div className="text-xl font-bold text-gray-900">3 lần</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white font-bold px-8 shadow-lg shadow-brand-purple/20 border-none">
                        <Play className="w-5 h-5 mr-2 fill-current" /> Bắt đầu làm bài
                      </Button>
                      <Button size="lg" variant="outline" className="border-gray-200 bg-white hover:bg-gray-50 text-gray-900">
                        Xem lịch sử làm bài
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isQuizLesson && !quizOverview && isLoadingQuiz && (
                <div className="my-8 h-48 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              )}

              <div className="my-8 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Mục tiêu bài học:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hiểu được khái niệm cơ bản về chủ đề.</li>
                  <li>Biết cách áp dụng kiến thức vào thực tế.</li>
                  <li>Nắm vững các thuật ngữ chuyên ngành.</li>
                </ul>
              </div>


            </div>

            <div className="flex items-center gap-4 py-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <SafeImage
                  src={instructor?.avatar ? (formatImageUrl(instructor.avatar) || "") : "https://github.com/shadcn.png"}
                  alt="Instructor"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Giảng viên</div>
                  <div className="text-xs">{instructor?.name || course.instructorName}</div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                  <ThumbsUp className="w-4 h-4 mr-2" /> Thích
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                  <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="animate-in fade-in-50 duration-300">
            {isLoadingDocuments ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
              </div>
            ) : lessonDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lessonDocuments.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc({ url: doc.lessonDocumentUrl, title: doc.title, isDownloadable: doc.isDownloadable })}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-pink/50 transition-colors cursor-pointer group flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-brand-pink transition-colors truncate" title={doc.title}>{doc.title}</h4>
                      <p className="text-xs text-gray-500 truncate" title={doc.description || ""}>{doc.description || "Tài liệu bài học"}</p>
                    </div>
                    {doc.isDownloadable && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <DocumentDownloadButton
                          url={doc.lessonDocumentUrl}
                          title={doc.title}
                          className="block" // ensure it behaves like a block if needed, but the original was just an <a>
                        >
                          <Download className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-900 transition-colors shrink-0 hover:text-brand-pink" />
                        </DocumentDownloadButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Không có tài liệu nào cho bài học này.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
              <p>Chưa có câu hỏi nào cho bài học này.</p>
              <Button variant="link" className="text-brand-pink mt-2">Đặt câu hỏi đầu tiên</Button>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-gray-600">Tính năng ghi chú đang được phát triển.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DocumentViewDialog
        open={!!selectedDoc}
        onOpenChange={(open) => !open && setSelectedDoc(null)}
        url={selectedDoc?.url || null}
        title={selectedDoc?.title}
        isDownloadable={selectedDoc?.isDownloadable}
      />
    </div>
  )
}
