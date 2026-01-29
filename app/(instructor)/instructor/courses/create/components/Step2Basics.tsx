'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCategory } from '@/hooks/useCategory'

interface Step2BasicsProps {
    data: {
        categoryId: string
        level: string
        language: string
    }
    onChange: (data: Partial<Step2BasicsProps['data']>) => void
}

export default function Step2Basics({ data, onChange }: Step2BasicsProps) {
    const { categories } = useCategory()

    // Flatten categories
    const flattenedCategories = categories?.data.flatMap(cat => [
        cat,
        ...(cat.subCategories || [])
    ]) || []

    return (
        <div className="w-full mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Thông tin cơ bản</h2>
                <p className="text-muted-foreground">
                    Giúp học viên tìm thấy khóa học của bạn dễ dàng hơn.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Danh mục</Label>
                    <Select value={data.categoryId} onValueChange={(value) => onChange({ categoryId: value })}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {flattenedCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Mức độ: <span className="text-purple-600">{
                            {
                                'Beginner': 'Cơ bản',
                                'Intermediate': 'Trung bình',
                                'Advanced': 'Nâng cao',
                                'Expert': 'Chuyên gia',
                                'All': 'Tất cả trình độ'
                            }[data.level] || 'Cơ bản'
                        }</span></Label>
                    </div>

                    <div className="pt-2 px-1">
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            value={
                                ['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(data.level) !== -1
                                    ? ['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(data.level)
                                    : 0
                            }
                            onChange={(e) => {
                                const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                                onChange({ level: levels[parseInt(e.target.value)] });
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:bg-purple-700 [&::-webkit-slider-thumb]:transition-colors"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>Cơ bản</span>
                            <span>Chuyên gia</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Ngôn ngữ</Label>
                    <Input
                        id="language"
                        placeholder="VD: Tiếng Việt"
                        value={data.language}
                        onChange={(e) => onChange({ language: e.target.value })}
                        className="h-12 text-base"
                    />
                </div>
            </div>
        </div>
    )
}
