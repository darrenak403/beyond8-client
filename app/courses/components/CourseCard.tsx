'use client'

import Link from 'next/link'
import { Star, Users, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import SafeImage from '@/components/ui/SafeImage'
import { formatCurrency, formatNumber } from '@/lib/utils/formatCurrency'
import { generateSlug } from '@/lib/utils/generateSlug'
import type { Course } from '@/lib/api/services/fetchCourse'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const slug = course.slug || generateSlug(course.title)
  const courseUrl = `/courses/${slug}/${course.id}`

  // Pricing logic
  const originalPrice = course.price
  const finalPrice = course.finalPrice ?? course.price
  const hasDiscount =
    (!!course.discountPercent && course.discountPercent > 0) ||
    (!!course.discountAmount && course.discountAmount > 0) ||
    finalPrice < originalPrice

  // Format duration from minutes to hours
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

  // Parse rating from string to number, default to 0 if null or invalid
  const rating = course.avgRating ? parseFloat(course.avgRating) : 0
  const displayRating = rating > 0 ? rating.toFixed(1) : '0.0'

  return (
    <Link href={courseUrl} target="_blank" className="block h-full">
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image - Square aspect ratio */}
        <div className="relative w-full aspect-square mb-2 rounded-xl overflow-hidden">
          <SafeImage
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-primary rounded-lg text-xs px-1.5 py-0.5">
            {course.categoryName}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col group-hover:text-primary transition-colors duration-300">
          <h3 className="font-semibold text-base mb-1.5 line-clamp-2 min-h-[2.5rem]">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 group-hover:text-primary/80 transition-colors duration-300">
            {course.instructorName}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 group-hover:text-primary/70 transition-colors duration-300">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{displayRating}</span>
              {course.totalReviews > 0 && (
                <span className="text-muted-foreground/70">({formatNumber(course.totalReviews)})</span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Users className="w-3 h-3" />
              <span>{formatNumber(course.totalStudents)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(course.totalDurationMinutes)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <Badge
              variant="outline"
              className="rounded-md text-xs px-1.5 py-0.5 group-hover:border-primary group-hover:text-primary transition-colors duration-300"
            >
              {course.level}
            </Badge>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(finalPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                    {formatCurrency(originalPrice)}
                  </span>
                  {course.discountPercent !== null && course.discountPercent !== undefined && course.discountPercent > 0 && (
                    <span className="text-[10px] font-semibold text-red-500">
                      -{course.discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
