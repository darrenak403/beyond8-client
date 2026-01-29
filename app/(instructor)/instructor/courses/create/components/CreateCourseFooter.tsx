'use client'

import { Button } from '@/components/ui/button'

interface CreateCourseFooterProps {
    onNext: () => void
    onBack: () => void
    nextLabel?: string
    nextDisabled?: boolean
    backDisabled?: boolean
    isLastStep?: boolean
    isSubmitting?: boolean
}

export default function CreateCourseFooter({
    onNext,
    onBack,
    nextLabel = 'Tiếp theo',
    nextDisabled = false,
    backDisabled = false,
    isLastStep = false,
    isSubmitting = false
}: CreateCourseFooterProps) {
    // Remove Progress Logic from UI

    return (
        <footer className="w-full bg-white py-6 border-t px-8 flex items-center justify-between">
            {/* Left Side: Tips Hint */}
            <div>
                <Button
                    variant="ghost"
                    onClick={onBack}
                    disabled={backDisabled || isSubmitting}
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                    Quay lại
                </Button>
            </div>

            {/* Right Side: Next Button */}
            <div>
                <Button
                    onClick={onNext}
                    disabled={nextDisabled || isSubmitting}
                    className={`gap-2 rounded-lg px-8 py-6 text-base font-semibold transition-all rounded-full
                            ${isLastStep
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/20'
                            : 'bg-black hover:bg-gray-800 text-white shadow-lg shadow-gray-500/20'
                        }`}
                >
                    {isLastStep ? (
                        <>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo khóa học'}
                        </>
                    ) : (
                        <>
                            {nextLabel}
                        </>
                    )}
                </Button>
            </div>
        </footer>
    )
}
