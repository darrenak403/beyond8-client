'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetAssignmentByIdForStudent, useGetSubmissionByStudent, useSubmitAssignment } from '@/hooks/useAssignment'
import AssignmentOverview from './components/AssignmentOverview'
import AssignmentSubmission from './components/AssignmentSubmission'
import AssignmentSkeleton from './components/AssignmentSkeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AssignmentAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params?.assignmentId as string

  const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentByIdForStudent(assignmentId)
  const { submissions, isLoading: isLoadingSubmission } = useGetSubmissionByStudent(assignmentId)
  const { submitAssignment, isPending: isSubmitting } = useSubmitAssignment(assignmentId)

  // Take the first submission (latest attempt) from the list
  const submission = submissions && submissions.length > 0 ? submissions[0] : undefined

  const handleSubmit = (data: { textContent: string; fileUrls: string[] }) => {
    submitAssignment(data)
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

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <AssignmentOverview assignment={assignment} />
          </div>

          <div className="space-y-6">
            <AssignmentSubmission
              assignment={assignment}
              submission={submission}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}