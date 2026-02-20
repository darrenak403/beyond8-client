"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Home, FolderOpen, Plus, Ticket } from "lucide-react"
import { useGetCouponForInstructor, useDeleteCoupon, useToggleCoupon } from "@/hooks/useCoupon"
import { useGetCourseByInstructor } from "@/hooks/useCourse"
import { Coupon } from "@/lib/api/services/fetchCoupon"
import { CourseLevel } from "@/lib/api/services/fetchCourse"
import { CourseFolderCard } from "./CourseFolderCard"
import { CouponCard } from "./CouponCard"
import { InstructorCouponDialog } from "@/components/widget/coupon/InstructorCouponDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function CouponExplorer() {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

    // Fetch Data
    const { coupons, isLoading: isLoadingCoupons } = useGetCouponForInstructor()
    const { courses, isLoading: isLoadingCourses } = useGetCourseByInstructor({
        pageSize: 100,
        pageNumber: 1,
        isDescending: true,
        level: CourseLevel.All
    })
    const { deleteCoupon } = useDeleteCoupon()
    const { toggleCoupon } = useToggleCoupon()

    // Compute stats
    const courseStats = useMemo(() => {
        const stats: Record<string, number> = {}
        coupons.forEach(coupon => {
            if (coupon.applicableCourseId) {
                stats[coupon.applicableCourseId] = (stats[coupon.applicableCourseId] || 0) + 1
            }
        })
        return stats
    }, [coupons])

    // Get selected course details
    const selectedCourse = courses.find(c => c.id === selectedCourseId)

    // Filter coupons for selected course
    const filteredCoupons = useMemo(() => {
        if (!selectedCourseId) return []
        return coupons.filter(c => c.applicableCourseId === selectedCourseId)
    }, [selectedCourseId, coupons])

    const handleCourseClick = (courseId: string) => {
        setSelectedCourseId(courseId)
    }

    const handleBackToFolders = () => {
        setSelectedCourseId(null)
    }

    const handleAdd = () => {
        setSelectedCoupon(null)
        setDialogMode("add")
        setIsDialogOpen(true)
    }

    const handleEdit = (coupon: Coupon) => {
        setSelectedCoupon(coupon)
        setDialogMode("edit")
        setIsDialogOpen(true)
    }

    const handleDelete = async (coupon: Coupon) => {
        await deleteCoupon(coupon.id)
    }

    const handleToggleStatus = async (coupon: Coupon) => {
        await toggleCoupon(coupon.id)
    }

    const isLoading = isLoadingCoupons || isLoadingCourses

    return (
        <div className="space-y-6 py-3 relative min-h-[500px]">
            {/* Header: Breadcrumb Navigation + Action Buttons */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 -mx-2 px-2 border-b border-transparent transition-all data-[scrolled=true]:border-border/50 rounded-lg">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-md">
                    <button
                        onClick={handleBackToFolders}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-semibold cursor-pointer hover:bg-black/5 transition-colors ${!selectedCourseId ? 'text-brand-magenta bg-brand-magenta/5' : 'text-foreground'}`}
                    >
                        <Home className="h-4 w-4" />
                        <span>Mã giảm giá</span>
                    </button>

                    {selectedCourseId && selectedCourse && (
                        <>
                            <ChevronRight className="h-4 w-4 text-muted-foreground font-semibold" />
                            <div className="flex items-center gap-2 rounded-lg text-brand-magenta bg-brand-magenta/5 px-3 py-2 font-medium">
                                <FolderOpen className="h-4 w-4" />
                                <span className="max-w-[200px] truncate">{selectedCourse.title}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <Button
                        onClick={handleAdd}
                        className="group relative rounded-full bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20 hover:bg-brand-magenta/90"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 mr-2" />
                        Tạo mã giảm giá
                    </Button>
                </motion.div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {!selectedCourseId ? (
                    // Folders View
                    <motion.div
                        key="folders"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    >
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-40 rounded-2xl" />
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <CourseFolderCard
                                        courseName={course.title}
                                        couponCount={courseStats[course.id] || 0}
                                        onClick={() => handleCourseClick(course.id)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                                <p className="text-muted-foreground">Bạn chưa có khóa học nào.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // Coupons List View
                    <motion.div
                        key="coupons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} className="h-32 rounded-2xl" />
                            ))
                        ) : filteredCoupons.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {filteredCoupons.map((coupon, index) => (
                                    <CouponCard
                                        key={coupon.id}
                                        coupon={coupon}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center rounded-2xl border border-brand-magenta/20 bg-white/80 p-12 text-center backdrop-blur-xl"
                            >
                                <Ticket className="mb-4 h-16 w-16 text-brand-magenta/40" />
                                <h3 className="mb-2 text-xl font-semibold text-foreground">
                                    Chưa có mã giảm giá
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Khóa học này chưa có mã giảm giá nào. Hãy tạo mã mới ngay!
                                </p>
                                <Button onClick={handleAdd} variant="outline" className="border-brand-magenta text-brand-magenta hover:bg-brand-magenta/5">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tạo mã giảm giá cho khóa học này
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <InstructorCouponDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                initialData={selectedCoupon}
                preSelectedCourseId={selectedCourseId}
            />
        </div>
    )
}
