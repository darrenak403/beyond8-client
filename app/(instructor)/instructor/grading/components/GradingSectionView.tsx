"use client"

import { Section } from "@/lib/api/services/fetchSection"
import { useGetSubmissionSumaryBySection } from "@/hooks/useAssignment"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, FileText, CheckCircle, ChevronRight, Clock } from "lucide-react"
interface GradingSectionViewProps {
    section: Section
    ungradedCount: number
    totalSubmissions: number
    onSelectAssignment: (assignmentId: string) => void
}

export function GradingSectionView({ section, ungradedCount, totalSubmissions, onSelectAssignment }: GradingSectionViewProps) {
    return (
        <AccordionItem value={section.id} className="group my-4 py-2 rounded-2xl border border-brand-magenta/10 bg-white/80 px-2 shadow-sm backdrop-blur-xl transition-all hover:border-brand-magenta/30 hover:shadow-md hover:shadow-brand-magenta/5 data-[state=open]:border-brand-magenta/30 data-[state=open]:shadow-brand-magenta/5">
            <AccordionTrigger className="hover:no-underline py-4 px-2 rounded-xl hover:bg-black/5 transition-colors [&[data-state=open]>div>div>span]:text-brand-magenta">
                <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-lg transition-colors">{section.title}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                            <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {totalSubmissions} bài nộp
                            </span>
                            <span>•</span>
                            <span className={ungradedCount > 0 ? "text-brand-magenta font-medium" : ""}>
                                {ungradedCount} cần chấm
                            </span>
                        </div>
                    </div>
                    {ungradedCount > 0 && (
                        <Badge className="ml-2 bg-brand-magenta hover:bg-brand-magenta/90 border-none">
                            {ungradedCount}
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 px-2 pb-4">
                <SectionAssignmentsList sectionId={section.id} onSelectAssignment={onSelectAssignment} />
            </AccordionContent>
        </AccordionItem>
    )
}

function SectionAssignmentsList({ sectionId, onSelectAssignment }: { sectionId: string, onSelectAssignment: (assignmentId: string) => void }) {
    const { submissions: data, isLoading, error } = useGetSubmissionSumaryBySection(sectionId)

    if (isLoading) {
        return <div className="space-y-3 py-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
        </div>
    }

    if (error) {
        return <div className="text-red-500 py-4 flex items-center justify-center gap-2 bg-red-50 rounded-xl"><AlertCircle className="w-4 h-4" /> Không thể tải bài tập</div>
    }

    const assignments = data || []

    if (assignments.length === 0) {
        return <div className="text-muted-foreground py-8 text-center text-sm flex flex-col items-center gap-2">
            <div className="p-3 bg-muted/50 rounded-full"><FileText className="w-6 h-6 text-muted-foreground/50" /></div>
            Không có bài tập trong chương này
        </div>
    }

    return (
        <div className="space-y-3">
            {assignments.map((asm) => (
                <div
                    key={asm.assignmentId}
                    onClick={() => onSelectAssignment(asm.assignmentId)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white/50 hover:bg-white hover:border-brand-magenta/30 hover:shadow-md hover:shadow-brand-magenta/5 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-magenta/5 rounded-xl text-brand-magenta group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-foreground group-hover:text-brand-magenta transition-colors">{asm.assignmentTitle || "Bài tập không tên"}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {asm.totalSubmissions || 0} bài nộp</span>
                                {asm.ungradedSubmissions > 0 ? (
                                    <span className="text-brand-magenta font-medium flex items-center gap-1 bg-brand-magenta/5 px-2 py-0.5 rounded-full text-xs border border-brand-magenta/10">
                                        <Clock className="w-3 h-3" /> Cần chấm: {asm.ungradedSubmissions}
                                    </span>
                                ) : (
                                    <span className="text-green-600 flex items-center gap-1 text-xs">
                                        <CheckCircle className="w-3 h-3" /> Đã chấm hết
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground group-hover:text-brand-magenta group-hover:bg-brand-magenta/5">
                        <span className="hidden sm:inline mr-2">Chi tiết</span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
