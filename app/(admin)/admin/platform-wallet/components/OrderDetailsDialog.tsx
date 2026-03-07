"use client";

import { useGetOrderDetails } from "@/hooks/useOrder";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { OrderItem } from "@/lib/api/services/fetchOrder";
import SafeImage from "@/components/ui/SafeImage";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

interface OrderDetailsDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
    orderId,
    open,
    onOpenChange,
}: OrderDetailsDialogProps) {
    const { order, isLoading } = useGetOrderDetails(orderId as string, {
        enabled: !!orderId && open,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Chi tiết đơn hàng {order?.orderNumber && `- # ${order.orderNumber}`}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : !order ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Không tìm thấy thông tin phân tích giao dịch!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Tiêu đề & Thông tin chung */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-4">
                            <div>
                                <p className="text-muted-foreground mb-1">Mã đơn hàng</p>
                                <p className="font-medium">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Ngày tạo</p>
                                <p className="font-medium">
                                    {order.createdAt
                                        ? format(
                                            new Date(
                                                order.createdAt.endsWith("Z")
                                                    ? order.createdAt
                                                    : `${order.createdAt}Z`
                                            ),
                                            "dd/MM/yyyy HH:mm",
                                            { locale: vi }
                                        )
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Trạng thái</p>
                                <Badge
                                    variant="outline"
                                    className={
                                        order.status === "Paid" || order.status === "Completed"
                                            ? "bg-green-50 text-green-600 border-green-200"
                                            : order.status === "Pending"
                                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                                : "bg-red-50 text-red-600 border-red-200"
                                    }
                                >
                                    {order.status === "Paid" || order.status === "Completed"
                                        ? "Đã thanh toán"
                                        : order.status === "Pending"
                                            ? "Chờ thanh toán"
                                            : order.status === "Cancelled"
                                                ? "Đã hủy"
                                                : "Thất bại"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Ngày thanh toán</p>
                                <p className="font-medium">
                                    {order.paidAt
                                        ? format(
                                            new Date(
                                                order.paidAt.endsWith("Z")
                                                    ? order.paidAt
                                                    : `${order.paidAt}Z`
                                            ),
                                            "dd/MM/yyyy HH:mm",
                                            { locale: vi }
                                        )
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Thông tin tài chính */}
                        <div>
                            <h3 className="font-semibold mb-3">Chi tiết doanh thu</h3>
                            <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tạm tính</span>
                                    <span>{order.subTotal?.toLocaleString() || 0} VNĐ</span>
                                </div>
                                {order.instructorDiscountAmount > 0 && (
                                    <div className="flex justify-between text-orange-600">
                                        <span>Khuyến mãi giảng viên</span>
                                        <span>
                                            -{order.instructorDiscountAmount.toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                )}
                                {order.systemDiscountAmount > 0 && (
                                    <div className="flex justify-between text-blue-600">
                                        <span>Khuyến mãi hệ thống</span>
                                        <span>
                                            -{order.systemDiscountAmount.toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                                    <span>Tổng tiền thanh toán</span>
                                    <span className="text-base text-primary">
                                        {order.totalAmount?.toLocaleString() || 0} VNĐ
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Phân chia cấu trúc */}
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3 text-primary">
                                Phân bổ doanh thu nền tảng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Doanh thu giảng viên nhận được
                                    </span>
                                    <span className="font-semibold">
                                        +{order.instructorEarnings?.toLocaleString() || 0} VNĐ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Chiết khấu nền tảng (Platform Fee)
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        +{order.platformFeeAmount?.toLocaleString() || 0} VNĐ
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Sản phẩm */}
                        <div>
                            <h3 className="font-semibold mb-3">
                                Thông tin sản phẩm ({order.orderItems?.length || 0})
                            </h3>
                            <div className="space-y-3">
                                {order.orderItems?.map((item: OrderItem) => (
                                    <div
                                        key={item.id || item.courseId}
                                        className="flex flex-col sm:flex-row gap-4 border rounded-lg p-3"
                                    >
                                        <div className="w-full sm:w-28 h-16 bg-muted rounded-md shrink-0 overflow-hidden">                       
                                                <SafeImage
                                                    src={formatImageUrl(item.courseThumbnail || '') || '/bg-web.jpg'}
                                                    alt={item.courseTitle}
                                                   width={100}
                                                   height={100}
                                                    className="w-full h-full object-cover"
                                                />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium text-sm line-clamp-2">
                                                {item.courseTitle}
                                            </p>
                                            
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-semibold text-sm">
                                                    {(item.unitPrice ?? item.finalPrice ?? 0).toLocaleString()} VNĐ
                                                </span>
                                                {item.originalPrice >
                                                    (item.unitPrice ?? item.finalPrice ?? 0) && (
                                                        <span className="text-xs text-muted-foreground line-through">
                                                            {item.originalPrice.toLocaleString()} VNĐ
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
