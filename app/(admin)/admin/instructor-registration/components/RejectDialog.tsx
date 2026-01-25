import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration";

interface RejectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (reason: string, status: VerificationStatus.Hidden | VerificationStatus.RequestUpdate) => void;
    isSubmitting?: boolean;
}

export function RejectDialog({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting = false,
}: RejectDialogProps) {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(reason, VerificationStatus.RequestUpdate);
        setReason("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] sm:w-full sm:max-w-[500px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Yêu cầu cập nhật thông tin</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập lý do/yêu cầu chỉnh sửa để gửi thông báo đến giảng viên.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Nội dung yêu cầu <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Nhập chi tiết yêu cầu chỉnh sửa..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-start gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white "
                        onClick={handleSubmit}
                        disabled={!reason.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
