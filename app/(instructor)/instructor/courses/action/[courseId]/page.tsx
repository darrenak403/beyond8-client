'use client'

import { useParams } from 'next/navigation'
import { useGetCourseById } from '@/hooks/useCourse'
import { CourseAction } from '../page'

export default function EditCoursePage() {
    const params = useParams()
    const courseId = params.courseId as string
    const { course, isLoading } = useGetCourseById(courseId)

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Đang tải dữ liệu khóa học...</div>
    }

    return (
        <CourseAction initialData={course} isEditMode={true} />
    )
}
