'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"

import CourseGridItem from './components/CourseGridItem'
import CourseListItem from './components/CourseListItem'
import CourseToolbar from './components/CourseToolbar'
import CoursePagination from './components/CoursePagination'

import { useIsMobile } from '@/hooks/useMobile'
import { Course, CourseStatus, CourseLevel } from '@/lib/api/services/fetchCourse'
import { useGetCourseByInstructor } from '@/hooks/useCourse'

const ITEMS_PER_PAGE = 12

export default function CourseManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch courses with pagination
  const { 
    courses, 
    isLoading, 
    isError, 
    refetch,
    totalPages: serverTotalPages,
    count
  } = useGetCourseByInstructor({
    pageNumber: currentPage,
    pageSize: ITEMS_PER_PAGE,
    level: CourseLevel.All
  })
 
  const isMobile = useIsMobile()

  // Force grid view on mobile by deriving the actual view mode
  const actualViewMode = isMobile ? 'grid' : viewMode

  // Filter courses based on search (client-side filtering)
  const filteredCourses = searchQuery
    ? courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses

  // Use filtered courses for display
  const currentCourses = filteredCourses
  const totalPages = searchQuery 
    ? Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
    : serverTotalPages

  return (
    <div className="flex flex-col h-full p-2 space-y-4">
      {/* Header */}
      {isMobile && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản lý khóa học
          </h1>
        </div>
      )}

      {/* Toolbar */}
      <CourseToolbar
        viewMode={actualViewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={count}
        isMobile={isMobile}
        onRefresh={refetch}
        isLoading={isLoading}
      />

      {/* Content */}
      <div className="flex-1">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className={`
                ${actualViewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
            }
            `}>
            {isLoading ? (
              // Render Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                actualViewMode === 'grid' ? (
                  <CourseGridItemSkeleton key={i} />
                ) : (
                  <CourseListItemSkeleton key={i} />
                )
              ))
            ) : (
              // Render Courses
              currentCourses.map((course) => (
                actualViewMode === 'grid' ? (
                  <CourseGridItem key={course.id} course={course} />
                ) : (
                  <CourseListItem key={course.id} course={course} />
                )
              ))
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && filteredCourses.length > 0 && (
        <CoursePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={ITEMS_PER_PAGE}
          totalItems={filteredCourses.length}
          onPageChange={setCurrentPage}
        />
      )}
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
        <h3 className="text-lg font-semibold text-slate-800">Đã xảy ra lỗi</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          Không thể tải danh sách khóa học ngay lúc này. Vui lòng thử lại sau.
        </p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
      >
        <RotateCcw className="w-4 h-4" />
        Thử lại
      </Button>
    </div>
  )
}

function CourseGridItemSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-[4/3]">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-1/2" /> {/* Price */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-1/3" /> {/* Category/Level */}
            <Skeleton className="h-6 w-full" /> {/* Title Line 1 */}
            <Skeleton className="h-6 w-2/3" /> {/* Title Line 2 */}
          </div>
        </div>

        <div className="h-px w-full bg-slate-100" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-3 gap-2 py-0.5">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function CourseListItemSkeleton() {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden border border-border/40 p-3 gap-4">
      {/* Image Skeleton */}
      <div className="relative w-72 shrink-0 aspect-[16/9]">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <Skeleton className="h-7 w-1/4" /> {/* Price */}

            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" /> {/* Category */}
              <Skeleton className="h-5 w-16" /> {/* Status */}
            </div>

            <div className="space-y-1 pt-1">
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-1/2" /> {/* Instructor */}
            </div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-4 gap-8 mt-4 w-fit">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>

        <div className="flex items-center gap-6 mt-3">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Action Skeleton */}
      <div className="flex flex-col justify-center gap-2 shrink-0 w-auto pl-4 border-l border-border/50 my-1">
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}
