import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface CoursePaginationProps {
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
}

export default function CoursePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange
}: CoursePaginationProps) {

    const startRow = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const endRow = Math.min(currentPage * pageSize, totalItems)

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Hiển thị {startRow}-{endRow} trên {totalItems} kết quả
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Đến trang đầu</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Đến trang trước</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    // Show limited pages logic if needed, but for now simple list like user mgmt
                    if (totalPages > 7) {
                        // Add simple logic to show start, end, and current neighborhood
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <Button
                                    key={i}
                                    variant={currentPage === page ? "default" : "outline"}
                                    className="h-8 w-8 p-0"
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </Button>
                            )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={i} className="px-2 text-slate-400">...</span>
                        }
                        return null
                    }
                    return (
                        <Button
                            key={i}
                            variant={currentPage === page ? "default" : "outline"}
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    )
                })}

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Đến trang sau</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Đến trang cuối</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
