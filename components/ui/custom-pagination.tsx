import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPreviousPage,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    // Logic: show current page, 1 before, 1 after, first, last, and ellipsis if needed
    // Simplified logic: show max 5 pages around current
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(1)}
                disabled={!hasPreviousPage}
            >
                <span className="sr-only">Đến trang đầu</span>
                <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
            >
                <span className="sr-only">Đến trang trước</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
            >
                <span className="sr-only">Đến trang sau</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(totalPages)}
                disabled={!hasNextPage}
            >
                <span className="sr-only">Đến trang cuối</span>
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
