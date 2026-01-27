"use client"

import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogPortal,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RequireReLoginDialogProps {
    open: boolean
    onLogout: () => void
    title: string
    description: string
}

export function RequireReLoginDialog({
    open,
    onLogout,
    title,
    description,
}: RequireReLoginDialogProps) {
    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-[95%] sm:w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg duration-300 transition-all",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    )}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">{title} <span className="text-red-500">(*)</span></DialogTitle>
                        <DialogDescription className="border rounded-md bg-gray-100 p-3">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto rounded-xl">
                            Đăng xuất
                        </Button>
                    </DialogFooter>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    )
}
