'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useInstructorByUserId } from '@/hooks/useUserProfile'
import InstructorProfileHeader from '../[courseId]/instructor/components/InstructorProfileHeader'
import InstructorBio from '../[courseId]/instructor/components/InstructorBio'
import InstructorContact from '../[courseId]/instructor/components/InstructorContact'
import InstructorCoursesSection from '../[courseId]/instructor/components/InstructorCoursesSection'
import InstructorTabs, { type TabType } from '../[courseId]/instructor/components/InstructorTabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { decodeCompoundId } from '@/utils/crypto'

export default function InstructorProfilePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string

  // id = enc(courseId|instructorId)
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const instructorId = ids[1] || ''

  const [activeTab, setActiveTab] = useState<TabType>('intro')
  const { instructor, isLoading, error } = useInstructorByUserId(instructorId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6"><Skeleton className="h-48 w-full rounded-4xl" /><Skeleton className="h-64 w-full rounded-4xl" /></div>
            <div className="space-y-6"><Skeleton className="h-96 w-full rounded-4xl" /></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy giảng viên</h1>
            <p className="text-gray-600 dark:text-gray-400">Giảng viên này không tồn tại hoặc đã bị ẩn.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="container mx-auto py-8 max-w-7xl">
        <InstructorProfileHeader instructor={instructor} courseCount={0} />
        <InstructorTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          <div className="lg:col-span-5 space-y-6"><InstructorBio instructor={instructor} activeTab={activeTab} /></div>
          <div className="lg:col-span-3 space-y-6"><InstructorContact instructor={instructor} /></div>
        </div>
        <div className="mt-12"><InstructorCoursesSection instructorId={instructorId} /></div>
      </div>
      <Footer />
    </div>
  )
}
