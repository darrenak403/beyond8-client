"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Category, categoryTypeLabels } from "@/lib/api/services/fetchCategory"
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    ColumnDef
} from "@tanstack/react-table"
import { ChevronRight, Edit, Plus, Trash } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface SubCategoryViewProps {
    parentCategory: Category
    subCategories: Category[]
    onAddSubCategory: (parent: Category) => void
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
}

export function SubCategoryView({
    parentCategory,
    subCategories,
    onAddSubCategory,
    onEdit,
    onDelete
}: SubCategoryViewProps) {
    const [expanded, setExpanded] = useState({})

    const columns = useMemo<ColumnDef<Category>[]>(() => [
        {
            accessorKey: "name",
            header: "Tên danh mục",
            cell: ({ row }) => {
                return (
                    <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${row.depth * 20}px` }}
                    >
                        {row.getCanExpand() ? (
                            <button
                                onClick={row.getToggleExpandedHandler()}
                                className="p-1 cursor-pointer hover:bg-slate-100 rounded"
                            >
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform ${row.getIsExpanded() ? "rotate-90" : ""}`}
                                />
                            </button>
                        ) : (
                            <span className="w-6" />
                        )}
                        <span className="font-medium truncate flex-1 min-w-0">{row.original.name}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "type",
            header: "Loại",
            size: 150,
            cell: ({ row }) => <div className="truncate">{categoryTypeLabels[row.original.type]}</div>
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            size: 350,
            cell: ({ row }) => <div className="truncate" title={row.original.description}>{row.original.description}</div>
        },
        {
            id: "actions",
            size: 80,
            cell: ({ row }) => {
                const category = row.original
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-600/10 hover:text-blue-600"
                            onClick={() => onEdit(category)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(category.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ], [onEdit, onDelete])

    const table = useReactTable({
        data: subCategories,
        columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subCategories,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
                <div>
                    <h2 className="font-semibold text-lg">Danh mục con</h2>
                </div>
                <Button onClick={() => onAddSubCategory(parentCategory)} className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Thêm danh mục con
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
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
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={cn(
                                            'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                                            row.getIsSelected() && "bg-muted"
                                        )}
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
                                        Chưa có danh mục con nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
