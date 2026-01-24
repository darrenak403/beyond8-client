"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { InstructorRegistrationResponse, VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

interface GetColumnsProps {
    onReview: (registration: InstructorRegistrationResponse) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const getColumns = ({
    onReview,
    onApprove,
    onReject,
}: GetColumnsProps): ColumnDef<InstructorRegistrationResponse>[] => [
        {
            accessorKey: "user.fullName",
            id: "user_fullName", // Custom ID for filtering
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Giảng viên" />
            ),
            cell: ({ row }) => {
                const user = row.original.user;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={formatImageUrl(user.avatarUrl) || ""} alt={user.fullName} />
                            <AvatarFallback>
                                {user.fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "expertiseAreas",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Chuyên môn" />
            ),
            cell: ({ row }) => {
                const areas = row.original.expertiseAreas || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-50">
                        {areas.slice(0, 2).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {area}
                            </Badge>
                        ))}
                        {areas.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{areas.length - 2}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Ngày đăng ký" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="text-sm">
                        {format(new Date(row.original.createdAt), "dd/MM/yyyy")}
                    </span>
                );
            },
        },
        {
            accessorKey: "verificationStatus",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Trạng thái" />
            ),
            cell: ({ row }) => {
                const status = row.original.verificationStatus;
                return (
                    <Badge
                        className={
                            status === "Verified"
                                ? "bg-green-600 hover:bg-green-700 whitespace-nowrap"
                                : status === "Hidden"
                                    ? "bg-red-600 hover:bg-red-700 whitespace-nowrap"
                                    : status === "Pending"
                                        ? "bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
                                        : status === "Recovering"
                                            ? "bg-blue-500 hover:bg-blue-600 whitespace-nowrap"
                                            : "bg-yellow-500 hover:bg-yellow-600 whitespace-nowrap"
                        }
                    >
                        {status === "Verified"
                            ? "Đã duyệt"
                            : status === "Hidden"
                                ? "Đã từ chối"
                                : status === "Pending"
                                    ? "Chờ duyệt"
                                    : status === "Recovering"
                                        ? "Yêu cầu khôi phục"
                                        : "Yêu cầu cập nhật"}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const registration = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReview(registration)}
                            title="Xem chi tiết"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {(registration.verificationStatus === VerificationStatus.Pending
                            || registration.verificationStatus === VerificationStatus.Recovering) && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-200"
                                        onClick={() => onApprove(registration.id)}
                                        title="Chấp nhận"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-200"
                                        onClick={() => onReject(registration.id)}
                                        title="Từ chối"
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                    </div>
                );
            },
        },
    ];
