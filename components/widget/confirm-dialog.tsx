import { Loader2, AlertTriangle, CheckCircle2, HelpCircle, Info } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
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
    description: React.ReactNode
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "success" | "info"
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
    let icon = <HelpCircle className="w-6 h-6 text-purple-600" />
    let titleClass = "text-purple-600"

    switch (variant) {
        case "destructive":
            buttonClass = "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200"
            icon = <AlertTriangle className="w-6 h-6 text-red-600" />
            titleClass = "text-red-700"
            break
        case "success":
            buttonClass = "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
            icon = <CheckCircle2 className="w-6 h-6 text-green-600" />
            titleClass = "text-green-700"
            break
        case "info":
            buttonClass = "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
            icon = <Info className="w-6 h-6 text-blue-600" />
            titleClass = "text-blue-700"
            break
        default:
            buttonClass = "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
            break
    }

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading) {
            e.preventDefault()
            return
        }
        onConfirm()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0 shadow-lg">
                <div className="p-6 bg-white space-y-4">
                    <AlertDialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-full bg-opacity-10 shrink-0",
                                variant === 'destructive' ? "bg-red-100" :
                                    variant === 'success' ? "bg-green-100" :
                                        variant === 'info' ? "bg-blue-100" : "bg-purple-100"
                            )}>
                                {icon}
                            </div>
                            <AlertDialogTitle className={cn("text-xl font-bold", titleClass)}>{title}</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-600 text-base leading-relaxed pl-12">
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t">
                    <AlertDialogCancel
                        onClick={onCancel}
                        className={cn(
                            "rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-300 mt-0",
                            cancelClassName
                        )}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={cn(buttonClass, "rounded-full px-6 transition-all", confirmClassName)}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
