"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AdminUser } from "@/types/admin-user"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Badge } from "@/components/ui/badge"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Trash, Pencil, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GetColumnsProps {
    onEdit: (user: AdminUser) => void
    onDelete: (user: AdminUser) => void
}

export const getColumns = ({
    onEdit,
    onDelete,
}: GetColumnsProps): ColumnDef<AdminUser>[] => [

        {
            accessorKey: "fullName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Người dùng" />
            ),
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Vai trò" />
            ),
            cell: ({ row }) => {
                const role = row.original.role
                return (
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="capitalize">
                            {role}
                        </Badge>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Trạng thái" />
            ),
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        variant={
                            status === "Active"
                                ? "default"
                                : status === "Inactive"
                                    ? "secondary"
                                    : "destructive"
                        }
                    >
                        {status === "Active" ? "Hoạt động" : status === "Inactive" ? "Ngừng hoạt động" : status}
                    </Badge>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "lastLoginAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Lần đăng nhập cuối" />
            ),
            cell: ({ row }) => {
                const date = row.original.lastLoginAt
                if (!date) return <span className="text-muted-foreground">-</span>
                return <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-muted"
                            onClick={() => onEdit(row.original)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(row.original)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]
