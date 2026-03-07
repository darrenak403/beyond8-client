"use client"

import { useState } from "react"

import { useGetCourseByInstructor } from "@/hooks/useCourse"
import { useAuth } from "@/hooks/useAuth"
import { Course, CourseLevel, CourseStatus } from "@/lib/api/services/fetchCourse"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"

import { motion } from "framer-motion"
import CoursePagination from "@/app/courses/components/CoursePagination"
import GradingCourseGridItem from "./GradingCourseGridItem"

interface GradingCourseListProps {
    onSelectCourse: (courseId: string) => void
}

export function GradingCourseList({ onSelectCourse }: GradingCourseListProps) {
    const { user } = useAuth()
    const [page, setPage] = useState(1)
    const pageSize = 12

    // Fetch all courses for the instructor
    const { courses, isLoading, totalPages, count } = useGetCourseByInstructor({
        instructorId: user?.id,
        pageNumber: page,
        pageSize: pageSize,
        isDescending: true,
        status: CourseStatus.Published,
        level: 'All' as CourseLevel // Cast to satisfy type
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-[320px] rounded-2xl" />
                ))}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {courses.length > 0 ? (
                courses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <GradingCourseGridItem
                            course={course as Course}
                            onSelect={onSelectCourse}
                        />
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted/50 p-6 mb-4">
                        <BookOpen className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Không tìm thấy khóa học nào</h3>
                    <p className="text-muted-foreground mt-1">Bạn chưa được phân công khóa học nào để giảng dạy.</p>
                </div>
            )}


            {courses.length > 0 && (
                <div className="col-span-full mt-6">
                    <CoursePagination
                        currentPage={page}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={count}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </motion.div>
    )
}
