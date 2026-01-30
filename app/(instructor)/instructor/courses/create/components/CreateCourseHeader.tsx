'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/widget/confirm-dialog'

export default function CreateCourseHeader({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleExit = () => {
        router.push('/instructor/courses')
    }

    return (
        <header className="px-8 py-6 flex items-center justify-between bg-white w-full">
            <div>
                {/* Placeholder for Title or "Step X/Y" if needed */}
                <span className="text-sm font-semibold text-gray-500">Bước {currentStep}/{totalSteps}</span>
            </div>

            <Button variant="ghost" className="rounded-full bg-gray-100 hover:bg-gray-200 text-black px-6 font-semibold"
                onClick={() => setOpen(true)}>
                Lưu và thoát
            </Button>

            {/* Exit Button */}
            <ConfirmDialog
                title="Thoát tạo khóa học?"
                description="Thông tin bạn đã nhập sẽ không được lưu. Bạn có chắc chắn muốn thoát?"
                onConfirm={handleExit}
                open={open}
                onOpenChange={setOpen}
                variant='destructive'
            />
        </header>
    )
}
