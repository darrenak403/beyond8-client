'use client'

import { MyEnrollmentData } from '@/lib/api/services/fetchEnroll'
import MyEnrollmentCard from './MyEnrollmentCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/useMobile'
import Link from 'next/link'

interface MyEnrollmentListProps {
  enrollments: MyEnrollmentData[]
  isLoading?: boolean
}

export default function MyEnrollmentList({
  enrollments,
  isLoading,
}: MyEnrollmentListProps) {
  const isMobile = useIsMobile()
  const skeletonCount = isMobile ? 4 : 8

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="h-full flex flex-col">
            {/* Image skeleton - square aspect ratio */}
            <Skeleton className="w-full aspect-square mb-2 rounded-xl" />
            
            {/* Content skeleton */}
            <div className="flex-1 flex flex-col space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-2" />
              <div className="flex items-center justify-between mt-auto pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">Bạn chưa đăng ký khóa học nào</h3>
        <p className="text-muted-foreground mb-6">
          Khám phá các khóa học mới và bắt đầu hành trình học tập của bạn
        </p>
        <Link
          href="/courses"
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-medium hover:opacity-90 transition-opacity"
        >
          Khám phá khóa học
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {enrollments.map((enrollment) => (
        <MyEnrollmentCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  )
}
