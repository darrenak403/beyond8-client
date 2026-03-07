"use client"

import { Ticket } from "lucide-react"
import { motion } from "framer-motion"

interface CourseFolderCardProps {
    courseName: string
    couponCount: number
    onClick: () => void
}

export function CourseFolderCard({ courseName, couponCount, onClick }: CourseFolderCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group cursor-pointer flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-brand-magenta/40 hover:shadow-md hover:shadow-brand-magenta/10"
        >
            <h3 className="font-medium text-sm text-foreground group-hover:text-brand-magenta transition-colors leading-snug line-clamp-2">
                {courseName}
            </h3>
            <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-brand-magenta bg-brand-magenta/8 px-3 py-1.5 rounded-full border border-brand-magenta/20">
                <Ticket className="h-3.5 w-3.5" />
                <span>{couponCount}</span>
            </div>
        </motion.div>
    )
}
