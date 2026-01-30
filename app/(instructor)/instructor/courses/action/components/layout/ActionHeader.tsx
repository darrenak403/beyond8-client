'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    disableContent = true
}: CourseActionHeaderProps & {
    viewMode: 'info' | 'content'
    onChangeViewMode: (mode: 'info' | 'content') => void
    disableContent?: boolean
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleExit = () => {
        router.push('/instructor/courses')
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
                {onSave && (
                    <Button
                        disabled={isSubmitting}
                        onClick={onSave}
                        className="rounded-full px-6 font-semibold bg-gray-200 hover:bg-gray-300 hover:text-black"
                        variant={'outline'}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu và thoát'}
                    </Button>
                )}
            </div>

            <ConfirmDialog
                title="Thoát?"
                description="Những thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn muốn thoát?"
                onConfirm={handleExit}
                open={open}
                onOpenChange={setOpen}
                variant='destructive'
            />
        </header>
    )
}
