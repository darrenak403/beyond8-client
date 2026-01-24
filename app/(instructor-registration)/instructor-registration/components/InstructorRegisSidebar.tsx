"use client";

import { FileText, User, GraduationCap, Award, Briefcase, CreditCard, CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InstructorRegisSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  canProceedStep1: boolean;
  canProceedStep2: boolean;
  canProceedStep3: boolean;
  canProceedStep4: boolean;
  canProceedStep5: boolean;
  canProceedStep6: boolean;
}

export default function InstructorRegisSidebar({
  currentStep,
  onStepClick,
  canProceedStep1,
  canProceedStep2,
  canProceedStep3,
  canProceedStep4,
  canProceedStep5,
  canProceedStep6,
}: InstructorRegisSidebarProps) {
  const steps = [
    { number: 1, title: "Giấy tờ", icon: FileText },
    { number: 2, title: "Thông tin", icon: User },
    { number: 3, title: "Học vấn", icon: GraduationCap },
    { number: 4, title: "Chứng chỉ", icon: Award },
    { number: 5, title: "Kinh nghiệm", icon: Briefcase },
    { number: 6, title: "Bổ sung", icon: CreditCard },
    { number: 7, title: "Xác minh", icon: CheckCircle },
  ];

  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return canProceedStep1;
      case 2: return canProceedStep2;
      case 3: return canProceedStep3;
      case 4: return canProceedStep4;
      case 5: return canProceedStep5;
      case 6: return canProceedStep6;
      default: return false;
    }
  };

  const canAccessStep = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return true;
    }
    
    if (stepNumber === currentStep) {
      return true;
    }
    
    if (stepNumber === currentStep + 1) {
      return isStepCompleted(currentStep);
    }
    
    if (stepNumber > currentStep + 1) {
      for (let i = currentStep; i < stepNumber; i++) {
        if (!isStepCompleted(i)) {
          return false;
        }
      }
      return true;
    }
    
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === currentStep) {
      return;
    }
    
    if (canAccessStep(stepNumber)) {
      onStepClick(stepNumber);
    } else {
      toast.error("Vui lòng hoàn thành bước hiện tại trước khi tiếp tục");
    }
  };

  return (
    <aside className="w-64 sticky top-6 self-start">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
          Các bước đăng ký
        </h3>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = isStepCompleted(step.number);
          const isAccessible = canAccessStep(step.number);

          return (
            <button
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              disabled={!isAccessible}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                isActive && "bg-purple-100 border-2 border-purple-600",
                !isActive && isCompleted && "hover:bg-green-50",
                !isActive && !isCompleted && isAccessible && "hover:bg-gray-50",
                !isAccessible && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                  isActive && "bg-purple-600 text-white",
                  isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-purple-900",
                    isCompleted && "text-green-900",
                    !isActive && !isCompleted && "text-gray-700"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">Bước {step.number}/7</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
