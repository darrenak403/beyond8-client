'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginForm } from '@/app/(auth)/components/LoginForm';
import { cn } from '@/lib/utils';

interface LoginDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogPrimitive.Portal forceMount>
                        {/* Overlay */}
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/80"
                            />
                        </DialogPrimitive.Overlay>

                        {/* Content */}
                        <DialogPrimitive.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={cn(
                                    "fixed left-[50%] top-[50%] z-50 grid w-full sm:max-w-[500px] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
                                )}
                            >
                                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-2">
                                    <DialogPrimitive.Title className="text-center text-xl font-bold text-primary">
                                        Chào mừng bạn đến với Beyond8
                                    </DialogPrimitive.Title>
                                </div>

                                <LoginForm />

                                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </DialogPrimitive.Close>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
