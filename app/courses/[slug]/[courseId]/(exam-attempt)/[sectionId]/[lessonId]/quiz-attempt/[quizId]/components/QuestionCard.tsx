'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ChevronLeft, ChevronRight, Flag, Sparkles } from 'lucide-react'
import { QuizQuestion } from '@/lib/api/services/fetchQuiz'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface QuestionCardProps {
  question: QuizQuestion
  currentIndex: number
  totalQuestions: number
  selectedAnswers: string[]
  isFlagged: boolean
  onAnswerChange: (selectedOptions: string[]) => void
  onFlagChange: (isFlagged: boolean) => void
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  hideNavigation?: boolean
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswers,
  isFlagged,
  onAnswerChange,
  onFlagChange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  hideNavigation = false,
}: QuestionCardProps) {
  const handleSingleChoiceChange = (optionId: string) => {
    onAnswerChange([optionId])
  }

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onAnswerChange([...selectedAnswers, optionId])
    } else {
      onAnswerChange(selectedAnswers.filter(id => id !== optionId))
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
      <Card className="relative overflow-hidden border-brand-magenta/20 bg-white shadow-xl">
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <CardTitle className="text-lg bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
                  Câu hỏi {currentIndex + 1}/{totalQuestions}
                </CardTitle>
                <Badge variant="outline" className="text-xs border-brand-magenta/30 bg-brand-magenta/10 text-brand-magenta">
                  {question.points} điểm
                </Badge>
                {question.type === 'MultipleChoice' && (
                  <Badge variant="outline" className="text-xs border-brand-purple/30 bg-brand-purple/10 text-brand-purple">
                    Nhiều lựa chọn
                  </Badge>
                )}
              </div>
              <p className="text-base font-medium text-foreground leading-relaxed">{question.content}</p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFlagChange(!isFlagged)}
                className="shrink-0 ml-4 hover:bg-white hover:border-white"
              >
                <Flag className={cn(
                  "w-5 h-5",
                  isFlagged ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                )} />
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {/* Answer Options */}
          {question.type === 'MultipleChoice' ? (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.id)
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all backdrop-blur-sm relative overflow-hidden",
                      isSelected
                        ? "border-brand-magenta/50 bg-gradient-to-r from-brand-magenta/10 to-brand-purple/10 shadow-md shadow-brand-magenta/10"
                        : "border-border hover:border-brand-magenta/30 hover:bg-brand-magenta/5"
                    )}
                  >
                    <Checkbox
                      id={option.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleMultipleChoiceChange(option.id, checked as boolean)}
                      className="relative z-10 cursor-pointer border-brand-magenta/30 data-[state=checked]:bg-brand-magenta data-[state=checked]:border-brand-magenta"
                    />
                    <Label
                      className={cn(
                        "flex-1 text-sm relative z-10",
                        isSelected ? "text-foreground font-medium" : "text-foreground"
                      )}
                    >
                      {option.text}
                    </Label>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-brand-magenta relative z-10" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <RadioGroup
              value={selectedAnswers[0] || ''}
              onValueChange={handleSingleChoiceChange}
              className="space-y-3"
            >
              {question.options.map((option) => {
                const isSelected = selectedAnswers.includes(option.id)
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all backdrop-blur-sm relative overflow-hidden",
                      isSelected
                        ? "border-brand-magenta/50 bg-gradient-to-r from-brand-magenta/10 to-brand-purple/10 shadow-md shadow-brand-magenta/10"
                        : "border-border hover:border-brand-magenta/30 hover:bg-brand-magenta/5"
                    )}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="relative z-10 border-brand-magenta/30 text-brand-magenta"
                    />
                    <Label
                      className={cn(
                        "flex-1 text-sm relative z-10",
                        isSelected ? "text-foreground font-medium" : "text-foreground"
                      )}
                    >
                      {option.text}
                    </Label>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-brand-magenta relative z-10" />
                    )}
                  </motion.div>
                )
              })}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons - Outside Card */}
      {!hideNavigation && (
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            variant="outline"
            className="border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 disabled:opacity-30 hover:text-brand-magenta"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Câu trước
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <Sparkles className={cn("w-4 h-4", selectedAnswers.length > 0 ? "text-brand-magenta" : "text-muted-foreground")} />
            <span className={cn(selectedAnswers.length > 0 ? "text-brand-magenta font-medium" : "text-muted-foreground")}>
              {selectedAnswers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời'}
            </span>
          </div>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            variant="outline"
            className="border-brand-magenta/20 text-brand-magenta hover:bg-brand-magenta/10 disabled:opacity-30 hover:text-brand-magenta"
          >
            Câu sau
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Status indicator when navigation is hidden */}
      {hideNavigation && (
        <div className="flex items-center justify-center gap-2 text-sm mt-4">
          <Sparkles className={cn("w-4 h-4", selectedAnswers.length > 0 ? "text-brand-magenta" : "text-muted-foreground")} />
          <span className={cn(selectedAnswers.length > 0 ? "text-brand-magenta font-medium" : "text-muted-foreground")}>
            {selectedAnswers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời'}
          </span>
        </div>
      )}
    </motion.div>
  )
}
