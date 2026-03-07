'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle, RotateCcw, Award, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination } from '@/components/ui/custom-pagination'

import CourseToolBar from './components/CourseToolBar'
import CourseGridItem from './components/CourseGridItem'
import CourseListItem from './components/CourseListItem'
import CourseGridItemSkeleton from './components/CourseGridItemSkeleton'
import CourseListItemSkeleton from './components/CourseListItemSkeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from '@/hooks/useMobile'
import { useGetCourseByInstructor, usePublishCourses, useUpdateCourseCertificateConfig } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'
import { CourseLevel, CourseStatus, fetchCourse } from '@/lib/api/services/fetchCourse'

export default function InstructorCoursesPage() {
  const [viewModePreference, setViewModePreference] = useState<'grid' | 'list'>('grid')
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

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
  const isDescendingPrice = searchParams.get('isDescendingPrice') !== 'false'
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
    isDescendingPrice: isDescendingPrice,
    level: level as CourseLevel
  })

  // Bulk Publish Mutation
  const { publishCourses, isPending: isPublishingBulk } = usePublishCourses()
  const { updateCourseCertificateConfig, isPending: isUpdatingBulkConfig } = useUpdateCourseCertificateConfig()

  const [showBulkConfigDialog, setShowBulkConfigDialog] = useState(false)
  const [isCheckingConfig, setIsCheckingConfig] = useState(false)
  const [quizPercent, setQuizPercent] = useState('70')
  const [assignmentPercent, setAssignmentPercent] = useState('50')

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
    // Reset selection on page change
    setSelectedCourseIds([])
  }

  // Selection Logic
  const toggleSelectCourse = (id: string) => {
    // Only allow selecting Approved courses (ready for publish)
    const course = courses.find(c => c.id === id)
    if (!course || course.status !== CourseStatus.Approved) return

    setSelectedCourseIds(prev =>
      prev.includes(id) ? prev.filter(courseId => courseId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    // Only select courses that are Approved
    const approvedCourses = courses.filter(c => c.status === CourseStatus.Approved)
    const approvedIds = approvedCourses.map(c => c.id)

    // Check if all APPROVED courses are already selected
    const allApprovedSelected = approvedIds.every(id => selectedCourseIds.includes(id))

    if (allApprovedSelected && approvedIds.length > 0) {
      setSelectedCourseIds([])
    } else {
      setSelectedCourseIds(approvedIds)
    }
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev)
    // Clear selection when exiting selection mode
    if (isSelectionMode) {
      setSelectedCourseIds([])
    }
  }

  const handleBulkPublish = async () => {
    if (selectedCourseIds.length === 0) return
    setIsCheckingConfig(true)

    try {
      // Publish immediately
      await publishCourses({ ids: selectedCourseIds })

      const unconfiguredCourses: string[] = []
      for (const id of selectedCourseIds) {
        try {
          const res = await fetchCourse.getCourseCertificateConfig(id)
          const data = res.data
          if (!data || (data.quizAverageMinPercent === null && data.assignmentAverageMinPercent === null)) {
            unconfiguredCourses.push(id)
          }
        } catch (e) {
          console.error("Error fetching config:", e)
          unconfiguredCourses.push(id)
        }
      }

      if (unconfiguredCourses.length > 0) {
        setSelectedCourseIds(unconfiguredCourses)
        setShowBulkConfigDialog(true)
      } else {
        setSelectedCourseIds([])
        refetch()
      }
    } finally {
      setIsCheckingConfig(false)
    }
  }

  const handleBulkConfigSave = async () => {
    const qPercent = parseInt(quizPercent)
    const aPercent = parseInt(assignmentPercent)

    await Promise.all(
      selectedCourseIds.map(id => updateCourseCertificateConfig({
        courseId: id,
        data: {
          quizAverageMinPercent: isNaN(qPercent) ? 70 : qPercent,
          assignmentAverageMinPercent: isNaN(aPercent) ? 50 : aPercent
        }
      }))
    )
    setShowBulkConfigDialog(false)
    setSelectedCourseIds([])
    refetch()
  }



  return (
    <div className="flex flex-col h-full space-y-6 p-3">

      {/* Toolbar */}
      <CourseToolBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isSelectionMode={isSelectionMode}
        toggleSelectionMode={toggleSelectionMode}
      />

      {/* Bulk Actions Bar */}
      {!isLoading && courses.length > 0 && isSelectionMode && (
        <div className="sticky top-4 z-30 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 shadow-lg ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-2">
              <Checkbox
                id="select-all"
                checked={
                  courses.filter(c => c.status === CourseStatus.Approved).length > 0 &&
                  courses.filter(c => c.status === CourseStatus.Approved).every(c => selectedCourseIds.includes(c.id))
                }
                onCheckedChange={() => toggleSelectAll()}
                className="h-5 w-5 border-2 border-slate-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
              >
                {selectedCourseIds.length > 0
                  ? `Đã chọn ${selectedCourseIds.length} khóa học`
                  : 'Chọn tất cả (Khóa học cần công khai)'}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectionMode}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleBulkPublish}
              disabled={isPublishingBulk || isCheckingConfig || selectedCourseIds.length === 0}
              className={`
                        transition-all duration-300 rounded-full
                        ${selectedCourseIds.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
            >
              {isPublishingBulk || isCheckingConfig ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Đang xử lý...
                </>
              ) : (
                `Công khai ${selectedCourseIds.length > 0 ? `(${selectedCourseIds.length})` : ''}`
              )}
            </Button>
          </div>
        </div>
      )}

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
                    <CourseGridItem
                      key={course.id}
                      course={course}
                      isSelected={selectedCourseIds.includes(course.id)}
                      onToggleSelect={() => toggleSelectCourse(course.id)}
                      isSelectionMode={isSelectionMode}
                    />
                  ) : (
                    <CourseListItem
                      key={course.id}
                      course={course}
                      isSelected={selectedCourseIds.includes(course.id)}
                      onToggleSelect={() => toggleSelectCourse(course.id)}
                      isSelectionMode={isSelectionMode}
                    />
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

      <AlertDialog open={showBulkConfigDialog}>
        <AlertDialogContent className="sm:max-w-[500px] overflow-hidden p-0 border-0 shadow-2xl rounded-2xl">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 p-6 pb-4">
            <AlertDialogHeader>
              <div className="mx-auto bg-white p-3 rounded-full shadow-sm w-fit mb-2">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <AlertDialogTitle className="text-center text-xl text-primary">Điều kiện cấp chứng chỉ</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-slate-600">
                Hệ thống yêu cầu thiết lập điểm đạt tối thiểu để học viên nhận được chứng chỉ. Cấu hình này sẽ được áp dụng cho tất cả các khóa học đã chọn.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bulkQuizPercent" className="font-semibold text-slate-700 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Bài kiểm tra (Quiz)
                </Label>
                <div className="relative">
                  <Input
                    id="bulkQuizPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={quizPercent}
                    onChange={(e) => setQuizPercent(e.target.value)}
                    className="pr-8 font-medium text-slate-900 border-slate-200 focus-visible:ring-primary rounded-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bulkAssignmentPercent" className="font-semibold text-slate-700 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-400" />
                  Bài tập (Assignment)
                </Label>
                <div className="relative">
                  <Input
                    id="bulkAssignmentPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentPercent}
                    onChange={(e) => setAssignmentPercent(e.target.value)}
                    className="pr-8 font-medium text-slate-900 border-slate-200 focus-visible:ring-primary rounded-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter className="p-6 pt-2 sm:justify-center">
            <Button onClick={handleBulkConfigSave} disabled={isUpdatingBulkConfig} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-md shadow-primary/20 transition-all font-semibold">
              {isUpdatingBulkConfig ? "Đang lưu..." : "Xác nhận & Hoàn tất"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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