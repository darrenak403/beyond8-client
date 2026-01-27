"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface AIPaginationProps {
    pageIndex: number
    pageSize: number
    totalPages: number
    onPageChange: (pageIndex: number) => void
}

export function AIPagination({
    pageIndex, 
    totalPages,
    onPageChange,
}: AIPaginationProps) {
    // We assume pageIndex is 1-based here as it comes from searchParams directly in AIPromptsPage
    const currentPage = pageIndex; 

    return (
        <div className="flex items-center justify-end px-2 py-4">
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                >
                    <span className="sr-only">Đến trang đầu</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <span className="sr-only">Đến trang trước</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                   {/* Simple render current page for now, full pagination logic like UserTable is complex to replicate cleanly without totalPages data from API which we might not be using fully in useAI yet. Assuming we just have next/prev from older hook context? 
                   Actually the AIPrompt endpoint returns generic PagedResult usually. 
                   If promptsRes has TotalPages, we can render buttons. 
                   Let's assume we pass pageCount. */}
                   <Button
                        variant="default"
                        className="h-8 w-8 p-0"
                    >
                        {currentPage}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <span className="sr-only">Đến trang sau</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                 {/* Last page button if we knew total pages, which we do via pageCount */}
                 <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                >
                    <span className="sr-only">Đến trang cuối</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
