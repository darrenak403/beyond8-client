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
                className={`font-medium text-gray-600 hover:text-gray-900 ${isFirstStep ? 'opacity-0 pointer-events-none' : ''}`}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
            </Button>

            {!isLastStep && (
                <Button
                    onClick={onNext}
                    disabled={!isValid}
                    className="bg-black hover:bg-gray-800 text-white font-medium px-8"
                >
                    Tiếp tục
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            )}
        </div>
    )
}
