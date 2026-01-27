'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { 
  topRatedCourses, 
  newCourses, 
  languageCourses, 
  technologyCourses, 
  designCourses, 
  marketingCourses 
} from '@/lib/data/mockCourses'
import CourseToolBar from './components/CourseToolBar'
import CourseGridItem from './components/CourseGridItem'
import CourseListItem from './components/CourseListItem'
import CourseGridItemSkeleton from './components/CourseGridItemSkeleton'
import CourseListItemSkeleton from './components/CourseListItemSkeleton'
import { useIsMobile } from '@/hooks/useMobile'

// Combine all mock courses
const allCourses = [
  ...topRatedCourses,
  ...newCourses,
  ...languageCourses,
  ...technologyCourses,
  ...designCourses,
  ...marketingCourses
]

export default function InstructorCoursesPage() {
  const [viewModePreference, setViewModePreference] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const searchParams = useSearchParams()
  const category = searchParams.get('category') || ''
  const isMobile = useIsMobile()

  // Derive viewMode from mobile state
  const viewMode = isMobile ? 'grid' : viewModePreference
  const setViewMode = (mode: 'grid' | 'list') => {
    if (!isMobile) {
      setViewModePreference(mode)
    }
  }

  // Simulate API Fetch
  const fetchData = () => {
    setIsLoading(true)
    setIsError(false)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  // Initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter courses by category and search
  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = !category || course.category === category
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col h-full space-y-6 p-3">

      {/* Toolbar */}
      <CourseToolBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobile={isMobile}
      />

      {/* Content */}
      <div className="flex-1">
        {isError ? (
          <ErrorState onRetry={fetchData} />
        ) : (
          <div className={`
            ${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
            }
          `}>
            {isLoading ? (
              // Render Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                viewMode === 'grid' ? (
                  <CourseGridItemSkeleton key={i} />
                ) : (
                  <CourseListItemSkeleton key={i} />
                )
              ))
            ) : filteredCourses.length > 0 ? (
              // Render Courses
              filteredCourses.map((course) => (
                viewMode === 'grid' ? (
                  <CourseGridItem key={course.id} course={course} />
                ) : (
                  <CourseListItem key={course.id} course={course} />
                )
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy khóa học nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-red-50/50 rounded-xl border border-red-100">
      <div className="p-3 bg-red-100 rounded-full">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Đã xảy ra lỗi</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Không thể tải danh sách khóa học. Vui lòng thử lại.
        </p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Thử lại
      </Button>
    </div>
  )
}