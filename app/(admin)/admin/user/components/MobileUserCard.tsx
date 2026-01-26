import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "@/lib/api/services/fetchUsers"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { Edit, BanIcon, CircleCheckBig, Calendar } from "lucide-react"
import { RoleBadgeItem } from "./RoleBadge"
import { format } from "date-fns"

interface MobileUserCardProps {
    user: User
    onEdit: () => void
    onDelete: () => void
    onChangeStatus: () => void
}

export function MobileUserCard({ user, onEdit, onDelete, onChangeStatus }: MobileUserCardProps) {
    const isActive = user.status === "Active"

    return (
        <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
            {/* Header: Avatar, Name, Email */}
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage
                        src={formatImageUrl(user.avatarUrl)}
                        alt={user.fullName}
                        referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{user.fullName}</h3>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge
                    className={`${isActive
                        ? "bg-green-600 hover:bg-green-700"
                        : user.status === "Inactive" ? "bg-red-600 hover:bg-red-700" : "bg-gray-500"
                        } whitespace-nowrap px-2 py-0.5 text-[10px]`}
                >
                    {isActive ? "Hoạt động" : user.status === "Inactive" ? "Ngừng HĐ" : user.status}
                </Badge>
            </div>

            {/* Roles and Last Login */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium">Vai trò</span>
                    <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                                <RoleBadgeItem key={role} role={role} variant="default" className="text-[10px] px-1.5 py-0 h-5" />
                            ))
                        ) : (
                            <span className="text-muted-foreground italic">Chưa có vai trò</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-muted-foreground font-medium">Đăng nhập</span>
                    <div className="flex items-center gap-1 text-slate-700">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {user.lastLoginAt
                                ? format(new Date(user.lastLoginAt), "dd/MM/yyyy")
                                : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={onEdit}
                >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Chỉnh sửa
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 ${isActive
                        ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }`}
                    onClick={isActive ? onDelete : onChangeStatus}
                >
                    {isActive ? (
                        <>
                            <BanIcon className="h-4 w-4 mr-1.5" />
                            Ngưng HĐ
                        </>
                    ) : (
                        <>
                            <CircleCheckBig className="h-4 w-4 mr-1.5" />
                            Kích hoạt
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
