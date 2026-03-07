"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, CheckCircle2, ChevronLeft, Trash2, Plus, Tag } from "lucide-react"
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
import { useGenerateQuestionsFromPDF, useImportQuestionsFromAI, useGetQuestionTagsCount } from "@/hooks/useQuestion"
import { GeneratedQuestion } from "@/lib/api/services/fetchQuestion"
import { toast } from "sonner"

interface CreateQuestionPDFDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
}

export function CreateQuestionPDFDialog({ open, onOpenChange, onCancel }: CreateQuestionPDFDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [questionsData, setQuestionsData] = useState<{
    easy: GeneratedQuestion[]
    medium: GeneratedQuestion[]
    hard: GeneratedQuestion[]
  } | null>(null)
  const [globalTags, setGlobalTags] = useState<string[]>([])
  const [globalTagInput, setGlobalTagInput] = useState("")
  const [tagsApplied, setTagsApplied] = useState(false)
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({})

  const {
    generateQuestions,
    isLoading: isUploading,
    error: uploadError,
    isSuccess: isUploadSuccess,
    data: uploadData,
    reset: resetUpload,
  } = useGenerateQuestionsFromPDF()

  const {
    importQuestions,
    isLoading: isImporting,
    isSuccess: isImportSuccess,
    reset: resetImport,
  } = useImportQuestionsFromAI()

  const { tags: availableTags } = useGetQuestionTagsCount()

  const prevOpenRef = useRef(open)

  // Reset form when dialog opens (transitions from closed to open)
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // Dialog just opened, reset all form state
      // Using setTimeout to make state update asynchronous and avoid lint warning
      const timeoutId = setTimeout(() => {
        setStep(1)
        setFile(null)
        setUploadProgress(0)
        setQuestionsData(null)
        setGlobalTags([])
        setGlobalTagInput("")
        setTagsApplied(false)
        setTagInputs({})
        resetUpload()
        resetImport()
      }, 0)
      prevOpenRef.current = open
      return () => clearTimeout(timeoutId)
    }
    prevOpenRef.current = open
  }, [open, resetUpload, resetImport])

  useEffect(() => {
    if (isUploadSuccess && uploadData?.data && uploadData.data.length > 0) {
      const firstGroup = uploadData.data[0]
      setQuestionsData({
        easy: firstGroup.easy || [],
        medium: firstGroup.medium || [],
        hard: firstGroup.hard || [],
      })
      setStep(2)
    }
  }, [isUploadSuccess, uploadData])

  useEffect(() => {
    if (!isUploading) return

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          return 90
        }
        return prev + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [isUploading])

  useEffect(() => {
    if (isUploadSuccess && uploadProgress < 100) {
      setUploadProgress(100)
    } else if (uploadError && uploadProgress > 0) {
      setUploadProgress(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadSuccess, uploadError])

  const handleDialogClose = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setStep(1)
      setFile(null)
      setUploadProgress(0)
      setQuestionsData(null)
      setGlobalTags([])
      setGlobalTagInput("")
      setTagsApplied(false)
      setTagInputs({})
      resetUpload()
      resetImport()
    }
  }

  useEffect(() => {
    if (isImportSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isImportSuccess, onOpenChange])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      resetUpload()
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      resetUpload()
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
    resetUpload()
  }

  const handleUpload = () => {
    if (!file || isUploading) return
    setUploadProgress(0)
    generateQuestions(file)
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setQuestionsData(null)
    setGlobalTags([])
    setGlobalTagInput("")
    setTagsApplied(false)
    setTagInputs({})
    resetUpload()
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
    if (!questionsData || globalTags.length === 0) return

    setQuestionsData({
      easy: questionsData.easy.map(q => ({
        ...q,
        tags: [...new Set([...q.tags, ...globalTags])]
      })),
      medium: questionsData.medium.map(q => ({
        ...q,
        tags: [...new Set([...q.tags, ...globalTags])]
      })),
      hard: questionsData.hard.map(q => ({
        ...q,
        tags: [...new Set([...q.tags, ...globalTags])]
      }))
    })

    toast.success("Đã áp dụng tags cho tất cả câu hỏi thành công!")
    setTagsApplied(true)
  }

  const handleImportQuestions = () => {
    if (!questionsData) return

    // Clean and validate data before importing
    const cleanQuestions = {
      easy: questionsData.easy.map(q => ({
        ...q,
        content: q.content.trim(),
        options: q.options
          .filter(opt => opt.text.trim() !== "") // Remove empty options
          .map(opt => ({
            ...opt,
            text: opt.text.trim()
          })),
        explanation: q.explanation?.trim() || null,
        tags: q.tags || []
      })).filter(q => q.content.trim() !== "" && q.options.length > 0), // Remove questions with empty content or no options

      medium: questionsData.medium.map(q => ({
        ...q,
        content: q.content.trim(),
        options: q.options
          .filter(opt => opt.text.trim() !== "") // Remove empty options
          .map(opt => ({
            ...opt,
            text: opt.text.trim()
          })),
        explanation: q.explanation?.trim() || null,
        tags: q.tags || []
      })).filter(q => q.content.trim() !== "" && q.options.length > 0), // Remove questions with empty content or no options

      hard: questionsData.hard.map(q => ({
        ...q,
        content: q.content.trim(),
        options: q.options
          .filter(opt => opt.text.trim() !== "") // Remove empty options
          .map(opt => ({
            ...opt,
            text: opt.text.trim()
          })),
        explanation: q.explanation?.trim() || null,
        tags: q.tags || []
      })).filter(q => q.content.trim() !== "" && q.options.length > 0) // Remove questions with empty content or no options
    }

    // Validate that all questions have at least one tag
    const allQuestions = [...cleanQuestions.easy, ...cleanQuestions.medium, ...cleanQuestions.hard]
    const hasEmptyTags = allQuestions.some(q => !q.tags || q.tags.length === 0)

    if (hasEmptyTags) {
      return // Could show toast here if needed
    }

    // Validate that all questions have at least one correct answer
    const hasNoCorrectAnswer = allQuestions.some(q => !q.options.some(opt => opt.isCorrect))

    if (hasNoCorrectAnswer) {
      return // Could show toast here if needed
    }

    importQuestions(cleanQuestions)
  }

  const addTagToQuestion = (
    difficulty: "easy" | "medium" | "hard",
    questionIndex: number,
    tag: string
  ) => {
    if (!questionsData) return
    const currentQuestion = questionsData[difficulty][questionIndex]
    if (currentQuestion.tags.includes(tag)) return

    const updated = { ...questionsData }
    const updatedQuestion = { ...updated[difficulty][questionIndex] }
    updatedQuestion.tags = [...updatedQuestion.tags, tag]
    updated[difficulty][questionIndex] = updatedQuestion
    setQuestionsData(updated)
  }

  const removeTagFromQuestion = (
    difficulty: "easy" | "medium" | "hard",
    questionIndex: number,
    tag: string
  ) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    const updatedQuestion = { ...updated[difficulty][questionIndex] }
    updatedQuestion.tags = updatedQuestion.tags.filter(t => t !== tag)
    updated[difficulty][questionIndex] = updatedQuestion
    setQuestionsData(updated)
  }

  const updateQuestion = (
    difficulty: "easy" | "medium" | "hard",
    index: number,
    field: keyof GeneratedQuestion,
    value: string | null
  ) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    const question = { ...updated[difficulty][index] }
    if (field === "content") {
      question.content = value || ""
    } else if (field === "explanation") {
      question.explanation = value
    }
    updated[difficulty][index] = question
    setQuestionsData(updated)
  }

  const updateOption = (
    difficulty: "easy" | "medium" | "hard",
    questionIndex: number,
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    const question = { ...updated[difficulty][questionIndex] }
    const options = [...question.options]
    if (field === "text") {
      options[optionIndex] = { ...options[optionIndex], text: value as string }
    } else {
      options[optionIndex] = { ...options[optionIndex], isCorrect: value as boolean }
    }
    question.options = options
    updated[difficulty][questionIndex] = question
    setQuestionsData(updated)
  }

  const toggleCorrect = (
    difficulty: "easy" | "medium" | "hard",
    questionIndex: number,
    optionIndex: number
  ) => {
    if (!questionsData) return
    const question = questionsData[difficulty][questionIndex]
    updateOption(difficulty, questionIndex, optionIndex, "isCorrect", !question.options[optionIndex].isCorrect)
  }

  const removeQuestion = (difficulty: "easy" | "medium" | "hard", index: number) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    updated[difficulty] = updated[difficulty].filter((_, i) => i !== index)
    setQuestionsData(updated)
  }

  const addOption = (difficulty: "easy" | "medium" | "hard", questionIndex: number) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    const question = { ...updated[difficulty][questionIndex] }
    question.options = [
      ...question.options,
      { id: crypto.randomUUID(), text: "", isCorrect: false }
    ]
    updated[difficulty][questionIndex] = question
    setQuestionsData(updated)
  }

  const removeOption = (
    difficulty: "easy" | "medium" | "hard",
    questionIndex: number,
    optionIndex: number
  ) => {
    if (!questionsData) return
    const updated = { ...questionsData }
    const question = { ...updated[difficulty][questionIndex] }
    question.options = question.options.filter((_, i) => i !== optionIndex)
    updated[difficulty][questionIndex] = question
    setQuestionsData(updated)
  }

  // Difficulty badge styling helper
  const getDifficultyConfig = (difficulty: "easy" | "medium" | "hard") => {
    const configs = {
      easy: {
        label: "Dễ",
        gradient: "from-emerald-500 to-green-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700"
      },
      medium: {
        label: "Trung bình",
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700"
      },
      hard: {
        label: "Khó",
        gradient: "from-rose-500 to-red-500",
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700"
      }
    }
    return configs[difficulty]
  }

  // Memoize availableTags to prevent unnecessary re-renders
  const memoizedAvailableTags = useMemo(() => availableTags, [availableTags])

  const isFormValid = useMemo(() => {
    if (!questionsData) return false

    const allQuestions = [...questionsData.easy, ...questionsData.medium, ...questionsData.hard]

    // Filter questions that will be imported (must have content and at least one option)
    const activeQuestions = allQuestions.filter(q => {
      const hasContent = q.content.trim() !== ""
      const hasValidOptions = q.options.some(o => o.text.trim() !== "")
      return hasContent && hasValidOptions
    })

    if (activeQuestions.length === 0) return false

    // Check if any active question is missing tags
    const hasMissingTags = activeQuestions.some(q => !q.tags || q.tags.length === 0)
    if (hasMissingTags) return false

    // Also check for correct answers to prevent silent failures
    const hasMissingCorrect = activeQuestions.some(q => {
      const validOptions = q.options.filter(o => o.text.trim() !== "")
      return !validOptions.some(o => o.isCorrect)
    })
    if (hasMissingCorrect) return false

    return true
  }, [questionsData])

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        key={open ? 'open' : 'closed'}
        className="max-w-4xl max-h-[90vh] overflow-hidden border-brand-magenta/20 bg-white/95 backdrop-blur-xl flex flex-col p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-4 bg-white">
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
            {step === 1 ? "Tạo câu hỏi từ PDF" : "Chỉnh sửa và tạo câu hỏi"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Upload file PDF để tự động tạo câu hỏi cho ngân hàng câu hỏi"
              : "Xem lại và chỉnh sửa các câu hỏi đã được tạo từ PDF"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide bg-gray-50/50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 py-4"
              >
                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all ${isDragging
                    ? "border-brand-magenta bg-brand-magenta/5"
                    : "border-brand-magenta/20 bg-white/50"
                    }`}
                >
                  <div className="p-12">
                    {!file ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <motion.div
                          animate={{
                            y: isDragging ? -10 : 0,
                          }}
                          className="mb-4 rounded-full bg-linear-to-br from-brand-magenta/20 to-brand-purple/20 p-6"
                        >
                          <Upload className="h-12 w-12 text-brand-magenta" />
                        </motion.div>

                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                          Kéo thả file PDF vào đây
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          hoặc click để chọn file
                        </p>

                        <label htmlFor="pdf-upload">
                          <Button
                            type="button"
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                            className="rounded-full bg-brand-magenta text-white"
                          >
                            Chọn file PDF
                          </Button>
                        </label>

                        <input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        <p className="mt-4 text-xs text-muted-foreground">
                          Chỉ hỗ trợ file PDF, tối đa 10MB
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        {/* File Info */}
                        <div className="flex items-start gap-4 rounded-xl border border-brand-magenta/20 bg-white/80 p-4 backdrop-blur-sm">
                          <div className="rounded-lg bg-linear-to-br from-brand-magenta/20 to-brand-purple/20 p-3">
                            <FileText className="h-8 w-8 text-brand-magenta" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {file.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                          {!isUploading && (
                            <button
                              onClick={removeFile}
                              className="rounded-full p-2 text-red-500 hover:bg-red-50"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-foreground">
                                Đang xử lý PDF...
                              </span>
                              <span className="text-muted-foreground">
                                {uploadProgress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full rounded-full bg-linear-to-r from-brand-magenta to-brand-purple"
                              />
                            </div>
                          </div>
                        )}

                        {uploadError && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                          >
                            <p className="font-medium">Có lỗi xảy ra khi xử lý file</p>
                            <p className="mt-1 text-xs">
                              {uploadError instanceof Error ? uploadError.message : "Vui lòng thử lại hoặc chọn file khác."}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                {questionsData && (
                  <div className="space-y-8">
                    {/* Global Tags Section */}
                    <div className="rounded-2xl border border-brand-magenta/20 bg-linear-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm ">
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addGlobalTag()
                            }
                          }}
                          placeholder="Nhập tag và nhấn Enter..."
                          className="flex-1 rounded-xl border-brand-magenta/20 bg-white/80 backdrop-blur-sm"
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
                                className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${globalTags.includes(tagData.tag)
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
                                  className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-linear-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
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
                          className="w-full rounded-xl bg-linear-to-r from-brand-magenta to-brand-purple text-white shadow-lg shadow-brand-magenta/20 transition-all hover:shadow-xl hover:shadow-brand-magenta/30"
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Áp dụng cho tất cả câu hỏi
                        </Button>
                      )}
                    </div>
                    {/* Easy Questions */}
                    {questionsData.easy.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
                          <h3 className="flex items-center gap-2 text-lg font-bold">
                            <span className="rounded-full bg-linear-to-r from-emerald-500 to-green-500 px-4 py-1.5 text-sm text-white shadow-lg shadow-emerald-500/30">
                              Câu hỏi dễ ({questionsData.easy.length})
                            </span>
                          </h3>
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
                        </div>
                        {questionsData.easy.map((question, index) => {
                          const config = getDifficultyConfig("easy")
                          const questionKey = `easy-${index}`
                          const tagInput = tagInputs[questionKey] || ""

                          const setTagInput = (value: string) => {
                            setTagInputs({ ...tagInputs, [questionKey]: value })
                          }

                          const addTag = () => {
                            const tag = tagInput.trim()
                            if (tag && !question.tags.includes(tag)) {
                              addTagToQuestion("easy", index, tag)
                              setTagInput("")
                            }
                          }

                          return (
                            <div
                              key={questionKey}
                              className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-linear-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-magenta/10"
                            >
                              <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b ${config.gradient}`} />

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.border} ${config.bg} ${config.text}`}>
                                      {config.label}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Câu hỏi #{index + 1}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Nội dung câu hỏi <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                      value={question.content}
                                      onChange={(e) => updateQuestion("easy", index, "content", e.target.value)}
                                      placeholder="Nhập nội dung câu hỏi..."
                                      className="min-h-[100px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta "
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground">
                                      Các lựa chọn <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                      {question.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-2"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleCorrect("easy", index, optIndex)}
                                            className={`shrink-0 rounded-full p-1 transition-all ${option.isCorrect
                                              ? "bg-green-500 text-white"
                                              : "border-2 border-gray-300 text-gray-300 hover:border-green-500"
                                              }`}
                                          >
                                            <CheckCircle2 className="h-5 w-5" />
                                          </button>

                                          <Input
                                            value={option.text}
                                            onChange={(e) => updateOption("easy", index, optIndex, "text", e.target.value)}
                                            placeholder={`Lựa chọn ${optIndex + 1}`}
                                            className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                          />

                                          {question.options.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeOption("easy", index, optIndex)}
                                              className="shrink-0 rounded-full p-1 text-red-500 hover:bg-red-50"
                                            >
                                              <X className="h-5 w-5" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addOption("easy", index)}
                                      className="w-full rounded-full border-brand-magenta/20"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Thêm lựa chọn
                                    </Button>
                                  </div>

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
                                                  addTagToQuestion("easy", index, tagData.tag)
                                                }
                                              }}
                                              disabled={question.tags.includes(tagData.tag)}
                                              className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${question.tags.includes(tagData.tag)
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
                                              className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-linear-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                                            >
                                              <Tag className="h-3 w-3" />
                                              <span>{tag}</span>
                                              <button
                                                type="button"
                                                onClick={() => removeTagFromQuestion("easy", index, tag)}
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

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Giải thích (tùy chọn)
                                    </label>
                                    <Textarea
                                      value={question.explanation || ""}
                                      onChange={(e) => updateQuestion("easy", index, "explanation", e.target.value || null)}
                                      placeholder="Nhập giải thích cho câu hỏi..."
                                      className="min-h-[80px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeQuestion("easy", index)}
                                  className="group/delete shrink-0 rounded-full p-2.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20"
                                >
                                  <Trash2 className="h-5 w-5 transition-transform group-hover/delete:scale-110" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Medium Questions */}
                    {questionsData.medium.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
                          <h3 className="flex items-center gap-2 text-lg font-bold">
                            <span className="rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-sm text-white shadow-lg shadow-amber-500/30">
                              Câu hỏi trung bình ({questionsData.medium.length})
                            </span>
                          </h3>
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
                        </div>
                        {questionsData.medium.map((question, index) => {
                          const config = getDifficultyConfig("medium")
                          const questionKey = `medium-${index}`
                          const tagInput = tagInputs[questionKey] || ""

                          const setTagInput = (value: string) => {
                            setTagInputs({ ...tagInputs, [questionKey]: value })
                          }

                          const addTag = () => {
                            const tag = tagInput.trim()
                            if (tag && !question.tags.includes(tag)) {
                              addTagToQuestion("medium", index, tag)
                              setTagInput("")
                            }
                          }

                          return (
                            <div
                              key={questionKey}
                              className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-linear-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-magenta/10"
                            >
                              <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b ${config.gradient}`} />

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.border} ${config.bg} ${config.text}`}>
                                      {config.label}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Câu hỏi #{index + 1}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Nội dung câu hỏi <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                      value={question.content}
                                      onChange={(e) => updateQuestion("medium", index, "content", e.target.value)}
                                      placeholder="Nhập nội dung câu hỏi..."
                                      className="min-h-[100px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground">
                                      Các lựa chọn <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                      {question.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-2"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleCorrect("medium", index, optIndex)}
                                            className={`shrink-0 rounded-full p-1 transition-all ${option.isCorrect
                                              ? "bg-green-500 text-white"
                                              : "border-2 border-gray-300 text-gray-300 hover:border-green-500"
                                              }`}
                                          >
                                            <CheckCircle2 className="h-5 w-5" />
                                          </button>

                                          <Input
                                            value={option.text}
                                            onChange={(e) => updateOption("medium", index, optIndex, "text", e.target.value)}
                                            placeholder={`Lựa chọn ${optIndex + 1}`}
                                            className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta "
                                          />

                                          {question.options.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeOption("medium", index, optIndex)}
                                              className="shrink-0 rounded-full p-1 text-red-500 hover:bg-red-50"
                                            >
                                              <X className="h-5 w-5" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addOption("medium", index)}
                                      className="w-full rounded-full border-brand-magenta/20"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Thêm lựa chọn
                                    </Button>
                                  </div>

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
                                                  addTagToQuestion("medium", index, tagData.tag)
                                                }
                                              }}
                                              disabled={question.tags.includes(tagData.tag)}
                                              className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${question.tags.includes(tagData.tag)
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
                                              className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-linear-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                                            >
                                              <Tag className="h-3 w-3" />
                                              <span>{tag}</span>
                                              <button
                                                type="button"
                                                onClick={() => removeTagFromQuestion("medium", index, tag)}
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

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Giải thích (tùy chọn)
                                    </label>
                                    <Textarea
                                      value={question.explanation || ""}
                                      onChange={(e) => updateQuestion("medium", index, "explanation", e.target.value || null)}
                                      placeholder="Nhập giải thích cho câu hỏi..."
                                      className="min-h-[80px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeQuestion("medium", index)}
                                  className="group/delete shrink-0 rounded-full p-2.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20"
                                >
                                  <Trash2 className="h-5 w-5 transition-transform group-hover/delete:scale-110" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Hard Questions */}
                    {questionsData.hard.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-rose-500/30 to-transparent" />
                          <h3 className="flex items-center gap-2 text-lg font-bold">
                            <span className="rounded-full bg-linear-to-r from-rose-500 to-red-500 px-4 py-1.5 text-sm text-white shadow-lg shadow-rose-500/30">
                              Câu hỏi khó ({questionsData.hard.length})
                            </span>
                          </h3>
                          <div className="h-px flex-1 bg-linear-to-r from-transparent via-rose-500/30 to-transparent" />
                        </div>
                        {questionsData.hard.map((question, index) => {
                          const config = getDifficultyConfig("hard")
                          const questionKey = `hard-${index}`
                          const tagInput = tagInputs[questionKey] || ""

                          const setTagInput = (value: string) => {
                            setTagInputs({ ...tagInputs, [questionKey]: value })
                          }

                          const addTag = () => {
                            const tag = tagInput.trim()
                            if (tag && !question.tags.includes(tag)) {
                              addTagToQuestion("hard", index, tag)
                              setTagInput("")
                            }
                          }

                          return (
                            <div
                              key={questionKey}
                              className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-linear-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-magenta/10"
                            >
                              <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b ${config.gradient}`} />

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.border} ${config.bg} ${config.text}`}>
                                      {config.label}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Câu hỏi #{index + 1}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Nội dung câu hỏi <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                      value={question.content}
                                      onChange={(e) => updateQuestion("hard", index, "content", e.target.value)}
                                      placeholder="Nhập nội dung câu hỏi..."
                                      className="min-h-[100px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground">
                                      Các lựa chọn <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                      {question.options.map((option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-2"
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleCorrect("hard", index, optIndex)}
                                            className={`shrink-0 rounded-full p-1 transition-all ${option.isCorrect
                                              ? "bg-green-500 text-white"
                                              : "border-2 border-gray-300 text-gray-300 hover:border-green-500"
                                              }`}
                                          >
                                            <CheckCircle2 className="h-5 w-5" />
                                          </button>

                                          <Input
                                            value={option.text}
                                            onChange={(e) => updateOption("hard", index, optIndex, "text", e.target.value)}
                                            placeholder={`Lựa chọn ${optIndex + 1}`}
                                            className="flex-1 border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                          />

                                          {question.options.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeOption("hard", index, optIndex)}
                                              className="shrink-0 rounded-full p-1 text-red-500 hover:bg-red-50"
                                            >
                                              <X className="h-5 w-5" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addOption("hard", index)}
                                      className="w-full rounded-full border-brand-magenta/20"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Thêm lựa chọn
                                    </Button>
                                  </div>

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
                                                  addTagToQuestion("hard", index, tagData.tag)
                                                }
                                              }}
                                              disabled={question.tags.includes(tagData.tag)}
                                              className={`group/tag rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${question.tags.includes(tagData.tag)
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
                                              className="group/selected flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-linear-to-r from-brand-purple/20 to-brand-magenta/20 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-sm backdrop-blur-sm"
                                            >
                                              <Tag className="h-3 w-3" />
                                              <span>{tag}</span>
                                              <button
                                                type="button"
                                                onClick={() => removeTagFromQuestion("hard", index, tag)}
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

                                  <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">
                                      Giải thích (tùy chọn)
                                    </label>
                                    <Textarea
                                      value={question.explanation || ""}
                                      onChange={(e) => updateQuestion("hard", index, "explanation", e.target.value || null)}
                                      placeholder="Nhập giải thích cho câu hỏi..."
                                      className="min-h-[80px] resize-none border-brand-magenta/20 bg-white/50 backdrop-blur-sm focus:border-brand-magenta"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeQuestion("hard", index)}
                                  className="group/delete shrink-0 rounded-full p-2.5 text-red-500 transition-all hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/20"
                                >
                                  <Trash2 className="h-5 w-5 transition-transform group-hover/delete:scale-110" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {questionsData.easy.length === 0 &&
                      questionsData.medium.length === 0 &&
                      questionsData.hard.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-magenta/20 bg-white/80 py-16 text-center backdrop-blur-sm">
                          <div className="mb-4 rounded-full bg-linear-to-br from-brand-magenta/20 to-brand-purple/20 p-6">
                            <FileText className="h-12 w-12 text-brand-magenta" />
                          </div>
                          <p className="text-lg font-semibold text-foreground">Không có câu hỏi nào được tạo</p>
                          <p className="mt-2 text-sm text-muted-foreground">Vui lòng thử lại với file PDF khác</p>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-brand-magenta/10 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div className="flex justify-between gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToStep1}
                disabled={isImporting}
                className="rounded-full border-brand-magenta/20"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  onCancel?.()
                }}
                disabled={isUploading || isImporting}
                className="rounded-full border-brand-magenta/20"
              >
                Hủy
              </Button>
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="rounded-full bg-brand-magenta text-white"
                >
                  {isUploading ? "Đang xử lý..." : "Upload và tạo câu hỏi"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleImportQuestions}
                  disabled={!isFormValid || isImporting || isImportSuccess}
                  className="rounded-full bg-brand-magenta text-white"
                >
                  {isImporting ? "Đang tạo..." : isImportSuccess ? "Đã tạo thành công!" : "Tạo câu hỏi"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
