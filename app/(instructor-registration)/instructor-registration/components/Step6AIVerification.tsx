"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInstructorRegistration } from "@/hooks/useInstructorRegistration";
import type { InstructorRegistrationRequest } from "@/lib/api/services/fetchInstructorRegistration";

interface Step7Props {
  onSubmit: () => void;
  onBack: () => void;
  formData: InstructorRegistrationRequest;
  isSubmitting?: boolean;
  onReviewComplete?: (result: { isAccepted: boolean }) => void;
}

export default function Step7AIVerification({ onSubmit, onBack, formData, isSubmitting = false, onReviewComplete }: Step7Props) {
  const { reviewApplicationAsync, isReviewing, reviewData } = useInstructorRegistration();
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const runAIReview = async () => {
      try {
        const result = await reviewApplicationAsync(formData);
        setHasReviewed(true);
        if (onReviewComplete && result) {
          onReviewComplete({ isAccepted: result.isAccepted });
        }
      } catch (error) {
        console.error("AI Review error:", error);
        setHasReviewed(true);
      }
    };

    if (!hasReviewed && !isReviewing) {
      runAIReview();
    }
  }, [formData, reviewApplicationAsync, hasReviewed, isReviewing, onReviewComplete]);

  const getStatusIcon = (status: string) => {
    if (status === 'Valid') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'Warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const canSubmit = reviewData?.isAccepted === true;
  const progress = reviewData ? reviewData.totalScore : 0;

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Xác minh hồ sơ</h2>
        <p className="text-gray-600">AI đang kiểm tra tính hợp lệ của hồ sơ</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kết quả kiểm tra</h3>
        <p className="text-sm text-gray-600">
          {isReviewing ? "Đang xử lý..." : `Điểm số: ${progress}%`}
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ kiểm tra</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {isReviewing ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : reviewData ? (
            <div className="space-y-3">
              {reviewData.details.map((detail, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(detail.status)}
                      <div>
                        <p className="font-medium">{detail.sectionName}</p>
                        <p className="text-sm text-gray-600">Điểm: {detail.score}%</p>
                      </div>
                    </div>
                  </div>
                  
                  {detail.issues.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium text-red-600">Vấn đề:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {detail.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {detail.suggestions.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium text-blue-600">Gợi ý:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {detail.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {reviewData && (
            <Alert variant={canSubmit ? "default" : "destructive"}>
              <AlertDescription>
                {canSubmit ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Hồ sơ của bạn đạt yêu cầu!</p>
                      {reviewData.feedbackSummary && (
                        <p className="text-sm mt-1">{reviewData.feedbackSummary}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Hồ sơ chưa đạt yêu cầu</p>
                      {reviewData.feedbackSummary && (
                        <p className="text-sm mt-1">{reviewData.feedbackSummary}</p>
                      )}
                      <p className="text-sm mt-1">Vui lòng quay lại và bổ sung thêm thông tin theo gợi ý.</p>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {reviewData?.additionalFeedback && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900 mb-2">Phản hồi bổ sung:</p>
              <p className="text-sm text-blue-800">{reviewData.additionalFeedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
