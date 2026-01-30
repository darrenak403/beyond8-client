'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/custom-pagination'

import CourseToolBar from './components/CourseToolBar'
import CourseGridItem from './components/CourseGridItem'
import CourseListItem from './components/CourseListItem'
import CourseGridItemSkeleton from './components/CourseGridItemSkeleton'
import CourseListItemSkeleton from './components/CourseListItemSkeleton'
import { useIsMobile } from '@/hooks/useMobile'
import { useGetCourseByInstructor } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { CourseLevel } from '@/lib/api/services/fetchCourse'

export default function InstructorCoursesPage() {
  const [viewModePreference, setViewModePreference] = useState<'grid' | 'list'>('grid')

  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { user } = useAuth()

  // Derive viewMode from mobile state
  const viewMode = isMobile ? 'grid' : viewModePreference
  const setViewMode = (mode: 'grid' | 'list') => {
    if (!isMobile) {
      setViewModePreference(mode)
    }
  }

  // Pagination State
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '8')
  const isDescending = searchParams.get('isDescending') !== 'false'
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const level = searchParams.get('level') || 'All'
  const categoryName = searchParams.get('categoryName') || ''


  // Fetch Data
  const { courses, isLoading, isError, refetch, totalPages, hasNextPage, hasPreviousPage } = useGetCourseByInstructor({
    instructorId: user?.id,
    keyword: searchParams.get('keyword') || '',
    categoryName: categoryName || undefined,
    pageNumber: pageNumber,
    pageSize: pageSize,
    isDescending: isDescending,
    sortBy: sortBy,
    level: level as CourseLevel
  })

  // Ensure params exist in URL
  const router = useRouter()
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let hasChanged = false

    if (!searchParams.has('pageNumber')) {
      params.set('pageNumber', '1')
      hasChanged = true
    }
    if (!searchParams.has('pageSize')) {
      params.set('pageSize', '8')
      hasChanged = true
    }
    if (!searchParams.has('isDescending')) {
      params.set('isDescending', 'true')
      hasChanged = true
    }
    if (!searchParams.has('level')) {
      params.set('level', 'All')
      hasChanged = true
    }
    if (!searchParams.has('sortBy')) {
      params.set('sortBy', 'createdAt')
      hasChanged = true
    }

    if (hasChanged) {
      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router])

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageNumber', newPage.toString())
    router.push(`?${params.toString()}`)
  }


  return (
    <div className="flex flex-col h-full space-y-6 p-3">

      {/* Toolbar */}
      <CourseToolBar
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
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
              ) : courses.length > 0 ? (
                // Render Courses
                courses.map((course) => (
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

            {/* Pagination */}
            {!isLoading && courses.length > 0 && (
              <div className="mt-auto">
                <Pagination
                  currentPage={pageNumber}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                />
              </div>
            )}
          </>
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