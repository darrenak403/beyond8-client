"use client";

import { CourseSummary, CourseDetail as CourseDetailType } from "@/lib/api/services/fetchCourse";
import CourseHero from "./CourseHero";
import CourseSidebar from "./CourseSidebar";
import CourseCurriculum from "./CourseCurriculum";
import CourseDescription from "./CourseDescription";
import CourseReview from "./CourseReview";
import { useGetMyEnrollments } from "@/hooks/useEnroll";
import { useMemo } from "react";

interface CourseDetailProps {
  courseData: CourseSummary | CourseDetailType;
  /**
   * summary: dùng cho trang public (useGetCourseSummary)
  ùng cho instructor * preview: d preview (useGetCourseDetailsPreview)
   */
  mode: "summary" | "details" | "preview";
  onLessonSelect?: (sectionId: string, lessonId: string) => void;
  instructor?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  enrollmentId?: string;
}

export default function CourseDetail({
  courseData,
  mode,
  onLessonSelect,
  instructor,
  enrollmentId,
}: CourseDetailProps) {
  // Get enrollment if not provided
  const { enrollments } = useGetMyEnrollments();
  const enrollment = useMemo(() => {
    if (enrollmentId) return { id: enrollmentId };
    return enrollments.find((e) => e.courseId === courseData.id);
  }, [enrollments, courseData.id, enrollmentId]);

  const currentEnrollmentId = enrollment?.id;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section - Full Width */}
      <CourseHero course={courseData} instructor={instructor} enrollmentId={currentEnrollmentId} />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description & Outcomes */}
            <div id="description">
              <CourseDescription course={courseData} />
            </div>

            {/* Curriculum */}
            <div id="curriculum" className="scroll-mt-24">
              <CourseCurriculum
                course={courseData}
                mode={mode}
                onLessonSelect={onLessonSelect}
                enrollmentId={currentEnrollmentId}
              />
            </div>
            {/* Reviews */}
            <div id="reviews" className="scroll-mt-24">
              <CourseReview
                courseId={courseData.id}
                enrollmentId={currentEnrollmentId}
                totalReviews={courseData.totalReviews}
              />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 relative">
            <CourseSidebar course={courseData} preview={mode === "preview"} />
          </div>
        </div>
      </div>
    </div>
  );
}
