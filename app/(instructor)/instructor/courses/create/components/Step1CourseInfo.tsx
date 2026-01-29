'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCategory } from '@/hooks/useCategory'

interface Step1CourseInfoProps {
    data: {
        title: string
        shortDescription: string
        description: string
        categoryId: string
        level: string
        language: string
    }
    onChange: (data: Partial<Step1CourseInfoProps['data']>) => void
}

export default function Step1CourseInfo({ data, onChange }: Step1CourseInfoProps) {
    const { categories } = useCategory()

    // Flatten categories
    const flattenedCategories = categories?.data.flatMap(cat => [
        cat,
        ...(cat.subCategories || [])
    ]) || []

    return (
        <div className="space-y-6 max-w-3xl mx-auto py-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Thông tin cơ bản</h2>
                <p className="text-muted-foreground">
                    Cung cấp thông tin tổng quan về khóa học của bạn để thu hút học viên.
                </p>
            </div>

            <div className="space-y-6 border rounded-xl p-6 bg-white shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Tiêu đề khóa học <span className="text-red-500">*</span></Label>
                    <Input
                        id="title"
                        placeholder="VD: Nhập môn ReactJS từ con số 0"
                        value={data.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDescription" className="text-base">Mô tả ngắn <span className="text-red-500">*</span></Label>
                    <p className="text-xs text-muted-foreground">Mô tả này sẽ xuất hiện trên thẻ khóa học (tối đa 200 ký tự).</p>
                    <Textarea
                        id="shortDescription"
                        placeholder="Tóm tắt nội dung chính của khóa học..."
                        value={data.shortDescription}
                        onChange={(e) => onChange({ shortDescription: e.target.value })}
                        className="h-24 resize-none"
                        maxLength={200}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                    <p className="text-xs text-muted-foreground">Chi tiết về những gì học viên sẽ học, cấu trúc khóa học, v.v.</p>
                    <Textarea
                        id="description"
                        placeholder="Mô tả chi tiết về khóa học..."
                        value={data.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        className="min-h-[200px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-base">Danh mục <span className="text-red-500">*</span></Label>
                        <Select value={data.categoryId} onValueChange={(value) => onChange({ categoryId: value })}>
                            <SelectTrigger className="h-11">
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

                    <div className="space-y-2">
                        <Label htmlFor="level" className="text-base">Cấp độ <span className="text-red-500">*</span></Label>
                        <Select value={data.level} onValueChange={(value) => onChange({ level: value })}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Cơ bản</SelectItem>
                                <SelectItem value="Intermediate">Trung bình</SelectItem>
                                <SelectItem value="Advanced">Nâng cao</SelectItem>
                                <SelectItem value="Expert">Chuyên gia</SelectItem>
                                <SelectItem value="All">Tất cả trình độ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language" className="text-base">Ngôn ngữ <span className="text-red-500">*</span></Label>
                    <Input
                        id="language"
                        placeholder="VD: Tiếng Việt"
                        value={data.language}
                        onChange={(e) => onChange({ language: e.target.value })}
                        className="h-11"
                    />
                </div>

            </div>
        </div>
    )
}
