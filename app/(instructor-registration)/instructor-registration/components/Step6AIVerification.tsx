"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useInstructorRegistration, useCheckAIHealth } from "@/hooks/useInstructorRegistration";
import { useIsMobile } from "@/hooks/useMobile";
import type { InstructorRegistrationRequest, AIProfileReviewRequest } from "@/lib/api/services/fetchInstructorRegistration";

interface Step6Props {
  onSubmit: () => void;
  onBack: () => void;
  formData: InstructorRegistrationRequest;
  isSubmitting?: boolean;
  onReviewComplete?: (result: { isAccepted: boolean }) => void;
}

export default function Step6AIVerification({  formData, onReviewComplete }: Step6Props) {
  const { reviewApplicationAsync, isReviewing, reviewData } = useInstructorRegistration();
  const { isAIAvailable, isLoading: isCheckingAI } = useCheckAIHealth();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const runAIReview = async () => {
      // Kiểm tra AI service có khả dụng không
      if (!isAIAvailable) {
        setAiError("Dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau.");
        setHasReviewed(true);
        return;
      }

      try {
        // Chỉ truyền các field cần thiết cho AI review
        const reviewRequest: AIProfileReviewRequest = {
          bio: formData.bio,
          headline: formData.headline,
          expertiseAreas: formData.expertiseAreas,
          education: formData.education,
          workExperience: formData.workExperience,
          certificates: formData.certificates,
          teachingLanguages: formData.teachingLanguages,
        };
        
        const result = await reviewApplicationAsync(reviewRequest);
        setHasReviewed(true);
        if (onReviewComplete && result) {
          onReviewComplete({ isAccepted: result.isAccepted });
        }
      } catch (error) {
        console.error("AI Review error:", error);
        setAiError("Có lỗi xảy ra khi đánh giá hồ sơ. Vui lòng thử lại.");
        setHasReviewed(true);
      }
    };

    if (!hasReviewed && !isReviewing && !isCheckingAI) {
      runAIReview();
    }
  }, [formData, reviewApplicationAsync, hasReviewed, isReviewing, isCheckingAI, isAIAvailable, onReviewComplete]);

  const getStatusIcon = (status: string | null) => {
    if (status === 'Valid') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'Warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    if (status === 'Invalid') return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  const canSubmit = reviewData?.isAccepted === true;
  const progress = reviewData ? reviewData.totalScore : 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        <h2 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Xác minh hồ sơ bằng AI
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
          AI đang kiểm tra tính hợp lệ và chất lượng của hồ sơ
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto pr-2 scrollbar-hide flex-1 mt-8 space-y-6">
        {/* AI Error Card */}
        {aiError && (
          <Card className="border-2 border-red-200 bg-red-50 rounded-4xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-red-800">
                    Dịch vụ AI không khả dụng
                  </h3>
                  <p className="text-sm mt-2 text-red-700">
                    {aiError}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Card */}
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Điểm số tổng thể</h3>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tiến độ kiểm tra</span>
                  <span className="font-medium">{isReviewing ? "Đang xử lý..." : "Hoàn thành"}</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Results */}
        {isReviewing ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-2 border-gray-100 rounded-4xl">
                <CardContent className="pt-4 px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviewData ? (
          <div className="space-y-3">
            {reviewData.details.map((detail, index) => (
              <Card key={index} className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
                <CardContent className="pt-4 px-4 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50">
                          {getStatusIcon(detail.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{detail.sectionName}</p>
                          <p className="text-sm text-gray-600">Điểm: {detail.score}%</p>
                        </div>
                      </div>
                    </div>
                    
                    {detail.issues.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="font-medium text-red-700 text-sm mb-2">⚠️ Vấn đề:</p>
                        <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                          {detail.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {detail.suggestions.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-medium text-blue-700 text-sm mb-2">💡 Gợi ý:</p>
                        <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                          {detail.suggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Final Result Card */}
        {reviewData && (
          <Card className={`border-2 ${canSubmit ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} rounded-4xl`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${canSubmit ? 'bg-green-100' : 'bg-red-100'}`}>
                  {canSubmit ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${canSubmit ? 'text-green-800' : 'text-red-800'}`}>
                    {canSubmit ? 'Hồ sơ của bạn đạt yêu cầu!' : 'Hồ sơ chưa đạt yêu cầu'}
                  </h3>
                  {reviewData.feedbackSummary && (
                    <p className={`text-sm mt-2 ${canSubmit ? 'text-green-700' : 'text-red-700'}`}>
                      {reviewData.feedbackSummary}
                    </p>
                  )}
                  {!canSubmit && (
                    <p className="text-sm mt-2 text-red-700">
                      Vui lòng quay lại và bổ sung thêm thông tin theo gợi ý.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Feedback */}
        {reviewData?.additionalFeedback && (
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-2">Phản hồi bổ sung:</p>
                  <p className="text-sm text-gray-600">{reviewData.additionalFeedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
