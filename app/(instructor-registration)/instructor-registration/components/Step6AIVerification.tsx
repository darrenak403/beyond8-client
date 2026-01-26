"use client";

import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useInstructorRegistration } from "@/hooks/useInstructorRegistration";
import { useIsMobile } from "@/hooks/useMobile";
import type { InstructorRegistrationRequest, AIProfileReviewRequest } from "@/lib/api/services/fetchInstructorRegistration";
import gsap from "gsap";

interface Step6Props {
  onSubmit: () => void;
  onBack: () => void;
  formData: InstructorRegistrationRequest;
  isSubmitting?: boolean;
  onReviewComplete?: (result: { isAccepted: boolean }) => void;
  onNavigateToStep?: (step: number) => void;
}

interface LoadingCardProps {
  index: number;
  sectionName: string;
}

// Mapping English section names to Vietnamese
const SECTION_NAME_MAP: Record<string, string> = {
  "Bio": "Thông tin cá nhân",
  "Headline": "Tiêu đề",
  "Expertise Areas": "Lĩnh vực chuyên môn",
  "Education": "Học vấn",
  "Work Experience": "Kinh nghiệm làm việc",
  "Certificates": "Chứng chỉ",
  "Teaching Languages": "Ngôn ngữ giảng dạy",
  "Social Links": "Liên kết mạng xã hội",
  "Bank Info": "Thông tin ngân hàng",
};

// Map section names to step numbers
const SECTION_TO_STEP_MAP: Record<string, number> = {
  "Bio": 2,
  "Headline": 2,
  "Thông tin cá nhân": 2,
  "Tiêu đề": 2,
  "Expertise Areas": 2,
  "Lĩnh vực chuyên môn": 2,
  "Education": 3,
  "Học vấn": 3,
  "Certificates": 4,
  "Chứng chỉ": 4,
  "Work Experience": 5,
  "Kinh nghiệm làm việc": 5,
  "Teaching Languages": 6,
  "Ngôn ngữ giảng dạy": 6,
  "Social Links": 6,
  "Liên kết mạng xã hội": 6,
  "Bank Info": 6,
  "Thông tin ngân hàng": 6,
};

function translateSectionName(englishName: string): string {
  return SECTION_NAME_MAP[englishName] || englishName;
}

function getStepFromSection(sectionName: string): number {
  return SECTION_TO_STEP_MAP[sectionName] || 1;
}

function LoadingCard({ index, sectionName }: LoadingCardProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressValue, setProgressValue] = useState(0);
  const targetProgress = useRef(60 + Math.random() * 35); // Random between 60-95%

  useEffect(() => {
    // Animate progress from 0 to random target (60-95%)
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        duration: 1.5,
        delay: index * 0.15,
        onUpdate: function() {
          const progress = this.progress() * targetProgress.current;
          setProgressValue(progress);
        }
      });
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <Card className="border-2 border-purple-100 rounded-4xl overflow-hidden">
      <CardContent className="pt-4 px-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <div className="w-5 h-5 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{sectionName}</p>
                <p className="text-sm text-gray-500">Đang phân tích...</p>
              </div>
            </div>
            <span className="text-lg font-bold text-purple-600">
              {Math.round(progressValue)}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                ref={progressRef}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              AI đang xử lý dữ liệu...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResultCardProps {
  detail: {
    sectionName: string;
    status: string | null;
    score: number;
    issues: string[];
    suggestions: string[];
  };
  index: number;
  onNavigateToStep?: (step: number) => void;
}

function ResultCard({ detail, index, onNavigateToStep }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressValue, setProgressValue] = useState(60 + Math.random() * 35); // Start at random 60-95%
  const [isRevealed, setIsRevealed] = useState(false);
  const vietnameseName = translateSectionName(detail.sectionName);
  const targetStep = getStepFromSection(detail.sectionName);

  const getStatusIcon = (status: string | null) => {
    if (status === 'Valid') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'Warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    if (status === 'Invalid') return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // First animate progress to 100%
      gsap.to(progressRef.current, {
        duration: 0.6,
        delay: index * 0.1,
        onUpdate: function() {
          const currentStart = progressValue;
          const progress = currentStart + (this.progress() * (100 - currentStart));
          setProgressValue(progress);
        },
        onComplete: () => {
          // Small delay before revealing content
          setTimeout(() => {
            setIsRevealed(true);
            gsap.from(cardRef.current, {
              opacity: 0,
              y: 20,
              duration: 0.4,
              ease: "power2.out"
            });
          }, 100);
        }
      });
    });

    return () => ctx.revert();
  }, [index, progressValue]);

  const handleCardClick = () => {
    if (onNavigateToStep && targetStep) {
      onNavigateToStep(targetStep);
    }
  };

  if (!isRevealed) {
    return (
      <Card className="border-2 border-purple-100 rounded-4xl overflow-hidden">
        <CardContent className="pt-4 px-4 pb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <div className="w-5 h-5 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{vietnameseName}</p>
                  <p className="text-sm text-gray-500">
                    {progressValue >= 99 ? "Hoàn tất..." : "Đang hoàn tất..."}
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {Math.round(progressValue)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      ref={cardRef} 
      className="border-2 border-purple-100 hover:border-purple-300 transition-all rounded-4xl cursor-pointer hover:shadow-lg group"
      onClick={handleCardClick}
    >
      <CardContent className="pt-4 px-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-purple-50">
                {getStatusIcon(detail.status)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{vietnameseName}</p>
                <p className="text-sm text-gray-600">Điểm: {detail.score}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Chỉnh sửa</span>
              <ChevronRight className="w-4 h-4" />
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
  );
}

export default function Step6AIVerification({  formData, onReviewComplete, onNavigateToStep }: Step6Props) {
  const { reviewApplicationAsync, isReviewing, reviewData } = useInstructorRegistration();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const runAIReview = async () => {
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

    if (!hasReviewed && !isReviewing) {
      runAIReview();
    }
  }, [formData, reviewApplicationAsync, hasReviewed, isReviewing, onReviewComplete]);

  const canSubmit = reviewData?.isAccepted === true;
  const progress = reviewData ? reviewData.totalScore : 0;

  const loadingSections = [
    "Thông tin cá nhân",
    "Kinh nghiệm làm việc",
    "Học vấn",
    "Chứng chỉ",
    "Lĩnh vực chuyên môn"
  ];

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
            {loadingSections.map((section, i) => (
              <LoadingCard key={i} index={i} sectionName={section} />
            ))}
          </div>
        ) : reviewData ? (
          <div className="space-y-3">
            {reviewData.details.map((detail, index) => (
              <ResultCard 
                key={index} 
                detail={detail} 
                index={index}
                onNavigateToStep={onNavigateToStep}
              />
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
                      Vui lòng nhấn vào các thẻ phía trên để quay lại và bổ sung thêm thông tin theo gợi ý.
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
