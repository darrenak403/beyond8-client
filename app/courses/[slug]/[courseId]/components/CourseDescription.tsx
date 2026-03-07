'use client'

import {
  CheckCircle2,
  ListChecks,
  Target,
  Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'

interface CourseDescriptionProps {
  course: CourseSummary | CourseDetailType
}

export default function CourseDescription({ course }: CourseDescriptionProps) {
  return (
    <div className="space-y-8">
      {/* What You'll Learn (Outcomes) - Highlighted */}
      {course.outcomes && course.outcomes.length > 0 && (
        <Card className="border-brand-purple/20 bg-brand-purple/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ListChecks className="w-6 h-6 text-brand-purple" />
              Bạn sẽ học được gì
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-magenta mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80 text-sm leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Description */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
        <h2 className="text-2xl font-bold text-foreground mb-4">Mô tả khóa học</h2>
        <div className="whitespace-pre-line leading-relaxed">
          {course.shortDescription || "Chưa có mô tả chi tiết cho khóa học này."}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Requirements */}
         {course.requirements && course.requirements.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Target className="w-5 h-5 text-blue-500" />
                     Yêu cầu
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3">
                     {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                           {req}
                        </li>
                     ))}
                  </ul>
               </CardContent>
            </Card>
         )}

         {/* Target Audience */}
         {course.targetAudience && course.targetAudience.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Users className="w-5 h-5 text-pink-500" />
                     Đối tượng học viên
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3">
                     {course.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                           <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                           {audience}
                        </li>
                     ))}
                  </ul>
               </CardContent>
            </Card>
         )}
      </div>
    </div>
  )
}
