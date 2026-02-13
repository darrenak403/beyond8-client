'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetAssignmentByIdForStudent, useGetSubmissionByStudent, useSubmitAssignment } from '@/hooks/useAssignment'
import AssignmentOverview from './components/AssignmentOverview'
import AssignmentSubmission from './components/AssignmentSubmission'
import AssignmentSkeleton from './components/AssignmentSkeleton'
import SubmissionHistory from './components/SubmissionHistory'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SubmissionAssigment } from '@/lib/api/services/fetchAssignment'

export default function AssignmentAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params?.assignmentId as string

  const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentByIdForStudent(assignmentId)
  const { submissions, isLoading: isLoadingSubmission } = useGetSubmissionByStudent(assignmentId)
  const { submitAssignment, isPending: isSubmitting } = useSubmitAssignment(assignmentId)

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
        <Button
          variant="outline"
          className="mb-6 rounded-2xl border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 hover:text-brand-magenta"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại bài học
        </Button>

        <div className="space-y-8">
          {/* Row 1: Overview + Submission History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Overview */}
            <div className="lg:col-span-2">
              <AssignmentOverview assignment={assignment} />
            </div>

            {/* Submission History */}
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

              {submissions && submissions.length > 0 && (
                <SubmissionHistory
                  submissions={submissions}
                  selectedSubmissionId={currentSubmission?.id}
                  onSelectSubmission={handleSelectSubmission}
                />
              )}
            </div>
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
