"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Tag, Trash2, MousePointerClick, Check } from "lucide-react"
import type { Question, QuestionDifficulty } from "@/lib/api/services/fetchQuestion"
import { useDeleteQuestion } from "@/hooks/useQuestion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface QuestionCardProps {
  question: Question
  index: number
  onSelect?: (question: Question) => void
  selectionMode?: "single" | "multiple"
  isSelected?: boolean
  onToggleSelect?: (question: Question) => void
}

const difficultyColors: Record<QuestionDifficulty, string> = {
  Easy: "text-green-600 bg-green-50 border-green-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Hard: "text-red-600 bg-red-50 border-red-200",
}

export function QuestionCard({
  question,
  index,
  onSelect,
  selectionMode = "single",
  isSelected = false,
  onToggleSelect
}: QuestionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteQuestion, isLoading: isDeleting } = useDeleteQuestion()

  const handleDelete = () => {
    deleteQuestion(question.id)
    setIsDeleteDialogOpen(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // If in multiple mode, clicking anywhere (except buttons) toggles selection
    if (selectionMode === "multiple" && onToggleSelect) {
      e.preventDefault()
      onToggleSelect(question)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handleCardClick}
        className={`group relative overflow-hidden rounded-2xl border bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:bg-black/80
          ${isSelected
            ? "border-brand-magenta bg-brand-magenta/5 ring-1 ring-brand-magenta shadow-brand-magenta/10"
            : "border-brand-magenta/20 shadow-brand-magenta/5 hover:border-brand-magenta/40 hover:shadow-brand-magenta/10"
          }
          ${selectionMode === "multiple" ? "cursor-pointer" : ""}
        `}
      >
        <div className="relative z-10 space-y-4">
          {/* Header with difficulty and points */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyColors[question.difficulty]}`}>
                {question.difficulty}
              </span>
              <span className="rounded-full border border-brand-magenta/20 bg-brand-magenta/10 px-3 py-1 text-xs font-medium text-brand-magenta">
                {question.points} điểm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                {question.type}
              </span>

              {(onSelect || onToggleSelect) && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (selectionMode === "multiple" && onToggleSelect) {
                      onToggleSelect(question)
                    } else if (onSelect) {
                      onSelect(question)
                    }
                  }}
                  size="sm"
                  className={`rounded-full gap-1 px-4 transition-all ${isSelected
                    ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                    : "bg-brand-magenta hover:bg-brand-magenta/90 text-white"
                    }`}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <MousePointerClick className="h-4 w-4" />}
                  {isSelected ? "Đã chọn" : "Chọn"}
                </Button>
              )}

              {!onSelect && !onToggleSelect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDeleteDialogOpen(true)
                  }}
                  className="rounded-full p-1.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-md dark:hover:bg-red-950/30"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-3">
            <p className="font-medium text-foreground leading-relaxed">
              {question.content}
            </p>

            {/* Options */}
            {question.options && question.options.length > 0 && (
              <div className="space-y-2 pl-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start gap-2 text-sm"
                  >
                    {option.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                    )}
                    <span className={option.isCorrect ? "font-medium text-green-700" : "text-muted-foreground"}>
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {question.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-3 py-1 text-xs text-brand-purple"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Explanation (if exists) */}
          {question.explanation && (
            <div className="rounded-lg border border-brand-magenta/10 bg-brand-magenta/5 p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-brand-magenta">Giải thích: </span>
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-brand-magenta/20 bg-white/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
              Xác nhận xóa câu hỏi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-xl border-brand-magenta/20 hover:bg-brand-magenta/10 hover:text-black"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
