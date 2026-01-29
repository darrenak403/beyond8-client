'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Step3DescriptionProps {
    data: {
        shortDescription: string
        description: string
    }
    onChange: (data: Partial<Step3DescriptionProps['data']>) => void
}

export default function Step3Description({ data, onChange }: Step3DescriptionProps) {
    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Mô tả khóa học</h2>
                <p className="text-muted-foreground">
                    Mô tả chi tiết giúp học viên hiểu rõ nội dung và lợi ích của khóa học.
                </p>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="shortDescription" className="text-base font-semibold">Mô tả ngắn</Label>
                        <span className="text-xs text-muted-foreground">{data.shortDescription.length}/200</span>
                    </div>

                    <Textarea
                        id="shortDescription"
                        placeholder="Tóm tắt nội dung chính của khóa học trong vài câu..."
                        value={data.shortDescription}
                        onChange={(e) => {
                            if (e.target.value.length <= 200) {
                                onChange({ shortDescription: e.target.value })
                            }
                        }}
                        className="h-32 resize-none text-base leading-relaxed p-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">Mô tả chi tiết</Label>
                    <Textarea
                        id="description"
                        placeholder="Trình bày chi tiết về nội dung, mục tiêu và đối tượng của khóa học..."
                        value={data.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        className="min-h-[300px] text-base leading-relaxed p-4"
                    />
                </div>
            </div>
        </div>
    )
}
