'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuizAttemptQuestionResult } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
        </CardContent>
      </Card>
    </motion.div>
  )
}
