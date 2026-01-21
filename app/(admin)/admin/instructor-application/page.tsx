"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { PaginationState } from "@tanstack/react-table";
import { getColumns } from "./components/columns";
import { ApplicationTableToolbar } from "./components/ApplicationTableToolbar";
import { ApplicationDialog } from "./components/ApplicationDialog";
import { InstructorApplication } from "./data/schema";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { useIsMobile } from "@/hooks/useMobile";

const InstructorApplicationPage = () => {
    const isMobile = useIsMobile();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const {
        data: applications,
        isLoading,
        refetch,
        isFetching
    } = useInstructorApplications({
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
    });

    const approveMutation = useApproveApplication();
    const rejectMutation = useRejectApplication();

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<InstructorApplication | null>(null);

    // Confirmation Dialog States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
    const [targetId, setTargetId] = useState<string | null>(null);

    const handleReview = (application: InstructorApplication) => {
        setSelectedApplication(application);
        setIsDialogOpen(true);
    };

    const handleApproveClick = (id: string) => {
        setTargetId(id);
        setConfirmAction("approve");
        setIsConfirmOpen(true);
    };

    const handleRejectClick = (id: string) => {
        setTargetId(id);
        setConfirmAction("reject");
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!targetId || !confirmAction) return;

        try {
            if (confirmAction === "approve") {
                await approveMutation.mutateAsync(targetId);
            } else {
                await rejectMutation.mutateAsync(targetId);
            }

            // Close dialogs
            setIsDialogOpen(false);
        } catch (error) {
            // Error handling is done in mutation hooks
        } finally {
            setIsConfirmOpen(false);
            setConfirmAction(null);
            setTargetId(null);
        }
    };

    const columns = useMemo(() => getColumns({
        onReview: handleReview,
        onApprove: handleApproveClick,
        onReject: handleRejectClick,
    }), []);

    return (
        <div className={`h-full flex-1 flex-col space-y-8 ${isMobile ? 'p-4' : 'p-8'} flex`}>
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Duyệt đơn đăng ký giảng viên</h2>
                    <p className="text-muted-foreground">
                        Quản lý và xét duyệt các yêu cầu trở thành giảng viên.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => refetch()}
                        disabled={isLoading || isFetching}
                    >
                        <RotateCw className={`h-4 w-4 ${isLoading || isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            <DataTable
                data={applications || []}
                columns={columns}
                pagination={pagination}
                onPaginationChange={setPagination}
            >
                {(table) => (
                    <ApplicationTableToolbar table={table} />
                )}
            </DataTable>

            <ApplicationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                application={selectedApplication}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleConfirmAction}
                title={confirmAction === "approve" ? "Duyệt đơn đăng ký?" : "Từ chối đơn đăng ký?"}
                description={
                    confirmAction === "approve"
                        ? "Giảng viên sẽ được kích hoạt và có thể tạo khóa học."
                        : "Đơn đăng ký sẽ bị từ chối. Hành động này không thể hoàn tác."
                }
                confirmText={confirmAction === "approve" ? "Duyệt" : "Từ chối"}
                variant={confirmAction === "approve" ? "success" : "destructive"}
            />
        </div>
    );
};

export default InstructorApplicationPage;
