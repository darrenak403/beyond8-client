'use client'

import CourseCard from '@/app/courses/components/CourseCard'
import { Course as MockCourse } from '@/lib/data/mockCourses'
import { Course as ApiCourse, CourseLevel, CourseStatus } from '@/lib/api/services/fetchCourse'

interface InstructorCoursesProps {
  courses: MockCourse[]
}

// Convert mock Course to API Course format
function convertMockCourseToApiCourse(mockCourse: MockCourse): ApiCourse {
  // Parse duration string (e.g., "44 giờ" or "30 giờ") to minutes
  const parseDurationToMinutes = (duration: string): number => {
    const match = duration.match(/(\d+)\s*giờ/)
    if (match) {
      return parseInt(match[1]) * 60
    }
    return 0
  }

  // Map level string to CourseLevel enum
  const mapLevel = (level: string): CourseLevel => {
    switch (level) {
      case 'Beginner':
        return CourseLevel.Beginner
      case 'Intermediate':
        return CourseLevel.Intermediate
      case 'Advanced':
        return CourseLevel.Advanced
      case 'Expert':
        return CourseLevel.Expert
      default:
        return CourseLevel.Beginner
    }
  }

  return {
    id: mockCourse.id,
    title: mockCourse.title,
    slug: mockCourse.slug || '',
    shortDescription: mockCourse.shortDescription || mockCourse.description || '',
    categoryId: mockCourse.categoryId || '',
    categoryName: mockCourse.category,
    instructorId: mockCourse.instructorId || '',
    instructorName: mockCourse.instructor,
    status: CourseStatus.Published,
    level: mapLevel(mockCourse.level),
    language: mockCourse.language || 'vi-VN',
    price: mockCourse.price,
    // Pricing fields required by ApiCourse
    discountPercent: 0,
    discountAmount: 0,
    discountEndsAt: null,
    finalPrice: mockCourse.price,
    thumbnailUrl: mockCourse.thumbnailUrl,
    totalStudents: mockCourse.students,
    totalSections: 0,
    totalLessons: 0,
    totalDurationMinutes: parseDurationToMinutes(mockCourse.duration),
    avgRating: mockCourse.rating.toString(),
    totalReviews: 0,
    outcomes: mockCourse.outcomes,
    requirements: mockCourse.requirements,
    targetAudience: mockCourse.targetAudience,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export default function InstructorCourses({ courses }: InstructorCoursesProps) {
  const apiCourses = courses.map(convertMockCourseToApiCourse)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold border-l-4 border-brand-pink pl-3">Các khóa học ({courses.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apiCourses.map(course => (
          <div key={course.id} className="h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  )
}
