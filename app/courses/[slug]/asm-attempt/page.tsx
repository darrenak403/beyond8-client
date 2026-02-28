'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetAssignmentByIdForStudent, useGetSubmissionByStudent, useSubmitAssignment } from '@/hooks/useAssignment'
import AssignmentOverview from '../[courseId]/(exam-attempt)/[sectionId]/asm-attempt/[assignmentId]/components/AssignmentOverview'
import AssignmentSubmission from '../[courseId]/(exam-attempt)/[sectionId]/asm-attempt/[assignmentId]/components/AssignmentSubmission'
import AssignmentSkeleton from '../[courseId]/(exam-attempt)/[sectionId]/asm-attempt/[assignmentId]/components/AssignmentSkeleton'
import SubmissionHistory from '../[courseId]/(exam-attempt)/[sectionId]/asm-attempt/[assignmentId]/components/SubmissionHistory'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SubmissionAssigment } from '@/lib/api/services/fetchAssignment'
import { useCheckEnrollment, useGetCurriculumProgress } from '@/hooks/useEnroll'
import { useGetCourseDetails } from '@/hooks/useCourse'
import { LessonType } from '@/lib/api/services/fetchLesson'
import Link from 'next/link'
import { useRequestAssignmentReassign } from '@/hooks/useReassign'
import { RequestReassignDialog } from '@/components/widget/reassign/RequestReassignDialog'
import { decodeCompoundId } from '@/utils/crypto'
import { courseUrl, nextLessonUrl, quizOverviewUrl } from '@/utils/courseUrls'

