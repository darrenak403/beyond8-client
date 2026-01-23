"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { PaginationState } from "@tanstack/react-table";
import { getColumns } from "./components/Columns";
import { RegistrationTableToolbar } from "./components/RegistrationTableToolbar";
import { RegistrationDialog } from "./components/RegistrationDialog";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { useIsMobile } from "@/hooks/useMobile";
import { useGetAllRegistration, useAproveRegistration, useRejectRegistration } from "@/hooks/useInstructorRegistration";
import { InstructorRegistrationResponse, InstructorRegistrationParamsStatus, VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration";
import { RejectDialog } from "./components/RejectDialog";

import { RegistrationTableSkeleton } from "./components/RegistrationTableSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const InstructorRegistrationPage = () => {
    const isMobile = useIsMobile();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [status, setStatus] = useState<InstructorRegistrationParamsStatus>(InstructorRegistrationParamsStatus.All);
    const [fullName, setFullName] = useState("");
    const [debouncedFullName, setDebouncedFullName] = useState("");

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFullName(fullName);
        }, 500);

        return () => clearTimeout(timer);
    }, [fullName]);

    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching
    } = useGetAllRegistration({
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        status: status,
        fullName: debouncedFullName,
        IsDescending: true
    });

    const registrations = data?.registrations || [];

    const approveMutation = useAproveRegistration();
    const rejectMutation = useRejectRegistration();

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState<InstructorRegistrationResponse | null>(null);

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    // Confirmation Dialog States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"approve" | null>(null);
    const [targetId, setTargetId] = useState<string | null>(null);

    const handleReview = (registration: InstructorRegistrationResponse) => {
        setSelectedRegistration(registration);
        setIsDialogOpen(true);
    };

    const handleApproveClick = (id: string) => {
        setTargetId(id);
        setConfirmAction("approve");
        setIsConfirmOpen(true);
    };

    const handleRejectClick = (id: string) => {
        setTargetId(id);
        setIsRejectDialogOpen(true);
    };

    const handleConfirmApprove = async () => {
        if (!targetId || confirmAction !== "approve") return;

        try {
            await approveMutation.approveAsync(targetId);
            setIsDialogOpen(false);
            refetch();
        } catch (error) {
            // Error handling is done in mutation hooks
        } finally {
            setIsConfirmOpen(false);
            setConfirmAction(null);
            setTargetId(null);
        }
    };

    const handleConfirmReject = async (reason: string, status: VerificationStatus.Hidden | VerificationStatus.RequestUpdate) => {
        if (!targetId) return;

        try {
            await rejectMutation.rejectAsync({
                id: targetId,
                data: {
                    notApproveReason: reason,
                    verificationStatus: status
                }
            });
            setIsDialogOpen(false);
            setIsRejectDialogOpen(false);
            refetch();
        } catch (error) {
            // Error handling is done in mutation hooks
        } finally {
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

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        Không thể tải danh sách đơn đăng ký. Vui lòng thử lại sau.
                        <br />
                        {(error as Error).message}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <RegistrationTableSkeleton />
            ) : (
                <DataTable
                    data={registrations}
                    columns={columns}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    pageCount={data?.totalPages}
                >
                    {(table) => (
                        <RegistrationTableToolbar
                            searchValue={fullName}
                            onSearchChange={setFullName}
                            statusFilter={status}
                            onStatusChange={(value) => setStatus(value as InstructorRegistrationParamsStatus)}
                        />
                    )}
                </DataTable>
            )}

            <RegistrationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                registration={selectedRegistration}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleConfirmApprove}
                title="Duyệt đơn đăng ký?"
                description="Giảng viên sẽ được kích hoạt và có thể tạo khóa học."
                confirmText="Duyệt"
                variant="success"
            />

            <RejectDialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
                onSubmit={handleConfirmReject}
                isSubmitting={rejectMutation.isRejecting}
            />
        </div>
    );
};

export default InstructorRegistrationPage;
