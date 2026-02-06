'use client'

import { use, useState } from 'react'
import { useInstructorByUserId } from '@/hooks/useUserProfile'
import InstructorProfileHeader from '../components/InstructorProfileHeader'
import InstructorBio from '../components/InstructorBio'
import InstructorContact from '../components/InstructorContact'
import InstructorCoursesSection from '../components/InstructorCoursesSection'
import InstructorTabs, { type TabType } from '../components/InstructorTabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface PageProps {
  params: Promise<{
    instructorId: string
  }>
}

export default function InstructorProfilePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const instructorId = resolvedParams.instructorId

  const [activeTab, setActiveTab] = useState<TabType>('intro')

  // Sử dụng useInstructorByUserId để lấy instructor profile theo userId
  const { instructor, isLoading, error } = useInstructorByUserId(instructorId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-4xl" />
              <Skeleton className="h-64 w-full rounded-4xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 w-full rounded-4xl" />
            </div>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy giảng viên
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Giảng viên này không tồn tại hoặc đã bị ẩn.
            </p>
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
        {/* Header */}
        <InstructorProfileHeader instructor={instructor} courseCount={0} />

        {/* Tab Navigation */}
        <InstructorTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Left Column - Tab Content */}
          <div className="lg:col-span-5 space-y-6">
            <InstructorBio instructor={instructor} activeTab={activeTab} />
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <InstructorContact instructor={instructor} />
          </div>
        </div>

        {/* Courses Section - Outside tabs */}
        <div className="mt-12">
          <InstructorCoursesSection instructorId={instructorId} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
