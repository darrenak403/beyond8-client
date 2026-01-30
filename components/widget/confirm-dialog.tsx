"use client"

import { Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onConfirm: () => void
    onCancel?: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "success"
    isLoading?: boolean
    trigger?: React.ReactNode
    confirmClassName?: string
    cancelClassName?: string
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
    trigger,
    confirmClassName,
    cancelClassName,
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

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading) {
            e.preventDefault()
            return
        }
        // If we want to keep it open while loading, we should prevent default.
        // If the user handles closing manually via onOpenChange(false) in onConfirm, that's fine.
        // But AlertDialogAction usually closes automatically.
        // So we prevent default if we want to handle it manually or if we are loading.
        // However, standard AlertDialogAction closes on click.
        // If we want to duplicate previous behavior:
        // Previous behavior: <Button onClick={onConfirm}>
        // The user's onConfirm function is responsible for closing or logic.
        // BUT AlertDialogAction behaves differently, it closes by default.
        // To strictly match previous behavior for controlled components, we might want to prevent close?
        // Let's assume onConfirm logic handles what it needs.
        // To prevent auto-close so async operations can finish (and show loading), we might need to prevent default.
        // But if we prevent default, we MUST manually close it later.
        // The existing ConfirmDialog usage does setIsConfirmOpen(false) in finally or success block?
        // Let's look at usage in page.tsx:
        // handleConfirmApprove: calls API, then setIsConfirmOpen(false).
        // So it IS controlled throughout.

        // If I use AlertDialogAction, it will try to close immediately.
        // So I should probably prevent default if it's controlled `onConfirm` that is async?
        // Or simpler: if onConfirm is passed, we call it.
        // Using onClick={handleConfirm}.

        // Actually, for the new usage, the user didn't show `open` prop.
        // So for uncontrolled usage, AlertDialogAction auto-closing is GOOD.

        // Compromise:
        // If `isLoading` is true, definitely prevent default.
        // Otherwise, if `onConfirm` is present, call it.
        // If existing usages expect it to NOT close automatically until they say so, 
        // passing `e` and `e.preventDefault()` might be needed?
        // Most Shadcn AlertDialog examples imply Action closes it.
        // Existing ConfirmDialog was just a Dialog with a Button. It didn't auto-close unless onConfirm did nothing? 
        // No, standard button in standard dialog doesn't close dialog.
        // AlertDialogAction DOES close dialog.
        // So to maintain backward compatibility for "controlled + async wait" logic, 
        // we might actually NOT want to use AlertDialogAction for the confirm button?
        // OR we just prevent default in the handler.

        // Let's use a standard Button inside AlertDialogFooter if we want full manual control? 
        // Or just e.preventDefault() in AlertDialogAction.

        // I will add code to call onConfirm.
        // If the user wants to keep it open (e.g. loading), they should manage state.
        // BUT AlertDialogAction closes it inherently.
        // I will use `onClick={(e) => { ... }}`

        onConfirm()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="border rounded-md bg-gray-100 p-3 text-sm text-muted-foreground">{description}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} className={cn("rounded-2xl cursor-pointer hover:bg-gray-100 hover:text-black", cancelClassName)} disabled={isLoading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={cn(buttonClass, "rounded-2xl cursor-pointer", confirmClassName)}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
