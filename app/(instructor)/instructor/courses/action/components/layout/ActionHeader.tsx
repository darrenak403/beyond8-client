'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UnsaveDialog } from '@/components/widget/UnsaveDialog'
import { motion, AnimatePresence } from "framer-motion"
import { ConfirmDialog } from '@/components/widget/confirm-dialog'

interface CourseActionHeaderProps {
    currentStep: number
    totalSteps: number
    onSave?: () => void
    isSubmitting?: boolean
    isEditMode?: boolean
}

export default function CourseActionHeader({
    currentStep,
    totalSteps,
    onSave,
    isSubmitting = false,
    isEditMode = false,
    viewMode = 'info',
    onChangeViewMode,
    disableContent = true,
    isDirty = false
}: CourseActionHeaderProps & {
    viewMode: 'info' | 'content'
    onChangeViewMode: (mode: 'info' | 'content') => void
    disableContent?: boolean
    isDirty?: boolean
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    // Handle exit button click
    const handleExitClick = () => {
        if (isDirty) {
            setOpen(true)
        } else {
            router.push('/instructor/courses')
        }
    }

    const confirmExit = () => {
        router.push('/instructor/courses')
    }

    const handleSaveAndExit = async () => {
        if (onSave) {
            await onSave()
            router.push('/instructor/courses')
        }
    }

    return (
        <header className="px-8 py-6 flex items-center justify-between bg-white w-full shadow-sm z-10">
            <div>
                <span className="text-sm font-semibold text-gray-500">
                    {isEditMode ? 'Chỉnh sửa khóa học' : `Bước ${currentStep}/${totalSteps}`}
                </span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                <button
                    onClick={() => onChangeViewMode('info')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${viewMode === 'info'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Thông tin khóa học
                </button>
                <button
                    onClick={() => !disableContent && onChangeViewMode('content')}
                    disabled={disableContent}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${viewMode === 'content'
                        ? 'bg-white text-black shadow-sm'
                        : disableContent
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Nội dung khóa học
                </button>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={handleExitClick}
                    className="rounded-full px-6 font-semibold hover:bg-gray-100 hover:text-gray-900"
                >
                    Thoát
                </Button>

                {onSave && isEditMode && (
                    <AnimatePresence>
                        {isDirty && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Button
                                    disabled={isSubmitting}
                                    onClick={onSave}
                                    className="rounded-full px-6 font-semibold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {isEditMode ? (
                <UnsaveDialog
                    title="Chưa lưu thay đổi"
                    description="Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát không?"
                    onDiscard={confirmExit}
                    onSave={handleSaveAndExit}
                    open={open}
                    onOpenChange={setOpen}
                    isLoading={isSubmitting}
                />
            ) : (
                <ConfirmDialog
                    open={open}
                    onOpenChange={setOpen}
                    onConfirm={confirmExit}
                    title="Thoát tạo khóa học"
                    description="Bạn đang trong quá trình tạo khóa học. Nếu thoát bây giờ, mọi dữ liệu đã nhập sẽ bị mất. Bạn có chắc chắn muốn thoát không?"
                    confirmText="Thoát"
                    cancelText="Hủy"
                    variant="destructive"
                />
            )}
        </header>
    )
}
