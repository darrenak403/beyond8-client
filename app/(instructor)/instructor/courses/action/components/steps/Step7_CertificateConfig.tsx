'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Award, Percent } from 'lucide-react'
import { useGetCourseCertificateConfig, useUpdateCourseCertificateConfig } from '@/hooks/useCourse'

interface Step7CertificateConfigProps {
    courseId: string
}

export default function Step7CertificateConfig({ courseId }: Step7CertificateConfigProps) {
    const { courseCertificateConfig, isLoading } = useGetCourseCertificateConfig(courseId)
    const { updateCourseCertificateConfig, isPending } = useUpdateCourseCertificateConfig()

    const [assignmentMinPercent, setAssignmentMinPercent] = useState<number | null>(
        courseCertificateConfig?.assignmentAverageMinPercent ?? null
    )
    const [quizMinPercent, setQuizMinPercent] = useState<number | null>(
        courseCertificateConfig?.quizAverageMinPercent ?? null
    )

    const handleSave = async () => {
        try {
            await updateCourseCertificateConfig({
                courseId,
                data: {
                    assignmentAverageMinPercent: assignmentMinPercent,
                    quizAverageMinPercent: quizMinPercent,
                },
            })
        } catch (error) {
            console.error('Error updating certificate config:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto justify-center items-center min-h-[calc(100vh-300px)]">
                <p className="text-muted-foreground">Đang tải cấu hình...</p>
            </div>
        )
    }
    return (
        <div className="w-full mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Điều kiện cấp chứng chỉ</h2>
                <p className="text-muted-foreground">
                    Thiết lập điểm tối thiểu để học viên đủ điều kiện nhận chứng chỉ hoàn thành khóa học.
                </p>
            </div>

            <div className="space-y-6">
                {/* Quiz Average Minimum */}
                <div className="space-y-4 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                            <Percent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-base font-semibold text-gray-900">Điểm trung bình Quiz tối thiểu</Label>
                            <p className="text-sm text-muted-foreground">
                                Học viên cần đạt điểm trung bình tối thiểu này cho tất cả các quiz trong khóa học
                            </p>
                        </div>
                    </div>

                    <div className="pl-11 space-y-3">
                        <div className="relative max-w-xs">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={quizMinPercent ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? null : parseFloat(e.target.value)
                                    if (value === null || (value >= 0 && value <= 100)) {
                                        setQuizMinPercent(value)
                                    }
                                }}
                                className="h-11 text-base pr-12 focus-visible:ring-blue-500"
                                placeholder="Nhập % (0-100)"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                %
                            </div>
                        </div>

                        {quizMinPercent === null && (
                            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Không yêu cầu điểm quiz tối thiểu
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Average Minimum */}
                <div className="space-y-4 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                            <Percent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-base font-semibold text-gray-900">Điểm trung bình Assignment tối thiểu</Label>
                            <p className="text-sm text-muted-foreground">
                                Học viên cần đạt điểm trung bình tối thiểu này cho tất cả các assignment trong khóa học
                            </p>
                        </div>
                    </div>

                    <div className="pl-11 space-y-3">
                        <div className="relative max-w-xs">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={assignmentMinPercent ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? null : parseFloat(e.target.value)
                                    if (value === null || (value >= 0 && value <= 100)) {
                                        setAssignmentMinPercent(value)
                                    }
                                }}
                                className="h-11 text-base pr-12 focus-visible:ring-green-500"
                                placeholder="Nhập % (0-100)"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                %
                            </div>
                        </div>

                        {assignmentMinPercent === null && (
                            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Không yêu cầu điểm assignment tối thiểu
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="w-full h-11 text-base font-medium rounded-xl"
                        size="lg"
                    >
                        {isPending ? 'Đang xử lí...' : 'Cập nhật'}
                    </Button>
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Lưu ý
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800/80 pl-2">
                        <li>Nếu để trống cả hai trường, học viên chỉ cần hoàn thành tất cả bài học để nhận chứng chỉ</li>
                        <li>Điểm trung bình được tính dựa trên tất cả các quiz/assignment trong khóa học</li>
                        <li>Học viên phải đạt cả hai điều kiện (nếu có) để được cấp chứng chỉ</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
