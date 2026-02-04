import React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface UnsaveDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: () => void
    onDiscard: () => void
    onCancel?: () => void
    title?: string
    description?: string
    saveText?: string
    discardText?: string
    cancelText?: string
    isLoading?: boolean
}

export function UnsaveDialog({
    open,
    onOpenChange,
    onSave,
    onDiscard,
    onCancel,
    title = "Chưa lưu thay đổi",
    description = "Bạn có thay đổi chưa được lưu. Bạn muốn lưu lại trước khi rời đi không?",
    saveText = "Lưu",
    discardText = "Không lưu",
    cancelText = "Hủy",
    isLoading = false
}: UnsaveDialogProps) {

    const handleCancel = () => {
        if (onCancel) onCancel()
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0 shadow-lg">
                <div className="p-6 bg-white space-y-4">
                    <AlertDialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-yellow-100 shrink-0">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                {title}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-600 text-base leading-relaxed pl-12">
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t">
                    <AlertDialogCancel
                        onClick={(e) => {
                            e.preventDefault()
                            handleCancel()
                        }}
                        className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-300 mt-0"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </AlertDialogCancel>

                    <Button
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault()
                            onDiscard()
                        }}
                        className="rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-none border-0"
                        disabled={isLoading}
                    >
                        {discardText}
                    </Button>

                    {onSave && (
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                onSave()
                            }}
                            className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
                            disabled={isLoading}
                        >
                            {saveText}
                        </AlertDialogAction>
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
