'use client'

import React from 'react'
import { User, BookOpen, Image as ImageIcon, LayoutList } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CourseActionSidebarProps {
    currentStep: number
    onStepClick: (step: number) => void
    stepsValidity: boolean[]
    isEditMode?: boolean
    viewMode?: 'info' | 'content'
}

const infoSteps = [
    {
        id: 1,
        title: 'Tiêu đề & Mô tả',
        icon: User,
    },
    {
        id: 2,
        title: 'Thông tin chi tiết',
        icon: BookOpen,
    },
    {
        id: 3,
        title: 'Mục tiêu & Yêu cầu',
        icon: LayoutList,
    },
    {
        id: 5, // Skip 4
        title: 'Hình ảnh & Giá',
        icon: ImageIcon,
    },
]

const contentSteps = [
    {
        id: 4,
        title: 'Nội dung khóa học',
        icon: BookOpen,
    },
]

export default function CourseActionSidebar({
    currentStep,
    onStepClick,
    stepsValidity,
    isEditMode = false,
    viewMode = 'info'
}: CourseActionSidebarProps) {
    const steps = viewMode === 'info' ? infoSteps : contentSteps
    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const isAccessible = (stepId: number) => {
        if (isEditMode) return true // Unlock all in edit mode
        if (stepId === 1) return true
        for (let i = 0; i < stepId - 1; i++) {
            if (!stepsValidity[i]) return false
        }
        return true
    }

    return (
        <aside className={`${isCollapsed ? 'w-[80px] py-4' : 'w-[320px] p-6'} bg-purple-100 h-full hidden lg:flex flex-col justify-between transition-all duration-300 ease-in-out`}>
            {/* Top Section */}
            <div className={`mb-12 h-10 flex items-center flex-shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
                <Link href="/instructor/dashboard" className={`flex items-center gap-2 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <div className="flex-shrink-0 relative">
                        {isCollapsed ? (
                            <Image src="/icon-logo.png" alt="Beyond 8" width={40} height={40} className="h-10 w-10 object-contain" priority />
                        ) : (
                            <Image src="/white-text-logo.svg" alt="Beyond 8" width={140} height={40} className="h-10 w-auto object-contain" priority />
                        )}
                    </div>
                </Link>
            </div>

            {/* Steps */}
            <ScrollArea className={`flex-1 ${isCollapsed ? 'w-full px-0' : '-mr-2 pr-3'}`} type="scroll">
                <div className="space-y-6 pb-4">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id
                        const canAccess = isAccessible(step.id)

                        return (
                            <button
                                key={step.id}
                                onClick={() => canAccess && onStepClick(step.id)}
                                disabled={!canAccess}
                                className={`
                                    flex items-center text-left transition-all group rounded-xl relative
                                    ${isCollapsed ? 'w-12 h-12 justify-center mx-auto p-0' : 'w-full gap-4 p-3'}
                                    ${isActive ? 'bg-purple-50' : 'hover:bg-gray-50'}
                                    ${!canAccess ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                                `}
                                title={isCollapsed ? step.title : undefined}
                            >
                                <div className={`
                                    flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 transition-colors
                                    ${isActive ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-gray-400 group-hover:border-gray-400'}
                                `}>
                                    {step.icon && <step.icon className="h-4 w-4" />}
                                </div>
                                {!isCollapsed && (
                                    <div className="flex-1 overflow-hidden">
                                        <p className={`text-lg font-medium transition-colors truncate ${isActive ? 'text-purple-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{step.title}</p>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Bottom - Collapse Button */}
            <div className="flex justify-center">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </aside>
    )
}
