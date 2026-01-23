import { Skeleton } from "@/components/ui/skeleton"

export default function CourseGridItemSkeleton() {
    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-border/40">
            {/* Image Skeleton */}
            <div className="relative w-full aspect-[4/3]">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col flex-1 p-4 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-1/2" /> {/* Price */}
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-1/3" /> {/* Category/Level */}
                        <Skeleton className="h-6 w-full" /> {/* Title Line 1 */}
                        <Skeleton className="h-6 w-2/3" /> {/* Title Line 2 */}
                    </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-3 gap-2 py-0.5">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto pt-2">
                    <Skeleton className="h-9 w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}
