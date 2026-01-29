'use client'

import { useForm, useFieldArray, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useCreateCourse } from '@/hooks/useCourse'
import { useCategory } from '@/hooks/useCategory'
import { useAuth } from '@/hooks/useAuth'

const formSchema = z.object({
    title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
    shortDescription: z.string().min(10, 'Mô tả ngắn phải có ít nhất 10 ký tự'),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
    level: z.string().min(1, 'Vui lòng chọn cấp độ'),
    language: z.string().min(1, 'Vui lòng nhập ngôn ngữ'),
    price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    thumbnailUrl: z.string().url('Vui lòng nhập URL hợp lệ').optional().or(z.literal('')),
    outcomes: z.array(z.object({ value: z.string().min(1, 'Không được để trống') })),
    requirements: z.array(z.object({ value: z.string().min(1, 'Không được để trống') })),
    targetAudience: z.array(z.object({ value: z.string().min(1, 'Không được để trống') })),
})

interface CreateCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateCourseDialog({ open, onOpenChange }: CreateCourseDialogProps) {
    const { createCourse, isPending } = useCreateCourse()
    const { categories } = useCategory()
    const { user } = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            shortDescription: '',
            categoryId: '',
            level: '',
            language: 'Tiếng Việt',
            price: 0,
            thumbnailUrl: '',
            outcomes: [{ value: '' }],
            requirements: [{ value: '' }],
            targetAudience: [{ value: '' }],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createCourse({
                ...values,
                outcomes: values.outcomes.map(o => o.value),
                requirements: values.requirements.map(r => r.value),
                targetAudience: values.targetAudience.map(t => t.value),
                thumbnailUrl: values.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Placeholder
            })
            form.reset()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        }
    }

    // Flatten categories for the select
    const flattenedCategories = categories?.data.flatMap(cat => [
        cat,
        ...(cat.subCategories || [])
    ]) || []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Tạo khóa học mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin cơ bản cho khóa học mới của bạn.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tiêu đề khóa học</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tiêu đề khóa học" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Danh mục</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn danh mục" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {flattenedCategories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cấp độ</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn cấp độ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Cơ bản</SelectItem>
                                                    <SelectItem value="Intermediate">Trung bình</SelectItem>
                                                    <SelectItem value="Advanced">Nâng cao</SelectItem>
                                                    <SelectItem value="Expert">Chuyên gia</SelectItem>
                                                    <SelectItem value="All">Tất cả trình độ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giá (VNĐ)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngôn ngữ</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: Tiếng Việt, English..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <ListInput
                                control={form.control}
                                name="outcomes"
                                label="Học sinh sẽ học được gì?"
                                placeholder="VD: Hiểu rõ về React Hooks..."
                            />

                            <ListInput
                                control={form.control}
                                name="requirements"
                                label="Yêu cầu đầu vào"
                                placeholder="VD: Có kiến thức cơ bản về HTML/CSS..."
                            />

                            <ListInput
                                control={form.control}
                                name="targetAudience"
                                label="Đối tượng học viên"
                                placeholder="VD: Sinh viên CNTT, người mới bắt đầu..."
                            />

                            <FormField
                                control={form.control}
                                name="shortDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả ngắn</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Mô tả ngắn gọn về khóa học (hiển thị trên thẻ khóa học)"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả chi tiết</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Mô tả chi tiết về nội dung khóa học"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnailUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ảnh bìa (URL)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </form>
                    </Form>
                </ScrollArea>

                <div className="p-6 pt-2 border-t mt-auto flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Tạo khóa học
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ListInput({ control, name, label, placeholder }: { control: Control<any>, name: string, label: string, placeholder: string }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    })

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FormLabel>{label}</FormLabel>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-brand-magenta"
                    onClick={() => append({ value: '' })}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                </Button>
            </div>
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                        <FormField
                            control={control}
                            name={`${name}.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder={placeholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-red-500"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1 && index === 0} // Prevent removing the last empty item if desired, or allow it.
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
