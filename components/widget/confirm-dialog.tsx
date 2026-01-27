"use client"

import { X, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel?: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "success"
    isLoading?: boolean
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    let buttonClass = ""
    switch (variant) {
        case "destructive":
            buttonClass = "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            break
        case "success":
            buttonClass = "bg-green-600 hover:bg-green-700 text-white"
            break
        default:
            buttonClass = ""
            break
    }

    const handleCancel = () => {
        if (isLoading) return;
        onOpenChange(false)
        onCancel?.()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] sm:w-full rounded-lg duration-300 transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                <button
                    onClick={() => onOpenChange(false)}
                    className={cn(
                        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
                    )}
                    disabled={isLoading}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Đóng</span>
                </button>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="border rounded-md bg-gray-100 p-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} className={buttonClass} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
