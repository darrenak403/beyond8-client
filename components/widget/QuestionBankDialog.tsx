"use client"

import { useState, useEffect } from "react"
import { Question } from "@/lib/api/services/fetchQuestion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { QuestionBankView } from "@/app/(instructor)/instructor/question-bank/components/QuestionBankView"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface QuestionBankDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect?: (id: string, content: string) => void
    selectionMode?: "single" | "multiple"
    onSelectMultiple?: (ids: string[], contents: string[]) => void
}

export function QuestionBankDialog({ open, onOpenChange, onSelect, selectionMode = "single", onSelectMultiple }: QuestionBankDialogProps) {
    // Local state for navigation within the dialog
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isDescending, setIsDescending] = useState(true)

    const [isChildDialogOpen, setIsChildDialogOpen] = useState(false)

    // Multi-select state
    // Store as Map to keep content handy: id -> content
    const [selectedItems, setSelectedItems] = useState<Map<string, string>>(new Map())

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!open) {
            // Optional: Reset state when closed, or keep it to preserve position
            // For now, let's reset to root folder view when reopened
            const timer = setTimeout(() => {
                setSelectedTag(null)
                setPageNumber(1)
                setIsDescending(true)
                setIsChildDialogOpen(false)
                setSelectedItems(new Map())
            }, 300) // Wait for animation to finish
            return () => clearTimeout(timer)
        }
    }, [open])

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag)
        setPageNumber(1)
    }

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage)
    }

    const handleBackToTags = () => {
        setSelectedTag(null)
        setPageNumber(1)
    }

    const handleToggleSelect = (question: Question) => {
        const { id, content } = question
        setSelectedItems(prev => {
            const newMap = new Map(prev)
            if (newMap.has(id)) {
                newMap.delete(id)
            } else {
                newMap.set(id, content)
            }
            return newMap
        })
    }

    const handleConfirmSelection = () => {
        if (onSelectMultiple) {
            const ids = Array.from(selectedItems.keys())
            const contents = Array.from(selectedItems.values())
            console.log("Selected items:", ids)
            onSelectMultiple(ids, contents)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`max-w-7xl h-[90vh] flex flex-col p-0 gap-0 transition-opacity duration-200 ${isChildDialogOpen ? "!opacity-0 pointer-events-none" : "opacity-100"}`}
                overlayClassName={`transition-opacity duration-200 ${isChildDialogOpen ? "!opacity-0 pointer-events-none" : "opacity-100"}`}
            >
                <DialogHeader className="px-6 py-4 border-b shrink-0 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="flex items-center gap-2">
                            Ngân hàng câu hỏi
                            {selectionMode === "multiple" && selectedItems.size > 0 && (
                                <span className="flex items-center justify-center bg-brand-magenta text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                                    Đã chọn {selectedItems.size}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectionMode === "multiple"
                                ? "Chọn nhiều câu hỏi để thêm vào bài học"
                                : "Quản lý và chọn câu hỏi từ ngân hàng chung"}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-stable">
                    <QuestionBankView
                        selectedTag={selectedTag}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        isDescending={isDescending}
                        onTagClick={handleTagClick}
                        onPageChange={handlePageChange}
                        onBackToTags={handleBackToTags}
                        onSelect={(question: Question) => onSelect?.(question.id, question.content)}
                        onInteractingWithDialog={setIsChildDialogOpen}
                        selectionMode={selectionMode}
                        selectedIds={new Set(selectedItems.keys())}
                        onToggleSelect={handleToggleSelect}
                    />
                </div>

                {selectionMode === "multiple" && (
                    <div className="p-4 border-t bg-gray-50 flex items-center justify-between shrink-0">
                        <div className="text-sm font-medium text-gray-600">
                            Đã chọn <span className="text-brand-magenta font-bold">{selectedItems.size}</span> câu hỏi
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
                                Hủy
                            </Button>
                            <Button
                                onClick={handleConfirmSelection}
                                disabled={selectedItems.size === 0}
                                className="bg-brand-magenta hover:bg-brand-magenta/90 text-white rounded-full"
                            >
                                Xác nhận {selectedItems.size > 0 ? `(${selectedItems.size})` : ""}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
