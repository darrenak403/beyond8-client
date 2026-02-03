"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Home, FolderOpen, Plus } from "lucide-react"
import { TagFolderCard } from "./TagFolderCard"
import { QuestionCard } from "./QuestionCard"
import { useGetQuestionTagsCount, useGetQuestions } from "@/hooks/useQuestion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CreateQuestionDialog } from "@/components/widget/CreateQuestionDialog"
import { CreateQuestionPDFDialog } from "@/components/widget/CreateQuestionPDFDialog"
import { CreateBulkQuestionDialog } from "@/components/widget/CreateBulkQuestionDialog"
import { CreateQuestionMethodDialog } from "@/components/widget/CreateQuestionMethodDialog"
import { Pagination } from "@/components/ui/custom-pagination"

export function QuestionBankExplorer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false)

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

  const { tags, isLoading: isLoadingTags } = useGetQuestionTagsCount()

  const { questions, isLoading: isLoadingQuestions } = useGetQuestions(
    selectedTag
      ? {
          tag: selectedTag,
          pageNumber,
          pageSize,
          isDescending,
        }
      : undefined
  )

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


  const hasNextPage = questions.length === pageSize
  const hasPreviousPage = pageNumber > 1
  const totalPages = hasNextPage ? pageNumber + 1 : pageNumber

  return (
    <div className="space-y-6 py-3">
      {/* Header: Breadcrumb Navigation + Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-md">
          <button
            onClick={handleBackToTags}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-black font-semibold cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Ngân hàng câu hỏi</span>
          </button>
          
          {selectedTag && (
            <>
              <ChevronRight className="h-4 w-4 text-black font-semibold" />
                <div className="flex items-center gap-2 rounded-lg text-brand-magenta transition-all hover:text-brand-magenta/80">
                  <FolderOpen className="h-4 w-4" />
                <span>{selectedTag}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            onClick={() => setIsMethodDialogOpen(true)}
            className="group relative rounded-full bg-brand-magenta text-white"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Tạo câu hỏi
          </Button>
        </motion.div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!selectedTag ? (
          // Tags Grid View
          <motion.div
            key="tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {isLoadingTags ? (
              // Loading skeleton for tags
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-2xl" />
              ))
            ) : tags.length > 0 ? (
              tags.map((tagData, index) => (
                <motion.div
                  key={tagData.tag}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TagFolderCard
                    tag={tagData.tag}
                    count={tagData.count}
                    onClick={() => handleTagClick(tagData.tag)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center bg-white/80 p-12 text-center backdrop-blur-xl dark:bg-black/80"
              >
                <FolderOpen className="mb-4 h-16 w-16 text-brand-magenta/40" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Chưa có thư mục
                </h3>
                <p className="text-muted-foreground">
                  Hiện chưa có thư mục câu hỏi nào.
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Questions List View
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {isLoadingQuestions ? (
              // Loading skeleton for questions
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-48 rounded-2xl" />
              ))
            ) : questions.length > 0 ? (
              <>
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                  />
                ))}
                {/* Pagination */}
                <Pagination
                  currentPage={pageNumber}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-brand-magenta/20 bg-white/80 p-12 text-center backdrop-blur-xl"
              >
                <FolderOpen className="mb-4 h-16 w-16 text-brand-magenta/40" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Chưa có câu hỏi
                </h3>
                <p className="text-muted-foreground">
                  Thư mục này hiện chưa có câu hỏi nào.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <CreateQuestionMethodDialog
        open={isMethodDialogOpen}
        onOpenChange={setIsMethodDialogOpen}
        onSelectSingle={() => setIsCreateDialogOpen(true)}
        onSelectBulk={() => setIsBulkDialogOpen(true)}
        onSelectPDF={() => setIsPDFDialogOpen(true)}
      />
      <CreateQuestionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCancel={() => setIsMethodDialogOpen(true)}
      />
      <CreateBulkQuestionDialog
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
        onCancel={() => setIsMethodDialogOpen(true)}
      />
      <CreateQuestionPDFDialog
        open={isPDFDialogOpen}
        onOpenChange={setIsPDFDialogOpen}
        onCancel={() => setIsMethodDialogOpen(true)}
      />
    </div>
  )
}
