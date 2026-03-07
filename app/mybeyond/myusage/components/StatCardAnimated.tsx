"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import { AIUsageDetailDialog } from "./AIUsageDetailDialog";
import { cn } from "@/lib/utils";

interface StatCardAnimatedProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: LucideIcon;
    colorClass: string;
    chartTitle: string;
    chartDescription: string;
    children: ReactNode; // Chart
    detailsContent: ReactNode; // Info
    isLoading?: boolean;
}

export function StatCardAnimated({
    title,
    value,
    subtext,
    icon: Icon,
    colorClass,
    chartTitle,
    chartDescription,
    children,
    detailsContent,
    isLoading
}: StatCardAnimatedProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        
        const enterAnim = () => {
            gsap.to(card, {
                y: -6,
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                duration: 0.4,
                ease: "power2.out"
            });
        };

        const leaveAnim = () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                duration: 0.4,
                ease: "power2.inOut"
            });
        };

        card.addEventListener("mouseenter", enterAnim);
        card.addEventListener("mouseleave", leaveAnim);

        return () => {
            card.removeEventListener("mouseenter", enterAnim);
            card.removeEventListener("mouseleave", leaveAnim);
        };
    }, []);

    const handleClick = () => {
        if (!cardRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => setIsDialogOpen(true)
        });

        tl.to(cardRef.current, {
            scale: 0.94,
            duration: 0.15,
            ease: "power2.in"
        }).to(cardRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)"
        });
    };

    return (
        <>
            <div 
                ref={cardRef}
                onClick={handleClick}
                className="cursor-pointer transition-shadow h-full"
            >
                <Card className="shadow-sm border border-gray-100 bg-white/70 backdrop-blur-xl overflow-hidden relative group h-full transition-all hover:border-purple-200">
                    <div className="absolute -top-2 -right-2 p-6 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
                        <Icon className={cn("w-20 h-20", colorClass)} />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</CardTitle>
                        <div className="p-1.5 rounded-lg bg-gray-50/50 group-hover:bg-white transition-colors">
                            <Icon className={cn("h-4 w-4", colorClass)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-10 w-28 bg-gray-100 animate-pulse rounded-lg" />
                        ) : (
                            <div className="text-3xl font-black text-gray-900 tracking-tighter">{value}</div>
                        )}
                        <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase flex items-center gap-1.5">
                            <span className={cn("w-1.5 h-1.5 rounded-full", colorClass.replace('text-', 'bg-'))} />
                            {subtext}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <AIUsageDetailDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={chartTitle}
                description={chartDescription}
                leftContent={children}
                rightContent={detailsContent}
            />
        </>
    );
}
