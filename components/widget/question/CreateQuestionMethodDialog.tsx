"use client"

import { motion } from "framer-motion"
import { Plus, FileUp, Layers } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateQuestionMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSingle: () => void
  onSelectBulk: () => void
  onSelectPDF: () => void
}

export function CreateQuestionMethodDialog({
  open,
  onOpenChange,
  onSelectSingle,
  onSelectBulk,
  onSelectPDF,
}: CreateQuestionMethodDialogProps) {
  const methods = [
    {
      id: "single",
      title: "Tạo một câu hỏi",
      description: "Tạo câu hỏi đơn lẻ với đầy đủ thông tin",
      icon: Plus,
      gradient: "from-brand-magenta to-brand-purple",
      onClick: () => {
        onSelectSingle()
        onOpenChange(false)
      },
    },
    {
      id: "bulk",
      title: "Tạo nhiều câu hỏi",
      description: "Tạo nhiều câu hỏi cùng lúc một cách nhanh chóng",
      icon: Layers,
      gradient: "from-emerald-500 to-green-500",
      onClick: () => {
        onSelectBulk()
        onOpenChange(false)
      },
    },
    {
      id: "pdf",
      title: "Tạo câu hỏi từ PDF",
      description: "Upload file PDF để tự động tạo câu hỏi",
      icon: FileUp,
      gradient: "from-amber-500 to-orange-500",
      onClick: () => {
        onSelectPDF()
        onOpenChange(false)
      },
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-brand-magenta/20 bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent">
            Chọn phương thức tạo câu hỏi
          </DialogTitle>
          <DialogDescription>
            Chọn cách bạn muốn tạo câu hỏi cho ngân hàng câu hỏi
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-4">
          {methods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={method.onClick}
                className="group relative overflow-hidden rounded-2xl border border-brand-magenta/20 bg-linear-to-br from-white/90 to-white/70 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-magenta/10 hover:scale-105 active:scale-95"
              >
                {/* Gradient accent line */}
                {/* <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${method.gradient}`} /> */}

                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex rounded-full bg-linear-to-br ${method.gradient} p-3 text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-brand-magenta transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  {/* <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} /> */}
                </div>
              </motion.button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
