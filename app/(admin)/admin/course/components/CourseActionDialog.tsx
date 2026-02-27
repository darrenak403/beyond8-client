import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CourseActionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    confirmLabel?: string
    onConfirm: (note: string | null) => Promise<void>
    isLoading: boolean
    variant?: "default" | "destructive"
    placeholder?: string
}

export function CourseActionDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Xác nhận",
    onConfirm,
    isLoading,
    variant = "default",
    placeholder = "Nhập ghi chú..."
}: CourseActionDialogProps) {
    const [note, setNote] = useState("")

    const handleConfirm = async () => {
        await onConfirm(note.trim() ? note : null)
        setNote("") // Reset after confirm
        onOpenChange(false)
    }

    const isDestructive = variant === "destructive"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <DialogHeader className="flex flex-col items-center gap-2 pt-4">
                    <div className={cn(
                        "p-3 rounded-full mb-2 transition-colors",
                        isDestructive ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                        {isDestructive ? (
                            <AlertTriangle className="w-6 h-6" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6" />
                        )}
                    </div>
                    <DialogTitle className="text-xl text-center">{title}</DialogTitle>
                    {description && (
                        <p className="text-center text-sm text-muted-foreground px-4">
                            {description}
                        </p>
                    )}
                </DialogHeader>

                <div className="grid gap-4 py-4 px-2">
                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-sm font-medium ml-1">
                            {isDestructive ? "Lý do từ chối" : "Ghi chú thêm"} <span className="text-muted-foreground font-normal">(Tùy chọn)</span>
                        </Label>
                        <Textarea
                            id="note"
                            placeholder={placeholder}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[120px] resize-none focus-visible:ring-offset-0"
                        />
                        <p className="text-xs text-muted-foreground text-right">{note.length}/500 ký tự</p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="mt-2 sm:mt-0"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn(
                            "w-full sm:w-auto min-w-[100px]",
                            !isDestructive && "bg-emerald-600 hover:bg-emerald-700"
                        )}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
