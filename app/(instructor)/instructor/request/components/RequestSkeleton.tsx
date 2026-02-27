'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RequestSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg bg-gray-200" />
                    <Skeleton className="h-10 w-64 bg-gray-200" />
                </div>
                <Skeleton className="h-4 w-96 bg-gray-200" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-4 w-[250px]">Học viên</TableHead>
                            <TableHead className="py-4 w-[200px]">Nội dung</TableHead>
                            <TableHead className="py-4">Lý do & Ghi chú</TableHead>
                            <TableHead className="py-4 w-[150px]">Ngày yêu cầu</TableHead>
                            <TableHead className="py-4 w-[150px]">Trạng thái</TableHead>
                            <TableHead className="py-4 text-right w-[120px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32 bg-gray-200" />
                                            <Skeleton className="h-3 w-24 bg-gray-200" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
                                        <Skeleton className="h-4 w-40 bg-gray-200" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48 bg-gray-200" />
                                        <Skeleton className="h-3 w-32 bg-gray-200" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-28 bg-gray-200" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <Skeleton className="h-8 w-20 rounded-xl ml-auto bg-gray-200" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
