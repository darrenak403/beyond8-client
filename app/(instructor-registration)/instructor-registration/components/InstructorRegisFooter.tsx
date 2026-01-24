"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InstructorRegisFooterProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  isLastStep?: boolean;
}

export default function InstructorRegisFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "Tiếp theo",
  nextDisabled = false,
  showBack = true,
  isLastStep = false,
}: InstructorRegisFooterProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <footer className="sticky bottom-0 z-50 bg-white border-t shadow-lg">
      {/* Progress Bar */}
      <div className="w-full">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Navigation */}
      <div className="px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
        {/* Back Button */}
        <div className="flex-1">
          {showBack && onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2 rounded-2xl cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>
          )}
        </div>

        {/* Next Button */}
        <div className="flex-1 flex justify-end">
          {onNext && (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className={`gap-2 rounded-2xl cursor-pointer ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {nextLabel}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
