import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstructorRegistrationResponse, VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { Eye, Check, X, Calendar } from "lucide-react"
import { format } from "date-fns"

interface MobileRegistrationCardProps {
    registration: InstructorRegistrationResponse
    onReview: () => void
    onApprove: () => void
    onReject: () => void
}

const getStatusBadgeVariant = (status: VerificationStatus) => {
    switch (status) {
        case VerificationStatus.Verified:
            return "bg-green-600 hover:bg-green-700"
        case VerificationStatus.Pending:
            return "bg-yellow-600 hover:bg-yellow-700"
        case VerificationStatus.RequestUpdate:
            return "bg-orange-600 hover:bg-orange-700"
        case VerificationStatus.Hidden:
            return "bg-gray-600 hover:bg-gray-700"
        case VerificationStatus.Recovering:
            return "bg-blue-600 hover:bg-blue-700"
        default:
            return "bg-gray-500"
    }
}

const getStatusLabel = (status: VerificationStatus) => {
    switch (status) {
        case VerificationStatus.Verified:
            return "Đã duyệt"
        case VerificationStatus.Pending:
            return "Chờ duyệt"
        case VerificationStatus.RequestUpdate:
            return "Yêu cầu cập nhật"
        case VerificationStatus.Hidden:
            return "Đã ẩn"
        case VerificationStatus.Recovering:
            return "Đang khôi phục"
        default:
            return status
    }
}

export function MobileRegistrationCard({
    registration,
    onReview,
    onApprove,
    onReject
}: MobileRegistrationCardProps) {
    const user = registration.user

    return (
        <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
            {/* Header: Avatar, Name, Email, Status */}
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage
                        src={formatImageUrl(user.avatarUrl || "")}
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
                <div className="flex flex-col items-end gap-1">
                    <Badge
                        className={`${getStatusBadgeVariant(registration.verificationStatus)} whitespace-nowrap px-2 py-0.5 text-[10px]`}
                    >
                        {getStatusLabel(registration.verificationStatus)}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(registration.createdAt), "dd/MM/yyyy")}</span>
                    </div>
                </div>
            </div>

            {/* Expertise */}
            <div className="text-xs space-y-1">
                <span className="text-muted-foreground font-medium">Chuyên môn</span>
                <div className="flex flex-wrap gap-1.5">
                    {registration.expertiseAreas.length > 0 ? (
                        registration.expertiseAreas.map((area, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 text-[10px] px-1.5 py-0"
                            >
                                {area}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={onReview}
                >
                    <Eye className="h-4 w-4 mr-1.5" />
                    Xem chi tiết
                </Button>

                {registration.verificationStatus === VerificationStatus.Pending && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={onApprove}
                        >
                            <Check className="h-4 w-4 mr-1.5" />
                            Duyệt
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={onReject}
                        >
                            <X className="h-4 w-4 mr-1.5" />
                            Từ chối
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
