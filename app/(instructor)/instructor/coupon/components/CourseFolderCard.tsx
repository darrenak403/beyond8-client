"use client"

import { BookOpen, Ticket } from "lucide-react"
import { motion } from "framer-motion"

interface CourseFolderCardProps {
    courseName: string
    couponCount: number
    onClick: () => void
}

export function CourseFolderCard({ courseName, couponCount, onClick }: CourseFolderCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-magenta/20 bg-white/80 p-6 shadow-lg shadow-brand-magenta/5 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10"
        >
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Course Icon */}
                <div className="relative">
                    <div className="relative rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 p-4">
                        <BookOpen className="h-12 w-12 text-brand-magenta transition-transform duration-300 group-hover:scale-110" />
                    </div>
                </div>

                {/* Course Name */}
                <div className="text-center w-full">
                    <h3 className="font-semibold text-lg text-foreground transition-colors duration-300 group-hover:text-brand-magenta line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                        {courseName}
                    </h3>

                    {/* Coupon Count */}
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Ticket className="h-4 w-4" />
                        <span>{couponCount} mã giảm giá</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
