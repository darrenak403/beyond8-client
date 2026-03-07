'use client'

import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface InstructorCoursesProps {
  instructorId?: string
}

export default function InstructorCourses({ instructorId }: InstructorCoursesProps) {
  // TODO: Fetch courses by instructorId from API
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Các khóa học</h2>
      </div>
      
      {/* Empty State */}
      <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
        <CardContent className="py-12 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chức năng đang được phát triển
              </h3>
              <p className="text-gray-500 mt-1">
                Danh sách khóa học của giảng viên sẽ được hiển thị tại đây
              </p>
              {instructorId && (
                <p className="text-xs text-gray-400 mt-3 font-mono">
                  Instructor ID: {instructorId}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
