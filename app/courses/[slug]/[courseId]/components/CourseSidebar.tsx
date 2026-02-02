'use client'

import {
  MonitorPlay,
  FileText,
  Trophy,
  Infinity,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'

interface CourseSidebarProps {
  course: CourseSummary | CourseDetailType
}

// Format duration from minutes to readable string
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  }
  return `${mins}m`
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  const params = useParams()
  const slug = params?.slug as string || 'course-slug'
  // const firstLessonId = course.sections[0]?.lessons[0]?.id
  // const firstSectionId = course.sections[0]?.id
  
  // const startLearningUrl = firstLessonId && firstSectionId
  //    ? `/courses/${slug}/${course.id}/${firstSectionId}/${firstLessonId}`
  //    : '#'

  const totalLessons = course.totalLessons || course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
  const duration = formatDuration(course.totalDurationMinutes)
  
  const originalPrice = course.price * 1.5
  const discountParams = Math.round(((originalPrice - course.price) / originalPrice) * 100)
  
  const levelText: Record<string, string> = {
    Beginner: 'Cơ bản',
    Intermediate: 'Trung bình',
    Advanced: 'Nâng cao',
    Expert: 'Chuyên gia',
  }

  return (
    <Card className="sticky top-24 overflow-hidden border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80">
      <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-purple" />
      <CardContent className="p-6 space-y-6">
        {/* Price Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-magenta font-medium bg-brand-magenta/10 px-2 py-1 rounded">
              Ưu đãi ra mắt
            </span>
            <span className="text-sm font-bold text-green-600">
              GIẢM {discountParams}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(course.price)}
            </span>
            <span className="text-lg text-muted-foreground line-through decoration-red-500/50">
              {formatCurrency(originalPrice)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Hoàn tiền trong 30 ngày nếu không hài lòng
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/courses/${slug}/${course.id}/checkout`} className="block w-full">
            <Button className="w-full text-lg py-7 rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(173,28,154,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(173,28,154,0.6)] border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="font-semibold text-white relative z-10">Đăng ký ngay</span>
            </Button>
          </Link>
          <Button variant="outline" className="w-full h-12 rounded-2xl text-base font-semibold border-brand-magenta/20 hover:bg-brand-magenta/5 hover:text-brand-magenta transition-colors">
            Thêm vào giỏ hàng
          </Button>
        </div>

        <Separator />

        {/* Course Features */}
        <div className="space-y-4">
          <h3 className="font-semibold text-brand-dark dark:text-white">Khóa học bao gồm:</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <MonitorPlay className="w-5 h-5 text-brand-purple" />
              <span>{duration} video bài giảng</span>
            </li>
            <li className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-purple" />
              <span>{totalLessons} bài học</span>
            </li>
            <li className="flex items-center gap-3">
               <Trophy className="w-5 h-5 text-brand-purple" />
               <span>Chứng chỉ hoàn thành</span>
            </li>
            <li className="flex items-center gap-3">
               <Infinity className="w-5 h-5 text-brand-purple" />
               <span>Truy cập trọn đời</span>
            </li>
            <li className="flex items-center gap-3">
               <Smartphone className="w-5 h-5 text-brand-purple" />
               <span>Học trên thiết bị di động và TV</span>
            </li>
          </ul>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-muted/30 -mx-6 -mb-6 p-4 border-t mt-6">
           <div className="flex justify-between text-center">
              <div>
                 <div className="font-bold text-brand-dark">{levelText[course.level] || course.level}</div>
                 <div className="text-xs text-muted-foreground">Trình độ</div>
              </div>
              <div className="w-px bg-border h-auto" />
              <div>
                 <div className="font-bold text-brand-dark">{course.language || 'Tiếng Việt'}</div>
                 <div className="text-xs text-muted-foreground">Ngôn ngữ</div>
              </div>
              <div className="w-px bg-border h-auto" />
              <div>
                 <div className="font-bold text-brand-dark">Có</div>
                 <div className="text-xs text-muted-foreground">Chứng chỉ</div>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}
