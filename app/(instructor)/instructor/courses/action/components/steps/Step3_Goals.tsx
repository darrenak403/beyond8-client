'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Step2CurriculumProps {
    data: {
        outcomes: string[]
        requirements: string[]
        targetAudience: string[]
    }
    onChange: (data: Partial<Step2CurriculumProps['data']>) => void
}

export default function Step2Curriculum({ data, onChange }: Step2CurriculumProps) {

    const handleAddItem = (field: keyof typeof data) => {
        onChange({ [field]: [...data[field], ''] })
    }

    const handleRemoveItem = (field: keyof typeof data, index: number) => {
        const newItems = data[field].filter((_, i) => i !== index)
        onChange({ [field]: newItems })
    }

    const handleChangeItem = (field: keyof typeof data, index: number, value: string) => {
        const newItems = [...data[field]]
        newItems[index] = value
        onChange({ [field]: newItems })
    }

    const renderListInput = (
        title: string,
        description: string,
        field: keyof typeof data,
    ) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Label className="text-base font-semibold">{title}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddItem(field)}
                    className="text-brand-magenta hover:text-brand-magenta/80"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                </Button>
            </div>

            <div className="space-y-3">
                {data[field].map((item, index) => (
                    <div key={index} className="flex gap-2 group">
                        <Input
                            value={item}
                            onChange={(e) => handleChangeItem(field, index, e.target.value)}
                            className="flex-1 h-12 text-base bg-transparent border border-gray-500 rounded-lg focus-visible:ring-0 focus-visible:border-black transition-colors"
                        />
                        {data[field].length > 1 ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(field, index)}
                                className="h-12 w-12 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        ) : (
                            <div className="w-12 h-12 flex-shrink-0" />
                        )}
                    </div>
                ))}
                {data[field].length === 0 && (
                    <div className="text-sm text-center py-4 bg-gray-50 rounded-lg text-muted-foreground dashed border border-dashed cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddItem(field)}>
                        Chưa có mục nào. Nhấn để thêm.
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col h-full w-full mx-auto transition-all duration-700 ease-in-out py-8 space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Nội dung khóa học</h2>
                <p className="text-muted-foreground">
                    Xác định mục tiêu và đối tượng cho khóa học của bạn.
                </p>
            </div>

            <div className="space-y-8">
                {renderListInput(
                    'Học viên sẽ học được gì?',
                    'Liệt kê ít nhất 1 mục tiêu chính mà học viên sẽ đạt được sau khóa học.',
                    'outcomes',
                )}

                <div className="h-px bg-gray-100" />

                {renderListInput(
                    'Yêu cầu đầu vào',
                    'Liệt kê các kỹ năng hoặc kiến thức cần thiết trước khi tham gia.',
                    'requirements',
                )}

                <div className="h-px bg-gray-100" />

                {renderListInput(
                    'Đối tượng học viên',
                    'Mô tả những ai nên tham gia khóa học này.',
                    'targetAudience',
                )}
            </div>
        </div>
    )
}
