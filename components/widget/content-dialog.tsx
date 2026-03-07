"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"


interface ContentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    content: React.ReactNode | string
}

export function ContentDialog({
    open,
    onOpenChange,
    title,
    content,
}: ContentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <div className="px-6 py-4 border-b bg-slate-50/50">
                    <DialogTitle>{title}</DialogTitle>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
                        {content}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
