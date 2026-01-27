"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { RoleBadges } from "./RoleBadge"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, BanIcon, CircleCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from "@/lib/api/services/fetchUsers"

interface GetColumnsProps {
    onEdit: (user: User) => void
    onChangeStatus: (user: User) => void
    onDelete: (user: User) => void
}

export const getColumns = ({
    onEdit,
    onChangeStatus,
    onDelete,
}: GetColumnsProps): ColumnDef<User>[] => [

        {
            accessorKey: "fullName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Người dùng" />
            ),
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={formatImageUrl(user.avatarUrl)}
                                alt={user.fullName}
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
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
                const roles = row.original.roles || []
                const roleLabels = roles.map(role =>
                    role === "ROLE_STUDENT" ? "Học viên" :
                        role === "ROLE_INSTRUCTOR" ? "Giảng viên" :
                            role === "ROLE_STAFF" ? "Nhân viên" :
                                "Admin"
                )

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <RoleBadges roles={roles} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex flex-col gap-1">
                                    <p className="font-medium text-xs">Vai trò:</p>
                                    <ul className="text-xs space-y-0.5">
                                        {roleLabels.map((label, index) => (
                                            <li key={index}>• {label}</li>
                                        ))}
                                    </ul>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "phoneNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="SĐT" />
            ),
            cell: ({ row }) => {
                const phone = row.original.phoneNumber
                return <span>{phone || "-"}</span>
            },
        },
        {
            accessorKey: "dateOfBirth",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Ngày sinh" />
            ),
            cell: ({ row }) => {
                const dob = row.original.dateOfBirth
                if (!dob) return <span className="text-muted-foreground">-</span>
                return <span>{new Date(dob).toLocaleDateString("vi-VN")}</span>
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
                        className={
                            status === "Active"
                                ? "bg-green-600 hover:bg-green-700 whitespace-nowrap"
                                : status === "Inactive"
                                    ? "bg-red-600 hover:bg-red-700 whitespace-nowrap"
                                    : "bg-gray-500 whitespace-nowrap"
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
                const isActive = row.original.status === "Active" ? true : false;
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-600/10 hover:text-blue-600"
                            onClick={() => onEdit(row.original)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={isActive ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : "text-green-600 hover:bg-green-100 hover:text-green-700"}
                            onClick={() => isActive ? onDelete(row.original) : onChangeStatus(row.original)}
                            title={isActive ? "Xóa tài khoản" : "Kích hoạt tài khoản"}
                        >
                            {isActive ? (
                                <BanIcon className="h-4 w-4" />
                            ) : (
                                <CircleCheckBig className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                )
            },
        },
    ]
