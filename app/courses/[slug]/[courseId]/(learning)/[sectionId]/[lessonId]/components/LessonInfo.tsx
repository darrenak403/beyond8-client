'use client'

import { ChevronLeft, ChevronRight, Download, FileText, MessageCircle, Share2, ThumbsUp, Play, Clock, Trophy, Target, Loader2, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseDetail, LessonDetail } from '@/lib/api/services/fetchCourse'
import { Lesson, LessonType } from '@/lib/api/services/fetchLesson'
import { useGetQuizById } from '@/hooks/useQuiz'
import { useGetLessonDocument } from '@/hooks/useLesson'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'

interface LessonInfoProps {
  course: CourseDetail
  currentLesson: Lesson | LessonDetail
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

  const { quiz, isLoading: isLoadingQuiz } = useGetQuizById(quizId || "")

  // Fetch lesson documents
  const { lessonDocuments, isLoading: isLoadingDocuments } = useGetLessonDocument(currentLesson.id)

  return (
    <div className="px-4 lg:px-0 pb-20">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {currentLesson.title}
          </h1>

          <div className="flex items-center gap-3 shrink-0">
            {prevLesson ? (
              onNavigate ? (
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-white/70"
                  onClick={() => onNavigate(prevLesson.sectionId, prevLesson.id)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
                </Button>
              ) : (
                <Link href={`/courses/${slug}/${courseId}/${prevLesson.sectionId}/${prevLesson.id}`}>
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-white/70">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
                  </Button>
                </Link>
              )
            ) : (
              <Button disabled variant="outline" className="border-white/10 bg-transparent text-white/30">
                <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
              </Button>
            )}

            {nextLesson ? (
              onNavigate ? (
                <Button
                  className="bg-brand-gradient hover:opacity-90 text-white border-none shadow-brand-glow"
                  onClick={() => onNavigate(nextLesson.sectionId, nextLesson.id)}
                >
                  Bài tiếp theo <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link href={`/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`}>
                  <Button className="bg-brand-gradient hover:opacity-90 text-white border-none shadow-brand-glow">
                    Bài tiếp theo <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )
            ) : (
              <Button className="bg-green-600 hover:bg-green-700 text-white border-none">
                Hoàn thành khóa học
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 w-full justify-start h-auto p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-white/60 py-2.5 px-6 rounded-lg transition-all">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-white/60 py-2.5 px-6 rounded-lg transition-all">
              Tài liệu
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-white/60 py-2.5 px-6 rounded-lg transition-all">
              Hỏi đáp
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white text-white/60 py-2.5 px-6 rounded-lg transition-all">
              Ghi chú
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-white">Mô tả
                {currentLesson.type === LessonType.Quiz ? (
                  <span className="text-brand-pink"> (Bài kiểm tra)</span>
                ) : (
                  <span className="text-brand-pink"> (Bài học)</span>
                )}
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {currentLesson.description || "Chào mừng bạn đến với bài học này. Hãy xem video kỹ lưỡng và đừng quên làm bài tập thực hành cuối bài."}
              </p>

              {isQuizLesson && quiz && (
                <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/30 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-magenta/20 text-brand-pink text-xs font-bold mb-2 border border-brand-magenta/20">
                          <Trophy className="w-3 h-3" /> Bài kiểm tra
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2">{quiz.title}</h4>
                        <p className="text-white/60">{quiz.description || "Hãy hoàn thành bài kiểm tra để đánh giá kiến thức của bạn."}</p>
                      </div>
                      {/* Only show badge if needed */}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                          <Clock className="w-4 h-4" /> Thời gian
                        </div>
                        <div className="text-xl font-bold text-white">{quiz.timeLimitMinutes} phút</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                          <HelpCircle className="w-4 h-4" /> Câu hỏi
                        </div>
                        <div className="text-xl font-bold text-white">{quiz.questionCount} câu</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                          <Target className="w-4 h-4" /> Điểm đạt
                        </div>
                        <div className="text-xl font-bold text-white">{quiz.passScorePercent}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                          <Play className="w-4 h-4" /> Số lần làm
                        </div>
                        <div className="text-xl font-bold text-white">3 lần</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white font-bold px-8 shadow-lg shadow-brand-purple/20 border-none">
                        <Play className="w-5 h-5 mr-2 fill-current" /> Bắt đầu làm bài
                      </Button>
                      <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                        Xem lịch sử làm bài
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isQuizLesson && !quiz && isLoadingQuiz && (
                <div className="my-8 h-48 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
                </div>
              )}

              <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Mục tiêu bài học:</h4>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Hiểu được khái niệm cơ bản về chủ đề.</li>
                  <li>Biết cách áp dụng kiến thức vào thực tế.</li>
                  <li>Nắm vững các thuật ngữ chuyên ngành.</li>
                </ul>
              </div>

              {currentLesson.type === LessonType.Text && (
                <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 text-white">Nội dung bài học</h3>
                  <div className="space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="text-white/70 text-base leading-relaxed mb-4 break-words">{children}</p>,
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-5 mb-2">{children}</h3>,
                        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-white/80">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-white/70 mb-4 ml-4 break-words">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-white/70 mb-4 ml-4 break-words">{children}</ol>,
                        li: ({ children }) => <li className="text-white/70 break-words">{children}</li>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-purple/50 pl-4 italic text-white/60 my-4">{children}</blockquote>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-pink hover:underline">{children}</a>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        code: ({ inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg !bg-[#1e1e1e] !p-4 my-4 border border-white/10 text-sm shadow-xl overflow-x-auto"
                              showLineNumbers={false}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-white/10 text-brand-pink px-1.5 py-0.5 rounded text-sm font-mono break-all" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {currentLesson.textContent || ""}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 py-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/50">
                <SafeImage
                  src={instructor?.avatar ? (formatImageUrl(instructor.avatar) || "") : "https://github.com/shadcn.png"}
                  alt="Instructor"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="text-sm font-medium text-white">Giảng viên</div>
                  <div className="text-xs">{instructor?.name || course.instructorName}</div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                  <ThumbsUp className="w-4 h-4 mr-2" /> Thích
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                  <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="animate-in fade-in-50 duration-300">
            {isLoadingDocuments ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
              </div>
            ) : lessonDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lessonDocuments.map(doc => (
                  <Link href={doc.lessonDocumentUrl} key={doc.id} target="_blank" rel="noopener noreferrer">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer group flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-brand-pink transition-colors truncate" title={doc.title}>{doc.title}</h4>
                        <p className="text-xs text-white/50 truncate" title={doc.description || ""}>{doc.description || "Tài liệu bài học"}</p>
                      </div>
                      {doc.isDownloadable && <Download className="w-5 h-5 text-white/30 ml-auto group-hover:text-white transition-colors shrink-0" />}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/50">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Không có tài liệu nào cho bài học này.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="flex flex-col items-center justify-center py-12 text-center text-white/50">
              <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
              <p>Chưa có câu hỏi nào cho bài học này.</p>
              <Button variant="link" className="text-brand-pink mt-2">Đặt câu hỏi đầu tiên</Button>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/60">Tính năng ghi chú đang được phát triển.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
