import { Skeleton } from "@/components/ui/skeleton"
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AssignmentSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto py-8 px-4">
                {/* Back Button Skeleton */}
                <Skeleton className="w-40 h-10 mb-6 rounded-2xl bg-gray-200" />

                <div className="grid grid-cols-1 gap-8">
                    {/* Assignment Overview Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
                        {/* Title & Date */}
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-3/4 bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 bg-gray-200" />
                                <Skeleton className="h-4 w-48 bg-gray-200" />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <Skeleton className="w-10 h-10 rounded-lg bg-gray-200" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-16 bg-gray-200" />
                                        <Skeleton className="h-6 w-24 bg-gray-200" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description/Info Section */}
                        <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <Skeleton className="h-6 w-32 bg-gray-200" />
                                <Skeleton className="h-8 w-40 rounded-lg bg-gray-200" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-4 w-2/3 bg-gray-200" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                            </div>

                            <div className="pt-4 border-t border-gray-200/50">
                                <Skeleton className="h-5 w-32 mb-3 bg-gray-200" />
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
                                    <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Submission Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48 bg-gray-200" />
                            <Skeleton className="h-4 w-64 bg-gray-200" />
                        </div>

                        <div className="space-y-2">
                            <div className="space-y-2 mb-4">
                                <Skeleton className="h-5 w-32 bg-gray-200" />
                                <Skeleton className="h-[200px] w-full rounded-xl bg-gray-200" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Skeleton className="h-11 w-[140px] rounded-xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
