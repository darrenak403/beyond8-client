'use client'

import { useState, useMemo } from 'react'
import { Star } from 'lucide-react'
import CourseReviewDialog from '@/components/widget/CourseReviewDialog'
import { useGetCourseReviews } from '@/hooks/useCourse'

interface StarRatingProps {
  courseId: string
  enrollmentId: string
  courseTitle?: string
}

export default function StarRating({ 
  courseId, 
  enrollmentId, 
  courseTitle,
}: StarRatingProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch reviews for this course
  const { reviews } = useGetCourseReviews({
    courseId,
    pageNumber: 1,
    pageSize: 100, // Get all reviews to find the one for this enrollment
    isDescending: true,
  })

  // Find review for this enrollment
  const currentReview = useMemo(() => {
    return reviews.find(review => review.enrollmentId === enrollmentId)
  }, [reviews, enrollmentId])

  const rating = currentReview?.rating ?? null
  const hasRating = rating !== null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only open dialog if no rating exists
    if (!hasRating) {
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <div className="flex gap-1" onClick={handleClick}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating !== null && star <= rating
          return (
            <button
              key={star}
              type="button"
              onClick={handleClick}
              disabled={hasRating}
              className={`transition-transform focus:outline-none ${
                hasRating 
                  ? 'cursor-default' 
                  : 'hover:scale-110 cursor-pointer'
              }`}
            >
              <Star
                className={`h-4 w-4 transition-colors ${
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : hasRating
                    ? 'text-gray-300'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              />
            </button>
          )
        })}
      </div>

      {!hasRating && (
        <CourseReviewDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          courseId={courseId}
          enrollmentId={enrollmentId}
          courseTitle={courseTitle}
        />
      )}
    </>
  )
}