export default function AssignmentAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params?.slug as string

  // id = enc(courseId|sectionId|assignmentId)
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''
  const sectionId = ids[1] || ''
  const assignmentId = ids[2] || ''

  const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentByIdForStudent(assignmentId)
  const { submissions, isLoading: isLoadingSubmission } = useGetSubmissionByStudent(assignmentId)
  const { submitAssignment, isPending: isSubmitting } = useSubmitAssignment(assignmentId)
  const { courseDetails: course } = useGetCourseDetails(courseId)

  const defaultSubmission = useMemo(() =>
    submissions && submissions.length > 0 ? submissions[0] : undefined,
    [submissions]
  )

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionAssigment | undefined>(undefined)
  const [isResubmitting, setIsResubmitting] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const { requestAssignmentReassign, isPending: isRequesting } = useRequestAssignmentReassign()

  const currentSubmission = selectedSubmission || defaultSubmission

  const isPassed = useMemo(() => {
    if (currentSubmission && currentSubmission.finalScore !== null && assignment) {
      const percent = (currentSubmission.finalScore / assignment.totalPoints) * 100
      return percent >= assignment.passScorePercent
    }
    return false
  }, [currentSubmission, assignment])

  const handleSubmit = (data: { textContent: string; fileUrls: string[] }) => {
    submitAssignment(data)
  }

  const handleSelectSubmission = (submission: SubmissionAssigment) => {
    setSelectedSubmission(submission)
  }

  const { enrollmentId: userEnrollmentId } = useCheckEnrollment(courseId, { enabled: !!courseId })
  const { curriculumProgress } = useGetCurriculumProgress(userEnrollmentId || undefined, { enabled: !!userEnrollmentId })
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

  const hasReachedMaxSubmissions = submissions && assignment && submissions.length >= assignment.maxSubmissions
  const canResubmit = currentSubmission?.finalScore !== null && currentSubmission?.finalScore !== undefined && !hasReachedMaxSubmissions && !isPassed

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" className="rounded-2xl border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 hover:text-brand-magenta" onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          {/* Next section / complete course logic */}
          {course && (() => {
            const sectionIndex = course.sections.findIndex(s => s.id === sectionId)
            const nextSection = sectionIndex !== -1 && sectionIndex < course.sections.length - 1 ? course.sections[sectionIndex + 1] : null
            const nextLesson = nextSection && nextSection.lessons.length > 0 ? nextSection.lessons[0] : null
            if (!nextLesson) {
              return (
                <Button className={`rounded-full px-6 h-10 font-medium border-none ${progressPercent === 100 ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={progressPercent !== 100} onClick={() => { if (progressPercent === 100) window.location.href = courseUrl(slug, courseId) }}>
                  Hoàn thành khóa học
                </Button>
              )
            }
            let buttonText = "Chương tiếp theo"
            let targetUrl = nextLessonUrl(slug, courseId, nextLesson)
            if (nextLesson.type === LessonType.Quiz) {
              const quizId = (nextLesson as any).quizId
              targetUrl = quizOverviewUrl(slug, courseId, nextLesson.sectionId, nextLesson.id, quizId)
              buttonText = "Bài kiểm tra"
            }
            return (
              <div className="flex flex-col gap-2">
                <div className={!isPassed ? "cursor-not-allowed opacity-50" : ""}>
                  <Link href={isPassed ? targetUrl : "#"} aria-disabled={!isPassed} className={!isPassed ? "pointer-events-none" : ""}>
                    <Button disabled={!isPassed} className={`rounded-full border-none shadow-lg px-6 h-10 transition-all font-medium ${!isPassed ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-linear-to-r from-purple-900 to-purple-700 hover:opacity-90 text-white'}`}>
                      {buttonText} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })()}
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={submissions && submissions.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <AssignmentOverview assignment={assignment} />
            </div>
            {submissions && submissions.length > 0 && (
              <div className="lg:col-span-1 space-y-4">
                {canResubmit && !isResubmitting && (<Button variant="outline" onClick={() => setIsResubmitting(true)} className="w-full text-brand-purple border-brand-purple/20 hover:bg-brand-purple/10 rounded-xl">Nộp lại bài</Button>)}
                {hasReachedMaxSubmissions && !isPassed && (<Button variant="outline" onClick={() => setShowRequestDialog(true)} className="w-full text-brand-magenta border-brand-magenta/20 hover:bg-brand-magenta/10 rounded-xl hover:text-brand-magenta">Yêu cầu thêm lượt nộp bài</Button>)}
                <SubmissionHistory submissions={submissions} selectedSubmissionId={currentSubmission?.id} onSelectSubmission={handleSelectSubmission} />
              </div>
            )}
          </div>
          <div>
            {!hasReachedMaxSubmissions || (hasReachedMaxSubmissions && currentSubmission && !isResubmitting) || isPassed ? (
              <div className="space-y-4">
                {isPassed && !isResubmitting && (<div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700"><CheckCircle2 className="w-5 h-5" /><span className="font-medium">Bạn đã đạt yêu cầu bài tập này</span></div>)}
                <AssignmentSubmission assignment={assignment} submission={isResubmitting ? undefined : currentSubmission} onSubmit={handleSubmit} isSubmitting={isSubmitting} isResubmitting={isResubmitting} onCancelResubmit={() => setIsResubmitting(false)} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
                <div className="p-4 bg-brand-magenta/5 text-brand-magenta rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Clock className="w-8 h-8" /></div>
                <div><h3 className="text-xl font-bold text-gray-900">Hết lượt nộp bài</h3><p className="text-muted-foreground mt-1">Bạn đã nộp đủ số lần quy định cho bài tập này.</p></div>
                {!isPassed && (<Button variant="outline" onClick={() => setShowRequestDialog(true)} className="text-brand-magenta border-brand-magenta/20 hover:bg-brand-magenta/10 hover:text-brand-magenta rounded-xl">Yêu cầu thêm lượt nộp bài</Button>)}
              </div>
            )}
          </div>
        </div>
      </main>
      <RequestReassignDialog open={showRequestDialog} onOpenChange={setShowRequestDialog} title="Yêu cầu thêm lượt nộp bài" description="Bạn đã hết lượt nộp bài tập này. Vui lòng gửi yêu cầu để giảng viên cấp thêm lượt cho bạn." isPending={isRequesting} onSubmit={async (reason, note) => { await requestAssignmentReassign({ assignmentId, request: { reason, note } }) }} />
      <Footer />
    </div>
  )
}
