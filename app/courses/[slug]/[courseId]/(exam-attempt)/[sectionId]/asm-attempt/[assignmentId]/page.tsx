'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetAssignmentByIdForStudent, useGetSubmissionByStudent, useSubmitAssignment } from '@/hooks/useAssignment'
import AssignmentOverview from './components/AssignmentOverview'
import AssignmentSubmission from './components/AssignmentSubmission'
import AssignmentSkeleton from './components/AssignmentSkeleton'
import SubmissionHistory from './components/SubmissionHistory'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SubmissionAssigment } from '@/lib/api/services/fetchAssignment'
import { useCheckEnrollment, useGetCurriculumProgress } from '@/hooks/useEnroll'

import { useGetCourseDetails } from '@/hooks/useCourse'
import { LessonType } from '@/lib/api/services/fetchLesson'
import Link from 'next/link'
// ... imports

export default function AssignmentAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params?.assignmentId as string
  const slug = params?.slug as string
  const courseId = params?.courseId as string
  const sectionId = params?.sectionId as string

  const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentByIdForStudent(assignmentId)
  const { submissions, isLoading: isLoadingSubmission } = useGetSubmissionByStudent(assignmentId)
  const { submitAssignment, isPending: isSubmitting } = useSubmitAssignment(assignmentId)
  const { courseDetails: course } = useGetCourseDetails(courseId)

  // Get the default submission (latest)
  const defaultSubmission = useMemo(() =>
    submissions && submissions.length > 0 ? submissions[0] : undefined,
    [submissions]
  )

  // State for selected submission
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionAssigment | undefined>(undefined)
  const [isResubmitting, setIsResubmitting] = useState(false)

  // Use default submission if no selection has been made
  const currentSubmission = selectedSubmission || defaultSubmission

  const handleSubmit = (data: { textContent: string; fileUrls: string[] }) => {
    submitAssignment(data)
  }

  const handleSelectSubmission = (submission: SubmissionAssigment) => {
    setSelectedSubmission(submission)
  }

  // 1. Kiểm tra enrollment để lấy enrollmentId
  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, {
    enabled: !!courseId,
  })

  // 1.2 Curriculum Progress
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, {
    enabled: !!userEnrollmentId
  })

  const progressPercent = curriculumProgress?.progressPercent || 0

  if (isLoadingAssignment || isLoadingSubmission) {
    return <AssignmentSkeleton />
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin bài tập</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Check if can resubmit
  const canResubmit = currentSubmission?.finalScore !== null && currentSubmission?.finalScore !== undefined

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            className="rounded-2xl border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 hover:text-brand-magenta"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {course && (() => {
            // Find current section index
            const sectionIndex = course.sections.findIndex(s => s.id === sectionId)
            // Next lesson is the first lesson of the next section
            const nextSection = sectionIndex !== -1 && sectionIndex < course.sections.length - 1 ? course.sections[sectionIndex + 1] : null
            const nextLesson = nextSection && nextSection.lessons.length > 0 ? nextSection.lessons[0] : null

            if (!nextLesson) {
              return (
                <Button
                  className={`rounded-full px-6 h-10 font-medium border-none ${(progressPercent === 100)
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={progressPercent !== 100}
                  onClick={() => {
                    if (progressPercent === 100) {
                      // Navigate to course home
                      window.location.href = `/courses/${slug}/${courseId}`
                    }
                  }}
                >
                  Hoàn thành khóa học
                </Button>
              )
            }

            const getNextButtonText = () => {
              if (nextLesson.type === LessonType.Quiz) {
                return "Bài kiểm tra"
              }
              return "Bài tiếp theo"
            }

            const getNextLessonUrl = () => {
              if (nextLesson.type === LessonType.Quiz) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const quizId = (nextLesson as any).quizId
                return `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}/quiz-attempt?quizId=${quizId}`
              }
              return `/courses/${slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`
            }

            const buttonText = getNextButtonText()
            const targetUrl = getNextLessonUrl()

            return (
              <Link href={targetUrl}>
                <Button className="rounded-full bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white border-none shadow-lg px-6 h-10 transition-all font-medium">
                  {buttonText} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )
          })()}
        </div>

        <div className="space-y-8">
          {/* Row 1: Overview + Submission History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Overview */}
            <div className={submissions && submissions.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <AssignmentOverview assignment={assignment} />
            </div>

            {/* Submission History */}
            {submissions && submissions.length > 0 && (
              <div className="lg:col-span-1 space-y-4">
                {canResubmit && !isResubmitting && (
                  <Button
                    variant="outline"
                    onClick={() => setIsResubmitting(true)}
                    className="w-full text-brand-purple border-brand-purple/20 hover:bg-brand-purple/10 rounded-xl"
                  >
                    Nộp lại bài
                  </Button>
                )}

                <SubmissionHistory
                  submissions={submissions}
                  selectedSubmissionId={currentSubmission?.id}
                  onSelectSubmission={handleSelectSubmission}
                />
              </div>
            )}
          </div>

          {/* Row 2: Submission Results */}
          <div>
            <AssignmentSubmission
              assignment={assignment}
              submission={currentSubmission}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isResubmitting={isResubmitting}
              onCancelResubmit={() => setIsResubmitting(false)}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
