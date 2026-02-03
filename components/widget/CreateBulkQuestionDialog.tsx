"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, Trash2, Plus, Tag } from "lucide-react"
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
import { useBulkCreateQuestions, useGetQuestionTagsCount } from "@/hooks/useQuestion"
import { CreateQuestionRequest, QuestionType, QuestionDifficulty, QuestionOption } from "@/lib/api/services/fetchQuestion"
import { toast } from "sonner"

interface CreateBulkQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface QuestionFormData {
  id: string
  content: string
  type: QuestionType
  options: QuestionOption[]
  explanation: string | null
  tags: string[]
  difficulty: QuestionDifficulty
  points: number
}

export function CreateBulkQuestionDialog({ open, onOpenChange }: CreateBulkQuestionDialogProps) {
  const [questions, setQuestions] = useState<QuestionFormData[]>([])
  const [globalTags, setGlobalTags] = useState<string[]>([])
  const [globalTagInput, setGlobalTagInput] = useState("")
  const [tagsApplied, setTagsApplied] = useState(false)
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({})
  
  const {
    bulkCreateQuestions,
    isLoading: isCreating,
    isSuccess: isCreateSuccess,
    reset: resetCreate,
  } = useBulkCreateQuestions()

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
        setQuestions([])
        setGlobalTags([])
        setGlobalTagInput("")
        setTagsApplied(false)
        setTagInputs({})
        resetCreate()
      }, 0)
      prevOpenRef.current = open
      return () => clearTimeout(timeoutId)
    }
    prevOpenRef.current = open
  }, [open, resetCreate])

  // Handle dialog close with form reset
  const handleDialogClose = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      // Reset form when dialog closes (backup reset)
      setQuestions([])
      setGlobalTags([])
      setGlobalTagInput("")
      setTagsApplied(false)
      setTagInputs({})
      resetCreate()
    }
  }

  // Close dialog on success
  useEffect(() => {
    if (isCreateSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isCreateSuccess, onOpenChange])

  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      id: crypto.randomUUID(),
      content: "",
      type: QuestionType.MultipleChoice,
      options: [
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
      explanation: null,
      tags: [],
      difficulty: QuestionDifficulty.Easy,
      points: 1,
    }
    setQuestions([...questions, newQuestion])
    setTagInputs({ ...tagInputs, [newQuestion.id]: "" })
    setTagsApplied(false)
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
    const newTagInputs = { ...tagInputs }
    delete newTagInputs[questionId]
    setTagInputs(newTagInputs)
  }

  const updateQuestion = (
    questionId: string,
    field: keyof QuestionFormData,
    value: string | QuestionType | QuestionDifficulty | number | null
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    )
  }

  const updateOption = (
    questionId: string,
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q
        const options = [...q.options]
        options[optionIndex] = { ...options[optionIndex], [field]: value }
        return { ...q, options }
      })
    )
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: crypto.randomUUID(), text: "", isCorrect: false },
              ],
            }
          : q
      )
    )
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q
        return {
          ...q,
          options: q.options.filter((_, i) => i !== optionIndex),
        }
      })
    )
  }

  const toggleCorrect = (questionId: string, optionIndex: number) => {
    updateOption(questionId, optionIndex, "isCorrect", !questions.find(q => q.id === questionId)?.options[optionIndex].isCorrect)
  }

  const addTagToQuestion = (questionId: string, tag: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q
        if (q.tags.includes(tag)) return q
        return { ...q, tags: [...q.tags, tag] }
      })
    )
  }

  const removeTagFromQuestion = (questionId: string, tag: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q
        return { ...q, tags: q.tags.filter((t) => t !== tag) }
      })
    )
  }

  const addGlobalTag = () => {
    const tag = globalTagInput.trim()
    if (tag && !globalTags.includes(tag)) {
      setGlobalTags([...globalTags, tag])
      setGlobalTagInput("")
      setTagsApplied(false)
    }
  }

  const removeGlobalTag = (tag: string) => {
    setGlobalTags(globalTags.filter((t) => t !== tag))
    setTagsApplied(false)
  }

  const applyGlobalTagsToAll = () => {
    if (questions.length === 0 || globalTags.length === 0) return

    setQuestions(
      questions.map((q) => ({
        ...q,
        tags: [...new Set([...q.tags, ...globalTags])],
      }))
    )

    toast.success("Đã áp dụng tags cho tất cả câu hỏi thành công!")
    setTagsApplied(true)
  }

  const handleBulkCreate = () => {
    if (questions.length === 0) {
      toast.error("Vui lòng thêm ít nhất một câu hỏi!")
      return
    }

    // Clean and validate data before creating
    const cleanQuestions: CreateQuestionRequest[] = questions
      .map((q) => ({
        content: q.content.trim(),
        type: q.type,
        options: q.options
          .filter((opt) => opt.text.trim() !== "")
          .map((opt) => ({
            id: opt.id,
            text: opt.text.trim(),
            isCorrect: opt.isCorrect,
          })),
        explanation: q.explanation?.trim() || null,
        tags: q.tags || [],
        difficulty: q.difficulty,
        points: q.points,
      }))
      .filter(
        (q) =>
          q.content.trim() !== "" &&
          q.options.length > 0 &&
          q.tags.length > 0 &&
          q.options.some((opt) => opt.isCorrect)
      )

    if (cleanQuestions.length === 0) {
      toast.error("Vui lòng kiểm tra lại các câu hỏi. Mỗi câu hỏi cần có nội dung, ít nhất một lựa chọn, ít nhất một tag, và ít nhất một đáp án đúng!")
      return
    }

    if (cleanQuestions.length !== questions.length) {
      toast.warning(
        `Một số câu hỏi không hợp lệ đã được loại bỏ. Sẽ tạo ${cleanQuestions.length} câu hỏi.`
      )
    }

    bulkCreateQuestions(cleanQuestions)
    }

    // Difficulty badge styling
  const getDifficultyConfig = (difficulty: QuestionDifficulty) => {
    const configs = {
      [QuestionDifficulty.Easy]: {
        label: "Dễ",
        gradient: "from-emerald-500 to-green-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300"
      },
      [QuestionDifficulty.Medium]: {
        label: "Trung bình",
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300"
      },
      [QuestionDifficulty.Hard]: {
        label: "Khó",
        gradient: "from-rose-500 to-red-500",
        bg: "bg-rose-50 dark:bg-rose-950/30",
        border: "border-rose-200 dark:border-rose-800",
        text: "text-rose-700 dark:text-rose-300"
      }
    }
    return configs[difficulty]
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent 
        key={open ? 'open' : 'closed'}
        className="max-w-4xl max-h-[90vh] overflow-hidden border-brand-magenta/20 bg-white/95 backdrop-blur-xl dark:bg-black/95 flex flex-col p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-4 bg-white">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
            Tạo câu hỏi hàng loạt
          </DialogTitle>
          <DialogDescription>
            Tạo nhiều câu hỏi cùng lúc cho ngân hàng câu hỏi
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-6 py-4">
            {/* Add Question Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={addQuestion}
                className="rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white shadow-lg shadow-brand-magenta/20 transition-all hover:shadow-xl hover:shadow-brand-magenta/30"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm câu hỏi
              </Button>
            </div>

            {/* Global Tags Section */}
            {questions.length > 0 && (
              <div className="rounded-2xl border border-brand-magenta/20 bg-gradient-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm dark:from-black/90 dark:to-black/70">
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-brand-magenta" />
                  <h3 className="text-lg font-bold text-foreground">
                    Tags chung cho tất cả câu hỏi
                  </h3>
                </div>
                
                {/* Tag Input */}
                <div className="mb-4 flex gap-2">
                  <Input
                    value={globalTagInput}
                    onChange={(e) => setGlobalTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGlobalTag())}
                    placeholder="Nhập tag và nhấn Enter..."
                    className="flex-1 rounded-xl border-brand-magenta/20 bg-white/80 backdrop-blur-sm dark:bg-black/80"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addGlobalTag}
                    className="rounded-full bg-brand-magenta text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Thêm
                  </Button>
                </div>

                {/* Available Tags */}
                {memoizedAvailableTags.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Tags có sẵn:</p>
                    <div className="flex flex-wrap gap-2">
                      {memoizedAvailableTags.map((tagData) => (
                        <button
                          key={tagData.tag}
                          type="button"
                          onClick={() => {
                            if (!globalTags.includes(tagData.tag)) {
                              setGlobalTags([...globalTags, tagData.tag])
                              setTagsApplied(false)
                            }
                          }}
                          disabled={globalTags.includes(tagData.tag)}
                          className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            globalTags.includes(tagData.tag)
                              ? "border-brand-purple/30 bg-brand-purple/10 text-brand-purple/50 cursor-not-allowed"
                              : "border-brand-magenta/30 bg-white/80 text-foreground hover:border-brand-magenta hover:bg-gradient-to-r hover:from-brand-magenta/10 hover:to-brand-purple/10 hover:shadow-md hover:scale-105 active:scale-95 dark:bg-black/80"
                          }`}
                        >
                          <Tag className="mr-1 inline h-3 w-3" />
                          {tagData.tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Global Tags */}
                {globalTags.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Tags đã chọn:</p>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence mode="popLayout">
                        {globalTags.map((tag) => (
                          <motion.div
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-gradient-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                          >
                            <Tag className="h-3 w-3" />
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeGlobalTag(tag)}
                              className="ml-1 rounded-full transition-all hover:bg-brand-purple/20"
                            >
                              <X className="h-3 w-3 transition-transform group-hover/selected:rotate-90" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                {globalTags.length > 0 && !tagsApplied && (
                  <Button
                    type="button"
                    onClick={applyGlobalTagsToAll}
                    className="w-full rounded-xl bg-gradient-to-r from-brand-magenta to-brand-purple text-white shadow-lg shadow-brand-magenta/20 transition-all hover:shadow-xl hover:shadow-brand-magenta/30"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Áp dụng cho tất cả câu hỏi
                  </Button>
                )}
              </div>
            )}

            {/* Questions List */}
            {questions.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {questions.map((question, questionIndex) => {
                    const config = getDifficultyConfig(question.difficulty)
                    const tagInput = tagInputs[question.id] || ""

                    const setTagInput = (value: string) => {
                      setTagInputs({ ...tagInputs, [question.id]: value })
                    }

                    const addTag = () => {
                      const tag = tagInput.trim()
                      if (tag && !question.tags.includes(tag)) {
                        addTagToQuestion(question.id, tag)
                        setTagInput("")
                      }
                    }

                    return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-gradient-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-magenta/10 dark:from-black/90 dark:to-black/70">
                          {/* Gradient accent line */}
                          <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${config.gradient}`} />
                          
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-4">
                              {/* Header with difficulty badge */}
                              <div className="flex items-center gap-3">
                                <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.border} ${config.bg} ${config.text}`}>
                                  {config.label}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Câu hỏi #{questionIndex + 1}
                                </span>
                                <select
                                  value={question.difficulty}
                                  onChange={(e) => updateQuestion(question.id, "difficulty", e.target.value as QuestionDifficulty)}
                                  className="ml-auto rounded-lg border border-brand-magenta/20 bg-white/80 px-2 py-1 text-xs dark:bg-black/80"
                                >
                                  <option value={QuestionDifficulty.Easy}>Dễ</option>
                                  <option value={QuestionDifficulty.Medium}>Trung bình</option>
                                  <option value={QuestionDifficulty.Hard}>Khó</option>
                                </select>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-muted-foreground">Điểm:</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value) || 1)}
                                    className="w-16 rounded-lg border border-brand-magenta/20 bg-white/80 px-2 py-1 text-xs dark:bg-black/80"
                                  />
                                </div>
                              </div>

                              {/* Question Content */}
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">
                                  Nội dung câu hỏi <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                  value={question.content}
                                  onChange={(e) => updateQuestion(question.id, "content", e.target.value)}
                                  placeholder="Nhập nội dung câu hỏi..."
                                  className="min-h-[100px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta dark:bg-black/50"
                                />
                              </div>
                              
                              {/* Options */}
                              <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground">
                                  Các lựa chọn <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                  <AnimatePresence mode="popLayout">
                                    {question.options.map((option, optIndex) => (
                                      <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex items-center gap-2"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => toggleCorrect(question.id, optIndex)}
                                          className={`flex-shrink-0 rounded-full p-1 transition-all ${
                                            option.isCorrect
                                              ? "bg-green-500 text-white"
                                              : "border-2 border-gray-300 text-gray-300 hover:border-green-500"
                                          }`}
                                        >
                                          <CheckCircle2 className="h-5 w-5" />
                                        </button>
                                        
                                        <Input
                                          value={option.text}
                                          onChange={(e) => updateOption(question.id, optIndex, "text", e.target.value)}
                                          placeholder={`Lựa chọn ${optIndex + 1}`}
                                          className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta dark:bg-black/50"
                                        />

                                        {question.options.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeOption(question.id, optIndex)}
                                            className="flex-shrink-0 rounded-full p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                          >
                                            <X className="h-5 w-5" />
                                          </button>
                                        )}
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addOption(question.id)}
                                  className="w-full rounded-full border-brand-magenta/20"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Thêm lựa chọn
                                </Button>
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
                                    className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta dark:bg-black/50"
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
                                            if (!question.tags.includes(tagData.tag)) {
                                              addTagToQuestion(question.id, tagData.tag)
                                            }
                                          }}
                                          disabled={question.tags.includes(tagData.tag)}
                                          className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                            question.tags.includes(tagData.tag)
                                              ? "border-brand-purple/30 bg-brand-purple/10 text-brand-purple/50 cursor-not-allowed"
                                              : "border-brand-magenta/30 bg-white/80 text-foreground hover:border-brand-magenta hover:bg-gradient-to-r hover:from-brand-magenta/10 hover:to-brand-purple/10 hover:shadow-md hover:scale-105 active:scale-95 dark:bg-black/80"
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
                                {question.tags.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Tags đã chọn:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {question.tags.map((tag) => (
                                        <motion.div
                                          key={tag}
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          exit={{ scale: 0 }}
                                          className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-gradient-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                                        >
                                          <Tag className="h-3 w-3" />
                                          <span>{tag}</span>
                                          <button
                                            type="button"
                                            onClick={() => removeTagFromQuestion(question.id, tag)}
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
                                  value={question.explanation || ""}
                                  onChange={(e) => updateQuestion(question.id, "explanation", e.target.value || null)}
                                  placeholder="Nhập giải thích cho câu hỏi..."
                                  className="min-h-[80px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta dark:bg-black/50"
                                />
                              </div>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className="group/delete flex-shrink-0 rounded-full p-2.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-5 w-5 transition-transform group-hover/delete:scale-110" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-magenta/20 bg-white/80 py-16 text-center backdrop-blur-sm dark:bg-black/80">
                <div className="mb-4 rounded-full bg-gradient-to-br from-brand-magenta/20 to-brand-purple/20 p-6">
                  <Plus className="h-12 w-12 text-brand-magenta" />
                </div>
                <p className="text-lg font-semibold text-foreground">Chưa có câu hỏi nào</p>
                <p className="mt-2 text-sm text-muted-foreground">Nhấn nút &quot;Thêm câu hỏi&quot; để bắt đầu</p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-brand-magenta/10 bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-black/80">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
              className="rounded-full border-brand-magenta/20"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleBulkCreate}
              disabled={questions.length === 0 || isCreating || isCreateSuccess}
              className="rounded-full bg-brand-magenta text-white"
            >
              {isCreating ? "Đang tạo..." : isCreateSuccess ? "Đã tạo thành công!" : `Tạo ${questions.length} câu hỏi`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
