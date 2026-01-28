"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Category, categoryTypeLabels } from "@/lib/api/services/fetchCategory"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronRight, Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

interface CategoryColumnProps {
    onAdd: (category: Category) => void;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export const getColumns = ({ onAdd, onEdit, onDelete }: CategoryColumnProps): ColumnDef<Category>[] => [
    {
        accessorKey: "name",
        header: "Tên danh mục",
        size: 400,
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
                        <span className="w-6" /> // Spacer
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
        accessorKey: "slug",
        header: "Đường dẫn (Slug)",
        size: 200,
        cell: ({ row }) => <div className="text-gray-500 italic truncate" title={row.original.slug}>{row.original.slug}</div>
    },
    {
        id: "actions",
        size: 80,
        cell: ({ row }) => {
            const category = row.original

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onAdd(category)}>
                                <Plus className="mr-2 h-4 w-4" /> Thêm danh mục con
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-red-600 focus:text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

