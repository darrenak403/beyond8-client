
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function AIPromptsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full overflow-hidden border border-slate-200">
                    <CardHeader className="p-5 pb-2 space-y-3">
                        <div className="flex justify-between items-start gap-3">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-2 w-2 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-1 flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        <div className="mt-auto pt-2">
                             <Skeleton className="h-24 w-full rounded-lg" />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                    </CardContent>

                    <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between">
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
