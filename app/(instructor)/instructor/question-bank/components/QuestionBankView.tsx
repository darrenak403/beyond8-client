"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Home, FolderOpen, Plus, ArrowLeft } from "lucide-react"
import { Question, QuestionDifficulty } from "@/lib/api/services/fetchQuestion"
import { TagFolderCard } from "./TagFolderCard"
import { QuestionCard } from "./QuestionCard"
import { useGetQuestionTagsCount, useGetQuestions } from "@/hooks/useQuestion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pagination } from "@/components/ui/custom-pagination"
import { CreateQuestionMethodDialog } from "@/components/widget/question/CreateQuestionMethodDialog"
import { CreateQuestionDialog } from "@/components/widget/question/CreateQuestionDialog"
import { CreateBulkQuestionDialog } from "@/components/widget/question/CreateBulkQuestionDialog"
import { CreateQuestionPDFDialog } from "@/components/widget/question/CreateQuestionPDFDialog"
import { cn } from "@/lib/utils"

interface QuestionBankViewProps {
    selectedTag: string | null
    pageNumber: number
    pageSize: number
    isDescending: boolean
    onTagClick: (tag: string) => void
    onPageChange: (page: number) => void
    onBackToTags: () => void
    onSelect?: (question: Question) => void
    onInteractingWithDialog?: (isInteracting: boolean) => void
    selectionMode?: "single" | "multiple"
    selectedIds?: Set<string>
    onToggleSelect?: (question: Question) => void
    onCurrentPageQuestions?: (questions: Question[]) => void
    isInDialog?: boolean
    onSelectAll?: () => void
    selectAllDisabled?: boolean
}

