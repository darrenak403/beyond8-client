"use client"

import { BookOpen, Ticket } from "lucide-react"
import { motion } from "framer-motion"
import SafeImage from "@/components/ui/SafeImage"

interface CourseFolderCardProps {
    courseName: string
    couponCount: number
    thumbnailUrl?: string
    onClick: () => void
}

export function CourseFolderCard({ courseName, couponCount, thumbnailUrl, onClick }: CourseFolderCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative w-full aspect-video bg-muted overflow-hidden">
                {thumbnailUrl ? (
                    <SafeImage
                        src={thumbnailUrl}
                        alt={courseName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        width={500}
                        height={500}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-pink/10 to-brand-purple/10">
                        <BookOpen className="h-12 w-12 text-brand-magenta/50 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                )}
            </div>

            <div className="flex flex-col grow p-4 md:p-5">
                {/* Course Name */}
                <h3 className="font-semibold text-base md:text-lg text-foreground transition-colors duration-300 group-hover:text-brand-magenta line-clamp-2 min-h-12">
                    {courseName}
                </h3>

                {/* Coupon Count */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-brand-magenta font-medium bg-brand-magenta/5 px-2.5 py-1.5 rounded-md w-full justify-center">
                        <Ticket className="h-4 w-4" />
                        <span>{couponCount} mã giảm giá</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
