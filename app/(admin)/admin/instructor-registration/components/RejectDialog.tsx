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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    const [status, setStatus] = useState<VerificationStatus.Hidden | VerificationStatus.RequestUpdate>(
        VerificationStatus.RequestUpdate
    );

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(reason, status);
        setReason("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Xử lý đơn đăng ký</DialogTitle>
                    <DialogDescription>
                        Vui lòng chọn hình thức xử lý và nhập lý do. Hành động này sẽ được thông báo đến giảng viên.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <RadioGroup
                            value={status}
                            onValueChange={(value) =>
                                setStatus(value as VerificationStatus.Hidden | VerificationStatus.RequestUpdate)
                            }
                            className="flex flex-col space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={VerificationStatus.RequestUpdate} id="r1" />
                                <Label htmlFor="r1" className="font-normal cursor-pointer">
                                    Yêu cầu cập nhật lại thông tin
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={VerificationStatus.Hidden} id="r2" />
                                <Label htmlFor="r2" className="font-normal cursor-pointer">
                                    Từ chối đơn đăng ký
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Lý do <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Nhập lý do chi tiết..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        variant={status === VerificationStatus.Hidden ? "destructive" : "default"}
                        onClick={handleSubmit}
                        disabled={!reason.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