export function QuestionBankView({
    selectedTag,
    pageNumber,
    pageSize,
    isDescending,
    onTagClick,
    onPageChange,
    onBackToTags,
    onSelect,
    onInteractingWithDialog,
    selectionMode = "single",
    selectedIds,
    onToggleSelect,
    onCurrentPageQuestions,
    isInDialog = false,
    onSelectAll,
    selectAllDisabled = false,
}: QuestionBankViewProps) {
    const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
    const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false)
    const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | undefined>(undefined)

    // Notify parent when any dialog is open
    useEffect(() => {
        if (onInteractingWithDialog) {
            onInteractingWithDialog(isMethodDialogOpen || isCreateDialogOpen || isBulkDialogOpen || isPDFDialogOpen)
        }
    }, [isMethodDialogOpen, isCreateDialogOpen, isBulkDialogOpen, isPDFDialogOpen, onInteractingWithDialog])

    const { tags, isLoading: isLoadingTags } = useGetQuestionTagsCount()

    const { questions, isLoading: isLoadingQuestions } = useGetQuestions(
        selectedTag
            ? {
                tag: selectedTag,
                pageNumber,
                pageSize,
                isDescending,
                difficulty: selectedDifficulty,
            }
            : undefined
    )

    // Expose current page questions to parent for "Select All"
    // Use a ref to compare IDs and avoid infinite loops from unstable array references
    const prevQuestionIdsRef = useRef<string>("")
    useEffect(() => {
        const newIds = questions.map(q => q.id).join(",")
        if (newIds !== prevQuestionIdsRef.current) {
            prevQuestionIdsRef.current = newIds
            onCurrentPageQuestions?.(questions)
        }
    })

    const allCurrentSelected = questions.length > 0 && questions.every(q => selectedIds?.has(q.id))

    const hasNextPage = questions.length === pageSize
    const hasPreviousPage = pageNumber > 1
    const totalPages = hasNextPage ? pageNumber + 1 : pageNumber

    return (
        <div className="space-y-6 py-3 relative">
            {/* Header: Breadcrumb Navigation + Action Buttons */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 -mx-2 px-2 border-b border-transparent transition-all data-[scrolled=true]:border-border/50 rounded-lg">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-md">
                    {!isInDialog && (
                        <>
                            <Link href="/instructor/courses">
                                <Button variant="ghost" className="h-8 hover:bg-black/5 mr-2 gap-2 text-muted-foreground hover:text-foreground" title="Quản lý khóa học">
                                    <ArrowLeft className="h-4 w-4" />
                                    Quản lý khóa học
                                </Button>
                            </Link>
                            <div className="h-4 w-px bg-border mx-2" />
                        </>
                    )}
                    <button
                        onClick={onBackToTags}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-black font-semibold cursor-pointer hover:bg-black/5"
                    >
                        <Home className="h-4 w-4" />
                        <span>Ngân hàng câu hỏi</span>
                    </button>

                    {selectedTag && (
                        <>
                            <ChevronRight className="h-4 w-4 text-black font-semibold" />
                            <div className="flex items-center gap-2 rounded-lg text-brand-magenta transition-all hover:text-brand-magenta/80 font-medium">
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
                    className="flex items-center gap-2"
                >
                    {/* Difficulty Filter - shown when a tag is selected */}
                    {selectedTag && (
                        <div className="flex items-center gap-1.5">
                            {([undefined, QuestionDifficulty.Easy, QuestionDifficulty.Medium, QuestionDifficulty.Hard] as const).map((d) => {
                                const labels: Record<string, string> = {
                                    [QuestionDifficulty.Easy]: "Dễ",
                                    [QuestionDifficulty.Medium]: "Trung Bình",
                                    [QuestionDifficulty.Hard]: "Khó",
                                }
                                const colors: Record<string, string> = {
                                    [QuestionDifficulty.Easy]: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
                                    [QuestionDifficulty.Medium]: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
                                    [QuestionDifficulty.Hard]: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
                                }
                                const activeColors: Record<string, string> = {
                                    [QuestionDifficulty.Easy]: "bg-green-500 text-white border-green-500",
                                    [QuestionDifficulty.Medium]: "bg-yellow-500 text-white border-yellow-500",
                                    [QuestionDifficulty.Hard]: "bg-red-500 text-white border-red-500",
                                }
                                const isActive = selectedDifficulty === d
                                const label = d === undefined ? "Tất cả" : labels[d]
                                const colorClass = d === undefined
                                    ? isActive ? "bg-gray-700 text-white border-gray-700" : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                    : isActive ? activeColors[d] : colors[d]
                                return (
                                    <button
                                        key={d ?? "all"}
                                        onClick={() => setSelectedDifficulty(d)}
                                        className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border transition-all", colorClass)}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                            <div className="h-5 w-px bg-gray-200 mx-1" />
                        </div>
                    )}
                    {onSelectAll && selectedTag && questions.length > 0 && (
                        <Button
                            onClick={onSelectAll}
                            variant="outline"
                            disabled={selectAllDisabled || allCurrentSelected}
                            className={cn(
                                "px-3 py-1.5 text-sm font-semibold rounded-full border transition-all hover:bg-primary/10 hover:text-primary",
                                allCurrentSelected || selectAllDisabled
                                    ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                                    : "border-brand-magenta text-brand-magenta"
                            )}
                        >
                            {allCurrentSelected ? "Đã chọn hết trang" : `Chọn tất cả (${questions.length})`}
                        </Button>
                    )}
                    <Button
                        onClick={() => setIsMethodDialogOpen(true)}
                        className="group relative rounded-full bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20 hover:bg-brand-magenta/90"
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
                                        onClick={() => onTagClick(tagData.tag)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full flex flex-col items-center justify-center bg-white/80 p-12 text-center backdrop-blur-xl"
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
                                        onSelect={onSelect}
                                        selectionMode={selectionMode}
                                        isSelected={selectedIds?.has(question.id)}
                                        onToggleSelect={onToggleSelect}
                                    />
                                ))}
                                {/* Pagination */}
                                <Pagination
                                    currentPage={pageNumber}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
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
