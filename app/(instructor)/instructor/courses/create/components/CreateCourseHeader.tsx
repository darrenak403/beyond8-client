'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function CreateCourseHeader({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    const router = useRouter()

    const handleExit = () => {
        router.push('/instructor/courses')
    }

    return (
        <header className="px-8 py-6 flex items-center justify-between bg-white w-full">
            <div>
                {/* Placeholder for Title or "Step X/Y" if needed */}
                <span className="text-sm font-semibold text-gray-500">Bước {currentStep}/{totalSteps}</span>
            </div>

            {/* Exit Button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="rounded-full bg-gray-100 hover:bg-gray-200 text-black px-6 font-semibold">
                        Lưu và thoát
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Thoát tạo khóa học?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Thông tin bạn đã nhập sẽ không được lưu. Bạn có chắc chắn muốn thoát?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-2xl cursor-pointer hover:bg-gray-100 hover:text-black">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExit} className="bg-red-600 hover:bg-red-700 rounded-2xl cursor-pointer">
                            Thoát
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    )
}
