'use client'

import Link from 'next/link'
import { MyEnrollmentData } from '@/lib/api/services/fetchEnroll'
import SafeImage from '@/components/ui/SafeImage'
import StarRating from './StarRating'
import { useUserById } from '@/hooks/useUserProfile'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { courseUrl as buildCourseUrl } from '@/utils/courseUrls'

interface MyEnrollmentCardProps {
  enrollment: MyEnrollmentData
}

export default function MyEnrollmentCard({ enrollment }: MyEnrollmentCardProps) {
  const courseUrl = buildCourseUrl(enrollment.slug, enrollment.courseId)

  const primaryInstructorId = Array.isArray(enrollment.instructorId)
    ? enrollment.instructorId[0] || ''
    : (enrollment.instructorId || '')

  const { user: instructorUser } = useUserById(
    primaryInstructorId && primaryInstructorId.trim() !== '' 
      ? primaryInstructorId 
      : undefined
  )
  const instructorAvatarSrc =
    instructorUser?.avatarUrl || '/bg-web.jpg'

  return (
    <Link href={courseUrl} className="block h-full">
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image - Square aspect ratio */}
        <div className="relative w-full aspect-square mb-2 rounded-xl overflow-hidden">
          <SafeImage
            src={enrollment.courseThumbnailUrl || '/bg-web.jpg'}
            alt={enrollment.courseTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col group-hover:text-primary transition-colors duration-300">
          <h3 className="font-semibold text-base mb-1.5 line-clamp-2 min-h-[2.5rem]">
            {enrollment.courseTitle}
          </h3>
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-muted">
              <SafeImage
                src={formatImageUrl(instructorAvatarSrc || '') || '/bg-web.jpg'}
                alt={instructorUser?.fullName || ''}
                fill
                className="object-cover"
              />
            </div>
            <p className="truncate">{enrollment.instructorName}</p>
          </div>

          {/* Progress % and Rating */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-base font-medium text-primary">
              {Math.round(enrollment.progressPercent)}% hoàn thành
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <StarRating 
                courseId={enrollment.courseId}
                enrollmentId={enrollment.id}
                courseTitle={enrollment.courseTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
