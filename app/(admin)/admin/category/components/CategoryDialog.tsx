"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAddCategory, useUpdateCategory } from "@/hooks/useCategory"
import { useEffect } from "react"
import { Category, CategoryType, categoryTypeLabels } from "@/lib/api/services/fetchCategory"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Label } from "@/components/ui/label"


interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Category | null
    parentCategory?: Category | null
    mode: 'add' | 'edit'
}

export function CategoryDialog({ open, onOpenChange, initialData, parentCategory, mode }: CategoryDialogProps) {
    const { mutateAsync: addCategory, isPending: isAdding } = useAddCategory()
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            type: CategoryType.Other,
            isRoot: false,
            parentId: null as string | null
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên là bắt buộc"),
            description: Yup.string(),
            type: Yup.string().oneOf(Object.values(CategoryType), "Vui lòng chọn loại hợp lệ").required("Loại là bắt buộc"),
        }),
        onSubmit: async (values) => {
            try {
                if (mode === 'add') {
                    await addCategory({
                        ...values,
                        description: values.description || "",
                        isRoot: !parentCategory,
                        parentId: parentCategory?.id || null
                    })
                } else if (mode === 'edit' && initialData) {
                    await updateCategory({
                        id: initialData.id,
                        category: {
                            name: values.name,
                            description: values.description || ""
                        }
                    })
                }
                onOpenChange(false)
            } catch (error) {
                console.error(error)
            }
        },
    })

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                formik.resetForm({
                    values: {
                        name: initialData.name,
                        description: initialData.description || "",
                        type: initialData.type,
                        isRoot: initialData.isRoot,
                        parentId: null
                    }
                })
            } else if (mode === 'add') {
                formik.resetForm({
                    values: {
                        name: "",
                        description: "",
                        type: parentCategory ? parentCategory.type : CategoryType.Other,
                        isRoot: !parentCategory,
                        parentId: parentCategory?.id || null
                    }
                })
            }
        }
    }, [open, mode, initialData, parentCategory]) // removed formik dependency to avoid loops

    const isLoading = isAdding || isUpdating

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Thêm danh mục' : 'Cập nhật danh mục'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'add' ? 'Tạo mới một danh mục vào hệ thống.' : 'Cập nhật thông tin chi tiết danh mục.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Nhập tên danh mục..."
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-sm font-medium text-destructive">{formik.errors.name}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Loại</Label>
                        <Select
                            value={formik.values.type}
                            onValueChange={(value) => formik.setFieldValue("type", value)}
                            disabled={mode === 'edit' || !!parentCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(CategoryType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {categoryTypeLabels[type]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formik.touched.type && formik.errors.type && (
                            <div className="text-sm font-medium text-destructive">{formik.errors.type}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Nhập mô tả..."
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-sm font-medium text-destructive">{formik.errors.description}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
