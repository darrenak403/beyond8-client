'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useMobile'
import CourseList from './components/CourseList'
import CourseFilter from './components/CourseFilter'
import { useGetCourses } from '@/hooks/useCourse'
import { CourseLevel } from '@/lib/api/services/fetchCourse'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import CoursePagination from './components/CoursePagination'

export default function CoursesPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMobile = useIsMobile()

  // Build filter params from URL
  const filterParams = useMemo(() => {
    const params: {
      keyword?: string
      categoryName?: string
      instructorName?: string
      level?: CourseLevel
      language?: string
      minPrice?: number
      maxPrice?: number
      minRating?: number
      minStudents?: number
      isDescendingPrice?: boolean
      isRandom?: boolean
      pageNumber?: number
      pageSize?: number
      isDescending?: boolean
    } = {}

    const keyword = searchParams.get('search')
    if (keyword) params.keyword = keyword

    const categoryName = searchParams.get('category')
    if (categoryName && categoryName !== 'all' && categoryName !== '') {
      params.categoryName = categoryName
    }

    const instructorName = searchParams.get('instructorName')
    if (instructorName) params.instructorName = instructorName

    const level = searchParams.get('level')
    if (level && level !== 'all' && level !== 'All') {
      params.level = level as CourseLevel
    }

    const language = searchParams.get('language')
    if (language && language !== '') {
      params.language = language
    }

    const minPrice = searchParams.get('minPrice')
    if (minPrice) {
      const price = parseInt(minPrice)
      if (!isNaN(price) && price > 0) params.minPrice = price
    }

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) {
      const price = parseInt(maxPrice)
      if (!isNaN(price)) params.maxPrice = price
    }

    const minRating = searchParams.get('minRating')
    if (minRating && minRating !== 'all') {
      const rating = parseFloat(minRating)
      if (!isNaN(rating)) params.minRating = rating
    }

    const minStudents = searchParams.get('minStudents')
    if (minStudents) {
      const students = parseInt(minStudents)
      if (!isNaN(students)) params.minStudents = students
    }

    const isDescendingPrice = searchParams.get('isDescendingPrice')
    if (isDescendingPrice === 'true') {
      params.isDescendingPrice = true
    }

    const isRandom = searchParams.get('isRandom')
    if (isRandom === 'true') {
      params.isRandom = true
    }

    const pageNumber = searchParams.get('pageNumber')
    if (pageNumber) {
      const page = parseInt(pageNumber)
      if (!isNaN(page) && page > 0) params.pageNumber = page
    } else {
      params.pageNumber = 1
    }

    const pageSize = searchParams.get('pageSize')
    if (pageSize) {
      const size = parseInt(pageSize)
      if (!isNaN(size) && size > 0) params.pageSize = size
    } else {
      params.pageSize = 10
    }

    const isDescending = searchParams.get('isDescending')
    if (isDescending !== null && isDescending !== undefined) {
      params.isDescending = isDescending !== 'false'
    }

    return params
  }, [searchParams])

  // Fetch courses from API
  const {
    courses,
    isLoading,
    page,
    totalPages,
    pageSize,
    count,
  } = useGetCourses(filterParams)

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageNumber', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div
        className={`space-y-16 py-12 ${
          isMobile ? 'px-4 py-8 space-y-8' : 'px-12 sm:px-16 lg:px-20'
        }`}
      >
        {/* Filters */}
        <div className="mb-8">
          <CourseFilter />
        </div>

        {/* Course List */}
        <CourseList courses={courses} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 mb-4">
            <CoursePagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={count}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

