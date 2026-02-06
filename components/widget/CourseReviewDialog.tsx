'use client'

import { useState, useRef, useEffect } from 'react'
import { Star, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import gsap from 'gsap'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCourseReview } from '@/hooks/useCourse'
import { toast } from 'sonner'

interface CourseReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  enrollmentId: string
  courseTitle?: string
}

type Step = 'review' | 'details'

const qualityQuestions = [
  {
    key: 'contentQuality' as const,
    label: 'Chất lượng nội dung',
    description: 'Nội dung khóa học có hữu ích và dễ hiểu không?'
  },
  {
    key: 'instructorQuality' as const,
    label: 'Chất lượng giảng viên',
    description: 'Giảng viên có giảng dạy rõ ràng và nhiệt tình không?'
  },
  {
    key: 'valueForMoney' as const,
    label: 'Giá trị đồng tiền',
    description: 'Khóa học có xứng đáng với số tiền bạn bỏ ra không?'
  }
]

export default function CourseReviewDialog({
  open,
  onOpenChange,
  courseId,
  enrollmentId,
}: CourseReviewDialogProps) {
  const [step, setStep] = useState<Step>('review')
  const [rating, setRating] = useState<number | null>(null)
  const [review, setReview] = useState<string>('')
  const [contentQuality, setContentQuality] = useState<number | null>(null)
  const [instructorQuality, setInstructorQuality] = useState<number | null>(null)
  const [valueForMoney, setValueForMoney] = useState<number | null>(null)

  const starsContainerRef = useRef<HTMLDivElement>(null)
  const textareaContainerRef = useRef<HTMLDivElement>(null)
  const stepContentRef = useRef<HTMLDivElement>(null)

  const { createReview, isPending } = useCreateCourseReview()

  const handleRatingSelect = (value: number) => {
    const isChanging = rating !== null
    setRating(value)

    // Only animate if this is the first time selecting a rating
    if (!isChanging && starsContainerRef.current && textareaContainerRef.current) {
      const timeline = gsap.timeline()
      
      timeline
        .to(starsContainerRef.current, {
          scale: 0.65,
          y: -60,
          duration: 0.4,
          ease: 'power2.out'
        })
        .to(textareaContainerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.15')

      setTimeout(() => {
        const textarea = textareaContainerRef.current?.querySelector('textarea')
        textarea?.focus()
      }, 500)
    }
  }

  const handleContinue = () => {
    if (!rating) {
      toast.error('Vui lòng chọn đánh giá')
      return
    }
    
    // Animate step transition
    if (stepContentRef.current) {
      gsap.fromTo(
        stepContentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
    
    setStep('details')
  }

  const handleBack = () => {
    // Animate step transition
    if (stepContentRef.current) {
      gsap.fromTo(
        stepContentRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
    
    setStep('review')
  }

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Vui lòng chọn đánh giá')
      return
    }

    try {
      await createReview({
        courseId,
        enrollmentId,
        rating,
        review: review.trim() || null,
        contentQuality,
        instructorQuality,
        valueForMoney,
      })
      toast.success('Đánh giá thành công!')
      handleClose()
    } catch (error) {
      console.log(error)
      // Error is handled by the hook
    }
  }

  const handleClose = () => {
    // Reset form
    setStep('review')
    setRating(null)
    setReview('')
    setContentQuality(null)
    setInstructorQuality(null)
    setValueForMoney(null)
    onOpenChange(false)
  }

  const getQualityValue = (key: 'contentQuality' | 'instructorQuality' | 'valueForMoney') => {
    switch (key) {
      case 'contentQuality':
        return contentQuality
      case 'instructorQuality':
        return instructorQuality
      case 'valueForMoney':
        return valueForMoney
    }
  }

  const setQualityValue = (
    key: 'contentQuality' | 'instructorQuality' | 'valueForMoney',
    value: number | null
  ) => {
    switch (key) {
      case 'contentQuality':
        setContentQuality(value)
        break
      case 'instructorQuality':
        setInstructorQuality(value)
        break
      case 'valueForMoney':
        setValueForMoney(value)
        break
    }
  }

  // Handle initial state and back navigation
  useEffect(() => {
    if (!open) return
    
    if (starsContainerRef.current && textareaContainerRef.current) {
      if (step === 'review' && rating) {
        gsap.set(starsContainerRef.current, { scale: 0.65, y: -60 })
        gsap.set(textareaContainerRef.current, { opacity: 1, y: 0 })
      } else if (step === 'review' && !rating) {
        gsap.set(starsContainerRef.current, { scale: 1, y: 0 })
        gsap.set(textareaContainerRef.current, { opacity: 0, y: 20 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]) 

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá khóa học</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định
          </DialogDescription>
        </DialogHeader>

        {/* Fixed height content area */}
        <div ref={stepContentRef} className="min-h-[320px] pt-4">
          {step === 'review' && (
            <div className="space-y-4">
              {/* Stars Section */}
              <div ref={starsContainerRef} className="space-y-3 m-0">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {rating ? 'Đánh giá của bạn' : 'Bạn đánh giá khóa học này như thế nào?'}
                  </h3>
                </div>
                
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = rating !== null && star <= rating
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingSelect(star)}
                        className="transition-all hover:scale-110 active:scale-95 focus:outline-none"
                      >
                        <Star
                          className={`h-14 w-14 transition-all ${
                            isFilled
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                {rating && (
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      {rating === 5 && 'Tuyệt vời! 🌟'}
                      {rating === 4 && 'Rất tốt! 👍'}
                      {rating === 3 && 'Tốt! 😊'}
                      {rating === 2 && 'Cần cải thiện'}
                      {rating === 1 && 'Không hài lòng'}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Textarea */}
              <div ref={textareaContainerRef} className="opacity-0">
                <div className="relative">
                  <Textarea
                    placeholder="Ví dụ: Khóa học rất hữu ích, giảng viên giải thích rõ ràng..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={1000}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {review.length}/1000
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-5">
              {qualityQuestions.map((question) => {
                const value = getQualityValue(question.key)
                return (
                  <div key={question.key} className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">{question.label}</h4>
                      <p className="text-xs text-gray-600">{question.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = value !== null && star <= value
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setQualityValue(question.key, star === value ? null : star)}
                              className="transition-all hover:scale-110 active:scale-95 focus:outline-none"
                            >
                              <Star
                                className={`h-7 w-7 transition-all ${
                                  isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          )
                        })}
                      </div>
                      {value && (
                        <span className="text-xs text-gray-600 min-w-[40px]">
                          {value}/5
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

       

        {/* Footer with buttons */}
        <DialogFooter className="gap-2 sm:gap-0">
          {step === 'review' && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-initial"
              >
                Hủy
              </Button>            
              <Button
                onClick={handleContinue}
                disabled={!rating}
                className="flex-1 sm:flex-initial"
              >
                Tiếp tục
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {step === 'details' && (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
                className="flex-1 sm:flex-initial"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 sm:flex-initial"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đánh giá'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
