"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step7Props {
  onSubmit: () => void;
  onBack: () => void;
  formData: any;
  isSubmitting?: boolean;
}

export default function Step7AIVerification({ onSubmit, onBack, formData, isSubmitting = false }: Step7Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [checks, setChecks] = useState({
    documents: { status: 'pending', message: '' },
    basicInfo: { status: 'pending', message: '' },
    education: { status: 'pending', message: '' },
    experience: { status: 'pending', message: '' },
    additional: { status: 'pending', message: '' },
  });

  const runAICheck = async () => {
    setIsChecking(true);
    setProgress(0);

    // Simulate AI checking process
    const checkSteps = [
      { key: 'documents', delay: 1000, score: 20 },
      { key: 'basicInfo', delay: 1500, score: 20 },
      { key: 'education', delay: 1200, score: 20 },
      { key: 'experience', delay: 1300, score: 20 },
      { key: 'additional', delay: 1000, score: 20 },
    ];

    let totalScore = 0;

    for (const step of checkSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      const passed = Math.random() > 0.1; // 90% pass rate for demo
      const stepScore = passed ? step.score : step.score * 0.5;
      totalScore += stepScore;

      setChecks(prev => ({
        ...prev,
        [step.key]: {
          status: passed ? 'success' : 'warning',
          message: passed ? 'Đạt yêu cầu' : 'Cần bổ sung thêm thông tin',
        },
      }));

      setProgress((totalScore / 100) * 100);
    }

    setScore(totalScore);
    setIsChecking(false);
  };

  useEffect(() => {
    runAICheck();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'pending') return <Loader2 className="w-5 h-5 animate-spin text-gray-400" />;
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const canSubmit = score !== null && score >= 60;

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Xác minh hồ sơ</h2>
        <p className="text-gray-600">AI đang kiểm tra tính hợp lệ của hồ sơ</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kết quả kiểm tra</h3>
        <p className="text-sm text-gray-600">
          {isChecking ? "Đang xử lý..." : `Điểm số: ${score}%`}
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ kiểm tra</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="space-y-3">
            {Object.entries(checks).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(value.status)}
                  <div>
                    <p className="font-medium capitalize">
                      {key === 'documents' && 'Giấy tờ tùy thân'}
                      {key === 'basicInfo' && 'Thông tin cơ bản'}
                      {key === 'education' && 'Học vấn'}
                      {key === 'experience' && 'Kinh nghiệm'}
                      {key === 'additional' && 'Thông tin bổ sung'}
                    </p>
                    {value.message && (
                      <p className="text-sm text-gray-600">{value.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {score !== null && (
            <Alert variant={canSubmit ? "default" : "destructive"}>
              <AlertDescription>
                {canSubmit ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Hồ sơ của bạn đạt yêu cầu! Bạn có thể nộp hồ sơ ngay bây giờ.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span>Hồ sơ chưa đạt yêu cầu tối thiểu (60%). Vui lòng quay lại và bổ sung thêm thông tin.</span>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={isChecking || isSubmitting}>
              Quay lại
            </Button>
            {canSubmit ? (
              <Button
                onClick={onSubmit}
                disabled={isChecking || isSubmitting}
                className="bg-green-600 hover:bg-green-700 min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
                    <span>Đang nộp...</span>
                  </div>
                ) : (
                  "Nộp hồ sơ"
                )}
              </Button>
            ) : (
              <Button
                onClick={onBack}
                disabled={isChecking || isSubmitting}
                variant="outline"
              >
                Kiểm tra lại thông tin
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
