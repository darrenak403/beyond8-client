"use client"

import { Folder, FileQuestion } from "lucide-react"
import { motion } from "framer-motion"

interface TagFolderCardProps {
  tag: string
  count: number
  onClick: () => void
}

export function TagFolderCard({ tag, count, onClick }: TagFolderCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-magenta/20 bg-white/80 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10"
    >
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Folder Icon */}
        <div className="relative">
          <div className="relative rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 p-4">
            <Folder className="h-12 w-12 text-brand-magenta transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {/* Tag Name */}
        <div className="text-center">
          <h3 className="font-semibold text-lg text-foreground transition-colors duration-300 group-hover:text-brand-magenta">
            {tag}
          </h3>
          
          {/* Question Count */}
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileQuestion className="h-4 w-4" />
            <span>{count} câu hỏi</span>
          </div>
        </div>
      </div>

    </motion.div>
  )
}
