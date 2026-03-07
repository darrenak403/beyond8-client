'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ReassignReason } from '@/lib/api/services/fetchReassign'
import { Loader2 } from 'lucide-react'

interface RequestReassignDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (reason: ReassignReason, note: string) => Promise<void>
    isPending: boolean
    title: string
    description?: string
}

export function RequestReassignDialog({
    open,
    onOpenChange,
    onSubmit,
    isPending,
    title,
    description,
}: RequestReassignDialogProps) {
    const [reason, setReason] = useState<ReassignReason>(ReassignReason.Other)
    const [note, setNote] = useState('')

    const handleConfirm = async () => {
        await onSubmit(reason, note)
        onOpenChange(false)
        setNote('')
        setReason(ReassignReason.Other)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Lý do yêu cầu</Label>
                        <Select
                            value={reason}
                            onValueChange={(value) => setReason(value as ReassignReason)}
                        >
                            <SelectTrigger id="reason" className="w-full">
                                <SelectValue placeholder="Chọn lý do" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ReassignReason.TechnicalIssue}>Lỗi kỹ thuật</SelectItem>
                                <SelectItem value={ReassignReason.UnfairGrading}>Chấm điểm chưa thỏa đáng</SelectItem>
                                <SelectItem value={ReassignReason.NeedMorePractice}>Cần luyện tập thêm</SelectItem>
                                <SelectItem value={ReassignReason.Other}>Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Ghi chú (Tùy chọn)</Label>
                        <Textarea
                            id="note"
                            placeholder="Nhập ghi chú của bạn..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="resize-none"
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="bg-brand-magenta hover:bg-brand-magenta/90 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            'Gửi yêu cầu'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
