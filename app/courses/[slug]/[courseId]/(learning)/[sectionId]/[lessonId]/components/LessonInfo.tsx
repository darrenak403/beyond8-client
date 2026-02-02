'use client'

import { ChevronLeft, ChevronRight, Download, FileText, MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseDetail, LessonDetail } from '@/lib/api/services/fetchCourse'

interface LessonInfoProps {
  course: CourseDetail
  currentLesson: LessonDetail
  slug: string
  courseId: string
}

export default function LessonInfo({ course, currentLesson, slug, courseId }: LessonInfoProps) {

  // Find prev/next lesson
  const allLessons = course.sections.flatMap(s => s.lessons.map(l => ({ ...l, sectionId: s.id })))
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="px-4 lg:px-0 pb-20">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {currentLesson.title}
          </h1>
          
          <div className="flex items-center gap-3 shrink-0">
            {prevLesson ? (
              <Link href={`/courses/${slug}/${courseId}/${prevLesson.sectionId}/${prevLesson.id}`}>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-white/70">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
                </Button>
              </Link>
            ) : (
              <Button disabled variant="outline" className="border-white/10 bg-transparent text-white/30">
                <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
              </Button>
            )}

            {nextLesson ? (
              <Link href={`/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`}>
                <Button className="bg-brand-gradient hover:opacity-90 text-white border-none shadow-brand-glow">
                  Bài tiếp theo <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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
              <h3 className="text-xl font-semibold mb-4 text-white">Mô tả bài học</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {currentLesson.description || "Chào mừng bạn đến với bài học này. Hãy xem video kỹ lưỡng và đừng quên làm bài tập thực hành cuối bài."}
              </p>
              
              <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Mục tiêu bài học:</h4>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Hiểu được khái niệm cơ bản về chủ đề.</li>
                  <li>Biết cách áp dụng kiến thức vào thực tế.</li>
                  <li>Nắm vững các thuật ngữ chuyên ngành.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 py-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/50">
                <SafeImage 
                  src="https://github.com/shadcn.png" 
                  alt="Instructor" 
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-white/20" 
                />
                <div>
                  <div className="text-sm font-medium text-white">Giảng viên</div>
                  <div className="text-xs">{course.instructorName}</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer group flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white group-hover:text-brand-pink transition-colors">Source Code.zip</h4>
                  <p className="text-xs text-white/50">2.5 MB</p>
                </div>
                <Download className="w-5 h-5 text-white/30 ml-auto group-hover:text-white transition-colors" />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-pink/50 transition-colors cursor-pointer group flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white group-hover:text-brand-pink transition-colors">Slide bài giảng.pdf</h4>
                  <p className="text-xs text-white/50">1.2 MB</p>
                </div>
                <Download className="w-5 h-5 text-white/30 ml-auto group-hover:text-white transition-colors" />
              </div>
            </div>
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
