"use client"

import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Category } from "@/lib/api/services/fetchCategory"
import { getColumns } from "./columns"
import { useState, useCallback, useMemo } from "react"
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
import { useCategory, useDeleteCategory } from "@/hooks/useCategory"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CategoryTreeTable() {
    const { categories, isLoading } = useCategory();
    const { mutateAsync: deleteCategory } = useDeleteCategory();
    const [expanded, setExpanded] = useState({})

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [parentCategory, setParentCategory] = useState<Category | null>(null);

    // Delete Alert State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const onAdd = useCallback((category: Category) => {
        setParentCategory(category);
        setSelectedCategory(null);
        setDialogMode("add");
        setIsDialogOpen(true);
    }, []);

    const onEdit = useCallback((category: Category) => {
        setParentCategory(null);
        setSelectedCategory(category);
        setDialogMode("edit");
        setIsDialogOpen(true);
    }, []);

    const onDelete = useCallback((id: string) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    }, []);

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await deleteCategory(deleteId);
                setIsDeleteOpen(false);
                setDeleteId(null);
            } catch (error) {
                console.error("Failed to delete category", error);
            }
        }
    };

    const columns = useMemo(() => getColumns({ onAdd, onEdit, onDelete }), [onAdd, onEdit, onDelete]);
    const data = useMemo(() => categories?.data || [], [categories]);

    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subCategories,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    // Handler for Root Category
    const handleAddRoot = () => {
        setParentCategory(null);
        setSelectedCategory(null);
        setDialogMode("add");
        setIsDialogOpen(true);
    }


    if (isLoading) return <div>Đang tải...</div>

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border bg-white shadow-sm"
        >
            <div className="p-4 flex justify-end">
                <Button
                    onClick={handleAddRoot}
                    variant="default"
                    className="rounded-full"
                    size="sm"
                >
                    Thêm danh mục lớn
                </Button>
            </div>
            <Table className="table-fixed">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className={cn(
                                        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                                        row.getIsSelected() && "bg-muted",
                                        row.depth === 0 && "!border-l-4 border-l-primary"
                                    )}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </AnimatePresence>
                </TableBody>
            </Table>

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
        </motion.div>
    )
}
