'use client'

import { useState, useMemo } from 'react'
import { Star, MessageSquare, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGetCourseReviews } from '@/hooks/useCourse'
import { CourseReview as CourseReviewType } from '@/lib/api/services/fetchCourse'

import CourseReviewDialog from '@/components/widget/CourseReviewDialog'

interface CourseReviewProps {
  courseId: string
  enrollmentId?: string
  totalReviews: number
}

export default function CourseReview({ courseId, enrollmentId, totalReviews }: CourseReviewProps) {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch paginated reviews for display
  const { reviews, isLoading, hasNextPage, hasPreviousPage } = useGetCourseReviews({
    courseId,
    pageNumber: page,
    pageSize,
    isDescending: true,
  })

  // Fetch all reviews for rating distribution
  const { reviews: allReviews } = useGetCourseReviews({
    courseId,
    pageNumber: 1,
    pageSize: 100,
    isDescending: true,
  })

  // Calculate average rating from all reviews
  const avgRating = useMemo(() => {
    if (!allReviews || allReviews.length === 0) return 0
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / allReviews.length).toFixed(1)
  }, [allReviews])

  // Calculate rating distribution from ALL reviews
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (allReviews) {
      allReviews.forEach((r) => {
        const rating = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5
        if (rating >= 1 && rating <= 5) {
          dist[rating]++
        }
      })
    }
    return dist
  }, [allReviews])

  const handlePrevPage = () => {
    if (hasPreviousPage) {
      setPage(p => p - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(p => p + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Write Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Đánh giá từ học viên</h2>
          <p className="text-muted-foreground mt-1">
            {totalReviews} đánh giá • {avgRating}/5 sao
          </p>
        </div>
        {enrollmentId && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-brand-magenta hover:bg-brand-magenta/90 text-white rounded-full"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Review Dialog */}
      {enrollmentId && (
        <CourseReviewDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          courseId={courseId}
          enrollmentId={enrollmentId}
        />
      )}

      {/* Rating Summary */}
      <Card className="border-brand-purple/20 bg-brand-purple/5">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">{avgRating}</div>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(Number(avgRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{totalReviews} đánh giá</p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution]
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{count || 0}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Card with Scroll & Pagination */}
      <Card className="border-brand-purple/20">
        <CardContent className="p-0">
          {/* Card Header */}
          <div className="sticky top-0 bg-background border-b border-gray-100 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Danh sách đánh giá</h3>
                <p className="text-sm text-muted-foreground">
                  {reviews?.length || 0} đánh giá • Trang {page}
                </p>
              </div>
              {/* Pagination inside card */}
              {reviews && reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePrevPage}
                    disabled={!hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Review List */}
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading ? (
              // Loading skeleton
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-start gap-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chưa có đánh giá nào cho khóa học này.</p>
                {enrollmentId && (
                  <p className="text-sm text-muted-foreground mt-2">Hãy là người đầu tiên đánh giá!</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReviewCard({ review }: { review: CourseReviewType }) {
  const [showFullReview, setShowFullReview] = useState(false)

  // Format date
  const formattedDate = useMemo(() => {
    try {
      const date = new Date(review.createdAt)
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    } catch {
      return ''
    }
  }, [review.createdAt])

  const isLongReview = (review.review?.length || 0) > 300

  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10 ring-2 ring-brand-purple/20 shrink-0">
          <AvatarFallback className="bg-brand-purple/10 text-brand-purple">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground">Học viên</span>
            {review.isVerifiedPurchase && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Đã mua khóa học
              </span>
            )}
          </div>

          {/* Rating & Date */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">• {formattedDate}</span>
          </div>

          {/* Review Text */}
          {review.review && (
            <div className="mt-3">
              <p 
                className={`text-foreground/80 leading-relaxed wrap-break-word whitespace-pre-wrap ${!showFullReview && isLongReview ? 'line-clamp-3' : ''}`}
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {review.review}
              </p>
              {isLongReview && (
                <button
                  onClick={() => setShowFullReview(!showFullReview)}
                  className="text-sm text-brand-purple hover:underline mt-1"
                >
                  {showFullReview ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}

          {/* Quality Ratings (if available) */}
          {(review.contentQuality || review.instructorQuality || review.valueForMoney) && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-100">
              {review.contentQuality && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Chất lượng nội dung:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.contentQuality!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {review.instructorQuality && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Giảng viên:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.instructorQuality!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {review.valueForMoney && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Giá trị:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.valueForMoney!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
