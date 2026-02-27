"use client"

import { useGetSubmissionSumary } from "@/hooks/useAssignment"
import { useGetSectionsByCourseId } from "@/hooks/useSection"
import { GradingSectionView } from "@/app/(instructor)/instructor/grading/components/GradingSectionView"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion } from "@/components/ui/accordion"

interface GradingCourseDetailProps {
    courseId: string
    onSelectAssignment: (assignmentId: string) => void
}

export function GradingCourseDetail({ courseId, onSelectAssignment }: GradingCourseDetailProps) {
    // Fetch submission summary (for counts)
    const { submissions: summaryData, isLoading: isLoadingSummary } = useGetSubmissionSumary(courseId)

    // Fetch sections for the course to get names and structure
    const { sections, isLoading: isLoadingSections } = useGetSectionsByCourseId(courseId)

    if (isLoadingSummary || isLoadingSections) {
        return (
            <div className="space-y-6 pt-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))}
            </div>
        )
    }

    if (!sections || sections.length === 0) {
        return <div className="p-8 text-center text-muted-foreground bg-white/50 rounded-2xl border border-dashed border-brand-magenta/20 backdrop-blur-sm">Khóa học chưa có chương nào.</div>
    }

    return (
        <div className="space-y-4 p-1">
            <Accordion type="multiple" className="w-full">
                {sections.map((section) => {
                    // Find summary for this section if any
                    const sectionSummary = summaryData?.sections?.find(s => s.sectionId === section.id)
                    const ungradedCount = sectionSummary?.ungradedSubmissions || 0
                    const totalSubmissions = sectionSummary?.totalSubmissions || 0

                    return (
                        <GradingSectionView
                            key={section.id}
                            section={section}
                            ungradedCount={ungradedCount}
                            totalSubmissions={totalSubmissions}
                            onSelectAssignment={onSelectAssignment}
                        />
                    )
                })}
            </Accordion>
        </div>
    )
}
