'use client'


import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const SUGGESTED_LANGUAGES = [
    "Tiếng Việt", "English", "日本語", "한국어", "简体中文", "繁體中文",
    "Français", "Deutsch", "Español", "Português", "Italiano", "Русский"
];
// Removed unused Select imports for Category
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

    const [open, setOpen] = useState(false)

    // Find selected category name for display
    const selectedCategory = categories?.data
        .flatMap(p => p.subCategories || [])
        .find(c => c.id === data.categoryId)

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
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-12 text-base font-normal"
                            >
                                {selectedCategory
                                    ? selectedCategory.name
                                    : "Chọn danh mục..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <div className="max-h-[300px] overflow-y-auto p-1">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                    defaultValue={categories?.data.find(p => p.subCategories?.some(s => s.id === data.categoryId))?.id}
                                >
                                    {categories?.data.map((parent) => (
                                        <AccordionItem key={parent.id} value={parent.id} className="border-b-0 px-2">
                                            <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                                                {parent.name}
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-0 pb-2">
                                                <div className="flex flex-col gap-1">
                                                    {parent.subCategories?.map((sub) => (
                                                        <Button
                                                            key={sub.id}
                                                            variant="ghost"
                                                            className={cn(
                                                                "justify-start h-9 px-2 text-sm font-normal",
                                                                data.categoryId === sub.id && "bg-purple-50 text-purple-700"
                                                            )}
                                                            onClick={() => {
                                                                onChange({ categoryId: sub.id })
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.categoryId === sub.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {sub.name}
                                                        </Button>
                                                    ))}
                                                    {(!parent.subCategories || parent.subCategories.length === 0) && (
                                                        <span className="text-xs text-muted-foreground px-2 py-1">Không có danh mục con</span>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </PopoverContent>
                    </Popover>
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
                    <Select value={data.language} onValueChange={(value) => onChange({ language: value })}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                        </SelectTrigger>
                        <SelectContent>
                            {SUGGESTED_LANGUAGES.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
