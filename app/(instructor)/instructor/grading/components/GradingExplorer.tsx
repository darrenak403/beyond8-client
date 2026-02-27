"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { GradingView } from "./GradingView"

export function GradingExplorer() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const selectedCourseId = searchParams.get('courseId')
    const selectedAssignmentId = searchParams.get('assignmentId')

    useEffect(() => {
        if (!selectedCourseId) {
            router.replace('/instructor/courses')
        }
    }, [selectedCourseId, router])

    const handleAssignmentClick = (assignmentId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('assignmentId', assignmentId)
        router.push(`?${params.toString()}`)
    }

    const handleBackToAssignments = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('assignmentId')
        router.push(`?${params.toString()}`)
    }

    if (!selectedCourseId) return null

    return (
        <GradingView
            selectedCourseId={selectedCourseId}
            selectedAssignmentId={selectedAssignmentId}
            onAssignmentClick={handleAssignmentClick}
            onBackToAssignments={handleBackToAssignments}
        />
    )
}

