"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { QuestionBankView } from "./QuestionBankView"

export function QuestionBankExplorer() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read params from URL (URL is the source of truth)
  const selectedTag = searchParams.get('tag')
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const isDescending = searchParams.get('isDescending') !== 'false'

  // Ensure pagination params exist in URL only when tag is selected (showing QuestionCard)
  useEffect(() => {
    if (!selectedTag) {
      // Remove pagination params when no tag is selected (showing TagFolderCard)
      const params = new URLSearchParams(searchParams.toString())
      let hasChanged = false

      if (searchParams.has('pageNumber')) {
        params.delete('pageNumber')
        hasChanged = true
      }
      if (searchParams.has('pageSize')) {
        params.delete('pageSize')
        hasChanged = true
      }
      if (searchParams.has('isDescending')) {
        params.delete('isDescending')
        hasChanged = true
      }

      if (hasChanged) {
        router.replace(`?${params.toString()}`)
      }
      return
    }

    // When tag is selected, ensure pagination params exist with default values
    const params = new URLSearchParams(searchParams.toString())
    let hasChanged = false

    if (!searchParams.has('pageNumber')) {
      params.set('pageNumber', '1')
      hasChanged = true
    }
    if (!searchParams.has('pageSize')) {
      params.set('pageSize', '10')
      hasChanged = true
    }
    if (!searchParams.has('isDescending')) {
      params.set('isDescending', 'true')
      hasChanged = true
    }

    if (hasChanged) {
      router.replace(`?${params.toString()}`)
    }
  }, [selectedTag, searchParams, router])

  const handleBackToTags = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    params.delete('pageNumber')
    params.delete('pageSize')
    params.delete('isDescending')
    router.replace(`?${params.toString()}`)
  }

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tag', tag)
    params.set('pageNumber', '1')
    if (!params.has('pageSize')) params.set('pageSize', '10')
    if (!params.has('isDescending')) params.set('isDescending', 'true')
    router.replace(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageNumber', newPage.toString())
    router.replace(`?${params.toString()}`)
  }

  return (
    <QuestionBankView
      selectedTag={selectedTag}
      pageNumber={pageNumber}
      pageSize={pageSize}
      isDescending={isDescending}
      onTagClick={handleTagClick}
      onPageChange={handlePageChange}
      onBackToTags={handleBackToTags}
    />
  )
}
