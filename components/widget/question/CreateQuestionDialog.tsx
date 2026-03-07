"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, CheckCircle2, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateQuestion, useGetQuestionTagsCount } from "@/hooks/useQuestion"
import { QuestionType, QuestionDifficulty } from "@/lib/api/services/fetchQuestion"

interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

interface CreateQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
}

export function CreateQuestionDialog({ open, onOpenChange, onCancel }: CreateQuestionDialogProps) {
  const [content, setContent] = useState("")
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: crypto.randomUUID(), text: "", isCorrect: false }
  ])
  const [explanation, setExplanation] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(QuestionDifficulty.Easy)
  const [points, setPoints] = useState(1)

  const {
    createQuestion,
    isLoading,
    isSuccess,
    reset,
  } = useCreateQuestion()

  const { tags: availableTags } = useGetQuestionTagsCount()

  // Memoize availableTags to prevent unnecessary re-renders
  const memoizedAvailableTags = useMemo(() => availableTags, [availableTags])

  const prevOpenRef = useRef(open)

  // Reset form when dialog opens (transitions from closed to open)
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Dialog just opened, reset all form state
      // Using setTimeout to make state update asynchronous and avoid lint warning
      const timeoutId = setTimeout(() => {
        setContent("")
        setOptions([{ id: crypto.randomUUID(), text: "", isCorrect: false }])
        setExplanation("")
        setTags([])
        setTagInput("")
        setDifficulty(QuestionDifficulty.Easy)
        setPoints(1)
        reset()
      }, 0)
      prevOpenRef.current = open
      return () => clearTimeout(timeoutId)
    }
    prevOpenRef.current = open
  }, [open, reset])

  // Handle dialog close with form reset
  const handleDialogClose = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      // Reset form when dialog closes (backup reset)
      setContent("")
      setOptions([{ id: crypto.randomUUID(), text: "", isCorrect: false }])
      setExplanation("")
      setTags([])
      setTagInput("")
      setDifficulty(QuestionDifficulty.Easy)
      setPoints(1)
      reset()
    }
  }

  // Close dialog on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onOpenChange])

  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: "", isCorrect: false }])
  }

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt))
  }

  const toggleCorrect = (id: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = () => {
    // Validate that at least one option is correct
    const hasCorrectAnswer = options.some(opt => opt.isCorrect && opt.text.trim())
    if (!hasCorrectAnswer) {
      return
    }

    const questionData = {
      content: content.trim(),
      type: QuestionType.MultipleChoice,
      options: options
        .filter(opt => opt.text.trim()) // Only include options with text
        .map(opt => ({
          id: opt.id,
          text: opt.text.trim(),
          isCorrect: opt.isCorrect
        })),
      explanation: explanation.trim() || null,
      tags,
      difficulty,
      points
    }

    createQuestion(questionData)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent 
        key={open ? 'open' : 'closed'}
        className="max-w-3xl max-h-[90vh] overflow-hidden border-brand-magenta/20 bg-white/95 backdrop-blur-xl flex flex-col p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-4 bg-white">
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
            Tạo câu hỏi mới
          </DialogTitle>
          <DialogDescription>
            Tạo câu hỏi trắc nghiệm cho ngân hàng câu hỏi của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-6 py-4">
          {/* Question Content */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung câu hỏi..."
              className="min-h-[100px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Các lựa chọn <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                size="sm"
                onClick={addOption}
                className="rounded-full bg-brand-magenta text-white hover:bg-brand-magenta/80"
              >
                <Plus className="h-4 w-4" />
                Thêm lựa chọn
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              {options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => toggleCorrect(option.id)}
                    className={`shrink-0 rounded-full p-1 transition-all ${
                      option.isCorrect
                        ? "bg-green-500 text-white"
                        : "border-2 border-gray-300 text-gray-300 hover:border-green-500"
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Lựa chọn ${index + 1}`}
                    className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                  />

                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="shrink-0 rounded-full p-1 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <p className="text-xs text-muted-foreground">
              Click vào biểu tượng để đánh dấu đáp án đúng
            </p>
          </div>

          {/* Difficulty and Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {([QuestionDifficulty.Easy, QuestionDifficulty.Medium, QuestionDifficulty.Hard] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      difficulty === level
                        ? level === QuestionDifficulty.Easy
                          ? "border-green-500 bg-green-50 text-green-700"
                          : level === QuestionDifficulty.Medium
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Điểm <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={1}
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                className="border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Tags <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Nhập tag và nhấn Enter..."
                className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="rounded-full bg-brand-magenta text-white hover:bg-brand-magenta/80"
              >
                Thêm
              </Button>
            </div>

            {/* Available Tags */}
            {memoizedAvailableTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Tags có sẵn:</p>
                <div className="flex flex-wrap gap-2">
                  {memoizedAvailableTags.map((tagData) => (
                    <button
                      key={tagData.tag}
                      type="button"
                      onClick={() => {
                        if (!tags.includes(tagData.tag)) {
                          setTags([...tags, tagData.tag])
                        }
                      }}
                      disabled={tags.includes(tagData.tag)}
                      className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        tags.includes(tagData.tag)
                          ? "border-brand-purple/30 bg-brand-purple/10 text-brand-purple/50 cursor-not-allowed"
                          : "border-brand-magenta/30 bg-white/80 text-foreground hover:border-brand-magenta hover:bg-linear-to-r hover:from-brand-magenta/10 hover:to-brand-purple/10 hover:shadow-md hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Tag className="mr-1 inline h-3 w-3" />
                      {tagData.tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Tags đã chọn:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-linear-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full transition-all hover:bg-brand-purple/20"
                      >
                        <X className="h-3 w-3 transition-transform group-hover/selected:rotate-90" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Giải thích (tùy chọn)
            </label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Nhập giải thích cho câu hỏi..."
              className="min-h-[80px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
            />
          </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-brand-magenta/10 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                onCancel?.()
              }}
              disabled={isLoading}
              className="rounded-full border-brand-magenta/20"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !content.trim() ||
                options.every(opt => !opt.text.trim()) ||
                tags.length === 0 ||
                !options.some(opt => opt.isCorrect && opt.text.trim())
              }
              className="rounded-full bg-brand-magenta text-white"
            >
              {isLoading ? "Đang tạo..." : "Tạo câu hỏi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
