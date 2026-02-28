'use client'

import Link from 'next/link'
import { Star, Users, Clock, ShoppingCart, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeImage from '@/components/ui/SafeImage'
import { formatCurrency, formatNumber } from '@/lib/utils/formatCurrency'
import { generateSlug } from '@/lib/utils/generateSlug'
import { courseUrl as buildCourseUrl } from '@/utils/courseUrls'
import type { Course } from '@/lib/api/services/fetchCourse'
import { useUserById } from '@/hooks/useUserProfile'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { useAddToCart, useGetCart } from '@/hooks/useOrder'
import { useAuth } from '@/hooks/useAuth'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const slug = course.slug || generateSlug(course.title)
  const courseCardUrl = buildCourseUrl(slug, course.id)
  const { user: instructorUser } = useUserById(course.instructorId)
  const { addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuth()
  const { cart } = useGetCart({ enabled: isAuthenticated })
  
  const isInCart = cart?.items?.some(item => item.courseId === course.id) ?? false
  const originalPrice = course.price
  const finalPrice = course.finalPrice ?? course.price
  const hasDiscount =
    (!!course.discountPercent && course.discountPercent > 0) ||
    (!!course.discountAmount && course.discountAmount > 0) ||
    finalPrice < originalPrice

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours} giờ ${mins} phút`
    } else if (hours > 0) {
      return `${hours} giờ`
    }
    return `${mins} phút`
  }

  const rating = course.avgRating ? parseFloat(course.avgRating) : 0
  const displayRating = rating > 0 ? rating.toFixed(1) : '0.0'

  const getLevelVietnamese = (level: string | null | undefined): string => {
    if (!level) return 'Cơ bản'
    const levelUpper = level.toUpperCase()
    if (levelUpper === 'BEGINNER') return 'Cơ bản'
    if (levelUpper === 'INTERMEDIATE') return 'Trung cấp'
    if (levelUpper === 'ADVANCED') return 'Nâng cao'
    if (levelUpper === 'EXPERT') return 'Chuyên gia'
    return level
  }

  const instructorAvatarSrc = instructorUser?.avatarUrl || '/bg-web.jpg'

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    try {
      await addToCart({ courseId: course.id })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }
  return (
    <Link href={courseCardUrl} target="_blank" className="block h-full">
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image - Square aspect ratio */}
        <div className="relative w-full aspect-square mb-2 rounded-xl overflow-hidden">
          <SafeImage
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Level Badge - Top Left */}
          <Badge variant="outline" className="absolute top-2 left-2 rounded-lg text-xs px-1.5 py-0.5 bg-white/90 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-colors duration-300">
            {getLevelVietnamese(course.level)}
          </Badge>
          {/* Category Badge - Top Right */}
          <Badge className="absolute top-2 right-2 bg-primary rounded-lg text-xs px-1.5 py-0.5">
            {course.categoryName}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col group-hover:text-primary transition-colors duration-300">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-14">
            {course.title}
          </h3>
          <div className="text-sm text-muted-foreground mb-3 group-hover:text-primary/80 transition-colors duration-300 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-muted ">
              <SafeImage
                src={formatImageUrl(instructorAvatarSrc || '') || '/bg-web.jpg'}
                alt={instructorUser?.fullName || course.instructorName}
                fill
                className="object-cover"
              />
            </div>
            <span className="truncate">{instructorUser?.fullName || course.instructorName}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              { course.finalPrice > 0 && (
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(finalPrice)}
                </span>
              )}
              { course.finalPrice === 0 && (
                <span className="text-2xl font-bold text-primary">
                  Miễn phí
                </span>
              )}
              {hasDiscount && (
                <>
                  <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                    {formatCurrency(originalPrice)}
                  </span>
                  {course.discountPercent !== null && course.discountPercent !== undefined && course.discountPercent > 0 && (
                    <span className="text-xs font-semibold text-red-500">
                      -{course.discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{displayRating}</span>
                {course.totalReviews > 0 && (
                  <span className="text-muted-foreground/70">({formatNumber(course.totalReviews)})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(course.totalStudents)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.totalDurationMinutes)}</span>
              </div>
            </div>
            
            {course.finalPrice > 0 && (
              isInCart ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 shrink-0 bg-green-50 border-green-500 text-green-600 hover:bg-green-100 cursor-default"
                  disabled
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0 bg-purple-50 border-purple-500 text-purple-500 hover:bg-primary hover:text-white"
                  onClick={handleAddToCart}
                  disabled={isPending}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
