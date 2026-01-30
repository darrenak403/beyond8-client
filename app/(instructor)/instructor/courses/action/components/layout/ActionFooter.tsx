import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ActionFooterProps {
    onBack: () => void
    onNext: () => void
    isFirstStep: boolean
    isLastStep: boolean
    isValid: boolean
}

export default function ActionFooter({
    onBack,
    onNext,
    isFirstStep,
    isLastStep,
    isValid
}: ActionFooterProps) {
    return (
        <div className="flex items-center justify-between p-4 border-t bg-white mt-auto">
            <Button
                variant="ghost"
                onClick={onBack}
                disabled={isFirstStep}
                className="font-medium rounded-full hover:bg-gray-100 hover:text-black "
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
            </Button>

            <Button
                onClick={onNext}
                disabled={!isValid}
                className="font-medium rounded-full"
            >
                {isLastStep ? 'Nội dung khóa học' : 'Tiếp tục'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
        </div>
    )
}
