"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Tag, Trash2 } from "lucide-react"
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

interface QuestionCardProps {
  question: Question
  index: number
}

const difficultyColors: Record<QuestionDifficulty, string> = {
  Easy: "text-green-600 bg-green-50 border-green-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Hard: "text-red-600 bg-red-50 border-red-200",
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteQuestion, isLoading: isDeleting } = useDeleteQuestion()

  const handleDelete = () => {
    deleteQuestion(question.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-white/80 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10"
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
              <span className="text-xs text-muted-foreground">
                {question.type}
              </span>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="rounded-full p-1.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-md"
                title="Xóa câu hỏi"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
