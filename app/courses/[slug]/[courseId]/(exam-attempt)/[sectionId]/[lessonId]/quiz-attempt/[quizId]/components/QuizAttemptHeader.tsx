'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuizAttemptHeaderProps {
  quizTitle: string
  timeRemaining?: number | null
  onExit?: () => void
  onBack?: () => void
}

export default function QuizAttemptHeader({ quizTitle, timeRemaining, onExit, onBack }: QuizAttemptHeaderProps) {
  const [showExitDialog, setShowExitDialog] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isTimeRunningOut = timeRemaining !== null && timeRemaining !== undefined && timeRemaining < 300

  const handleExitConfirm = () => {
    setShowExitDialog(false)
    if (onExit) {
      onExit()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container relative flex flex-row w-full mx-auto items-center justify-between py-2">
        {/* Logo */}
        <div className="flex flex-row items-center">
          <Link href="/" className="flex flex-row items-center">
            <Image
              src="/white-text-logo.svg"
              alt="Beyond 8"
              width={100}
              height={100}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Quiz Title */}
        <div className="flex flex-row flex-1 items-center justify-center px-16">
          <h1 className="text-lg font-bold text-center line-clamp-1 text-foreground">
            {quizTitle}
          </h1>
        </div>

        {/* Timer and Exit */}
        <div className="flex flex-row items-center gap-4">
          {timeRemaining !== null && timeRemaining !== undefined && (
            <motion.div
              animate={isTimeRunningOut ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isTimeRunningOut ? Infinity : 0, duration: 1 }}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl border-2",
                isTimeRunningOut 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-gray-50 border-gray-200 text-foreground'
              )}
            >
              <Clock className={cn("w-4 h-4", isTimeRunningOut && "animate-pulse")} />
              <span className="font-mono font-bold tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            </motion.div>
          )}

          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack}
              className="text-foreground border-gray-200 hover:bg-gray-50 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          )}
          {onExit && !onBack && (
            <Button 
              variant="outline" 
              onClick={() => setShowExitDialog(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Thoát
            </Button>
          )}
        </div>
      </div>

      {/* Warning banner */}
      {isTimeRunningOut && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t bg-red-50"
        >
          <Alert className="rounded-none border-0 bg-transparent">
            <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
            <AlertDescription className="text-red-700 font-medium">
              Thời gian sắp hết! Hãy hoàn thành bài kiểm tra của bạn.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Exit Confirmation Dialog */}
      {onExit && (
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận thoát</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn thoát không? Tiến trình của bạn đã được lưu tự động và bạn có thể quay lại tiếp tục sau.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl cursor-pointer hover:bg-gray-100 hover:text-black">Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleExitConfirm}
                className="bg-red-600 hover:bg-red-700 rounded-2xl"
              >
                Thoát
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </header>
  )
}
