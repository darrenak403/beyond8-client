'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react'
import { QuizAttemptQuestionResult } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCheckEmbedHealth, useExplainQuizQuestion } from '@/hooks/useAI'
import { ExplainQuizQuestionResponse } from '@/lib/api/services/fetchAI'

interface QuestionResultCardProps {
  question: QuizAttemptQuestionResult
  currentIndex: number
  totalQuestions: number
}

export default function QuestionResultCard({
  question,
  currentIndex,
  totalQuestions,
}: QuestionResultCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [explanation, setExplanation] = useState<ExplainQuizQuestionResponse | null>(null)
  const [selectedTab, setSelectedTab] = useState(0)
  
  const { data: embedHealth, isLoading: isCheckingHealth } = useCheckEmbedHealth()
  const explainMutation = useExplainQuizQuestion()

  const handleExplain = async () => {
    if (!embedHealth?.data) {
      return
    }

    try {
      const requestData = {
        content: question.content,
        options: question.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      }

      const response = await explainMutation.mutateAsync(requestData)
      if (response.data) {
        setExplanation(response.data)
        setSelectedTab(0)
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error('Error explaining question:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={cn(
        "relative overflow-hidden border-2 shadow-xl",
        question.isCorrect 
          ? "border-green-200 bg-green-50/30" 
          : "border-red-200 bg-red-50/30"
      )}>
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <CardTitle className="text-lg bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
                  Câu hỏi {currentIndex + 1}/{totalQuestions}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    question.isCorrect
                      ? "border-green-500/30 bg-green-500/10 text-green-700"
                      : "border-red-500/30 bg-red-500/10 text-red-700"
                  )}
                >
                  {question.earnedPoints}/{question.points} điểm
                </Badge>
                {question.type === 'MultipleChoice' && (
                  <Badge variant="outline" className="text-xs border-brand-purple/30 bg-brand-purple/10 text-brand-purple">
                    Nhiều lựa chọn
                  </Badge>
                )}
                {question.isCorrect ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Đúng
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">
                    <XCircle className="w-3 h-3 mr-1" />
                    Sai
                  </Badge>
                )}
              </div>
              <p className="text-base font-medium text-foreground leading-relaxed">{question.content}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = option.isSelected
              const isCorrect = option.isCorrect
              
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all relative overflow-hidden",
                    isCorrect && isSelected
                      ? "border-green-500 bg-green-100 shadow-md"
                      : isCorrect && !isSelected
                      ? "border-green-300 bg-green-50"
                      : isSelected && !isCorrect
                      ? "border-red-500 bg-red-100 shadow-md"
                      : "border-gray-200 bg-white"
                  )}
                >
                  {question.type === 'MultipleChoice' ? (
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      isSelected
                        ? isCorrect
                          ? "bg-green-500 border-green-600"
                          : "bg-red-500 border-red-600"
                        : isCorrect
                        ? "bg-green-100 border-green-300"
                        : "bg-gray-100 border-gray-300"
                    )}>
                      {isSelected && (
                        <CheckCircle2 className={cn(
                          "w-3 h-3",
                          isCorrect ? "text-white" : "text-white"
                        )} />
                      )}
                    </div>
                  ) : (
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      isSelected
                        ? isCorrect
                          ? "bg-green-500 border-green-600"
                          : "bg-red-500 border-red-600"
                        : isCorrect
                        ? "bg-green-100 border-green-300"
                        : "bg-gray-100 border-gray-300"
                    )}>
                      {isSelected && (
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          isCorrect ? "bg-white" : "bg-white"
                        )} />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm",
                      isSelected ? "font-medium" : "",
                      isCorrect ? "text-green-700" : isSelected ? "text-red-700" : "text-foreground"
                    )}>
                      {option.text}
                    </p>
                  </div>
                  {isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Explanation or feedback */}
          {!question.isCorrect && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 font-medium mb-1">Đáp án đúng:</p>
              <div className="flex flex-wrap gap-2">
                {question.options
                  .filter(opt => opt.isCorrect)
                  .map(opt => (
                    <Badge key={opt.id} className="text-green-700 bg-green-50 hover:bg-green-50">
                      {opt.text}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Explain Button */}
          {embedHealth?.data && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleExplain}
                disabled={isCheckingHealth || explainMutation.isPending}
                variant="outline"
                size="sm"
                className="border-brand-purple/30 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 hover:text-brand-purple"
              >
                {explainMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Giải thích chi tiết
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explanation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
              Giải thích chi tiết câu hỏi {currentIndex + 1}
            </DialogTitle>
            <DialogDescription className="text-base">
              Phân tích và giải thích từng đáp án
            </DialogDescription>
          </DialogHeader>
          
          {explanation?.answers && explanation.answers.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col mt-4">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {explanation.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTab(index)}
                    className={cn(
                      "relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 min-w-fit",
                      selectedTab === index && "shadow-md",
                      answer.isCorrect
                        ? selectedTab === index
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-green-50/50 text-green-600 hover:bg-green-50 border border-green-200"
                        : selectedTab === index
                        ? "bg-red-100 text-red-700 border-2 border-red-300"
                        : "bg-red-50/50 text-red-600 hover:bg-red-50 border border-red-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      selectedTab === index ? "bg-white/30" : "bg-white"
                    )}>
                      {answer.isCorrect ? (
                        <CheckCircle2 className={cn(
                          "w-3.5 h-3.5",
                          selectedTab === index ? "text-green-700" : "text-green-600"
                        )} />
                      ) : (
                        <XCircle className={cn(
                          "w-3.5 h-3.5",
                          selectedTab === index ? "text-red-700" : "text-red-600"
                        )} />
                      )}
                    </div>
                    <span>Đáp án {String.fromCharCode(65 + index)}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {explanation.answers.map((answer, index) => (
                  selectedTab === index && (
                    <motion.div
                      key={index}
                      className="space-y-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Answer Section */}
                      <div className={cn(
                        "p-6 rounded-2xl border-2 backdrop-blur-sm",
                        answer.isCorrect
                          ? "border-green-200 bg-gradient-to-br from-green-50/80 to-green-100/50"
                          : "border-red-200 bg-gradient-to-br from-red-50/80 to-red-100/50"
                      )}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                            answer.isCorrect
                              ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                              : "bg-gradient-to-br from-red-500 to-red-600 text-white"
                          )}>
                            {answer.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {answer.isCorrect ? "Đáp án đúng" : "Đáp án sai"}
                            </p>
                            <Badge className={cn(
                              "mt-1",
                              answer.isCorrect
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            )}>
                              Đáp án {String.fromCharCode(65 + index)}
                            </Badge>
                          </div>
                        </div>
                        <p className={cn(
                          "text-lg font-semibold leading-relaxed",
                          answer.isCorrect ? "text-green-900" : "text-red-900"
                        )}>
                          {answer.answer}
                        </p>
                      </div>

                      {/* Explanation Section */}
                      <div className="p-6 rounded-2xl border-2 border-brand-purple/20 bg-gradient-to-br from-white/80 to-brand-purple/5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-brand-purple" />
                          <h4 className="text-sm font-semibold text-brand-purple uppercase tracking-wide">
                            Giải thích chi tiết
                          </h4>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap m-0">
                            {answer.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
