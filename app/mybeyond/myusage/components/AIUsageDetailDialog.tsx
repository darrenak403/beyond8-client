"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AIUsageDetailDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    leftContent: ReactNode;
    rightContent: ReactNode;
}

export function AIUsageDetailDialog({
    isOpen,
    onOpenChange,
    title,
    description,
    leftContent,
    rightContent,
}: AIUsageDetailDialogProps) {
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Use requestAnimationFrame to ensure the dialog content is mounted and refs are assigned
            const rafId = requestAnimationFrame(() => {
                if (!leftPanelRef.current || !rightPanelRef.current) return;

                const tl = gsap.timeline();
                
                tl.fromTo([leftPanelRef.current, rightPanelRef.current], 
                    { opacity: 0, scale: 0.95 },
                    { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", stagger: 0.1 }
                );

                if (leftPanelRef.current) {
                    tl.from(leftPanelRef.current, { x: -20, duration: 0.5, ease: "power2.out" }, "-=0.4");
                }
                if (rightPanelRef.current) {
                    tl.from(rightPanelRef.current, { x: 20, duration: 0.5, ease: "power2.out" }, "-=0.5");
                }
            });

            return () => cancelAnimationFrame(rafId);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl border-none shadow-2xl bg-white/95 backdrop-blur-md p-0 overflow-hidden rounded-3xl">
                <div className="flex flex-col md:flex-row h-full min-h-[400px]">
                    {/* Left Panel: Visuals */}
                    <div 
                        ref={leftPanelRef}
                        className="flex-1 p-8 bg-gray-50/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100"
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            {leftContent}
                        </div>
                    </div>

                    {/* Right Panel: Info */}
                    <div 
                        ref={rightPanelRef}
                        className="flex-1 p-10 flex flex-col justify-center"
                    >
                        <DialogHeader className="mb-6 space-y-2">
                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight uppercase border-b-2 border-purple-100 pb-2 inline-block">
                                {title}
                            </DialogTitle>
                            {description && (
                                <DialogDescription className="text-base text-gray-500 font-medium">
                                    {description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="space-y-6">
                            {rightContent}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
