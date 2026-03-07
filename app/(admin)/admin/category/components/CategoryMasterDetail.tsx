"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useCategory, useDeleteCategory } from "@/hooks/useCategory"
import { Category } from "@/lib/api/services/fetchCategory"
import { SubCategoryView } from "./SubCategoryView"
import { CategoryDialog } from "./CategoryDialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function CategoryMasterDetail() {
    const { categories, isLoading } = useCategory()
    const { mutateAsync: deleteCategory } = useDeleteCategory()

    const [selectedRootId, setSelectedRootId] = useState<string | null>(null)

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [parentCategory, setParentCategory] = useState<Category | null>(null)

    // Delete Alert State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const data = useMemo(() => categories?.data || [], [categories])

    // Automatically select the first root category if none is selected
    useEffect(() => {
        if (!selectedRootId && data.length > 0) {
            const firstRoot = data.find(c => c.isRoot)
            if (firstRoot) {
                setTimeout(() => setSelectedRootId(firstRoot.id), 0)
            }
        }
    }, [data, selectedRootId])

    const selectedRoot = data.find(c => c.id === selectedRootId) || null

    const handleSelectRoot = (category: Category) => {
        setSelectedRootId(category.id)
    }

    const onAddSubCategory = useCallback((parent: Category) => {
        setParentCategory(parent)
        setSelectedCategory(null)
        setDialogMode("add")
        setIsDialogOpen(true)
    }, [])

    const onEdit = useCallback((category: Category) => {
        setParentCategory(null)
        setSelectedCategory(category)
        setDialogMode("edit")
        setIsDialogOpen(true)
    }, [])

    const onDelete = useCallback((id: string) => {
        setDeleteId(id)
        setIsDeleteOpen(true)
    }, [])

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await deleteCategory(deleteId)
                setIsDeleteOpen(false)
                setDeleteId(null)
            } catch (error) {
                console.error("Failed to delete category", error)
            }
        }
    }

    if (isLoading) return <div>Đang tải...</div>

    // Filter root categories for tabs
    const rootCategories = data

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(100vh-120px)]">
            {/* Tab Navigation */}
            <div className="border-b px-6">
                <div className="flex overflow-x-auto gap-1">
                    {rootCategories.map((category) => {
                        const isActive = selectedRootId === category.id;
                        return (
                            <div key={category.id} className="relative">
                                <button
                                    onClick={() => handleSelectRoot(category)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap text-base",
                                        isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
                                    )}
                                >
                                    <span>{category.name}</span>
                                </button>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCategoryTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {selectedRoot ? (
                    <SubCategoryView
                        parentCategory={selectedRoot}
                        subCategories={selectedRoot.subCategories || []}
                        onAddSubCategory={onAddSubCategory}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground h-full">
                        Chọn một danh mục để xem chi tiết
                    </div>
                )}
            </div>

            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                initialData={selectedCategory}
                parentCategory={parentCategory}
            />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Danh mục này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
