"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
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
import { InstructorRegistrationResponse, VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration";
import { RejectDialog } from "./components/RejectDialog";

import { RegistrationTableSkeleton } from "./components/RegistrationTableSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const InstructorRegistrationPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isMobile = useIsMobile();

    // URL Params State
    const pageNumber = Number(searchParams.get("pageNumber")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 8;
    const isDescendingParam = searchParams.get("isDescending");
    const isDescending = isDescendingParam === "false" ? false : true;
    const verificationStatus = searchParams.get("verificationStatus") || "";
    const fullNameParam = searchParams.get("fullName") || "";

    const [fullName, setFullName] = useState(fullNameParam);

    // Sync local search state with URL (handling external URL changes)
    useEffect(() => {
        setFullName(fullNameParam);
    }, [fullNameParam]);

    const debouncedFullName = useDebounce(fullName, 500);

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedFullName !== fullNameParam) {
            const params = new URLSearchParams(searchParams.toString());
            if (debouncedFullName) {
                params.set("fullName", debouncedFullName);
            } else {
                params.delete("fullName");
            }
            params.set("pageNumber", "1");
            if (searchParams.get("isDescending")) {
                params.set("isDescending", searchParams.get("isDescending")!);
            }
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [debouncedFullName, pathname, router, searchParams, fullNameParam]);

    const createQueryString = useCallback(
        (name: string, value: string | number | boolean) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, String(value));
            return params.toString();
        },
        [searchParams]
    );

    const pagination: PaginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageSize,
    };

    const setPagination = (updater: any) => {
        const newPagination = typeof updater === "function" ? updater(pagination) : updater;
        router.push(`${pathname}?${createQueryString("pageNumber", newPagination.pageIndex + 1)}&${createQueryString("pageSize", newPagination.pageSize)}&${createQueryString("isDescending", isDescending)}`);
    };

    const handleStatusChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set("verificationStatus", value);
        } else {
            params.delete("verificationStatus");
        }
        params.set("pageNumber", "1");
        if (searchParams.get("isDescending")) {
            params.set("isDescending", searchParams.get("isDescending")!);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearchChange = (value: string) => {
        setFullName(value);
    };

    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching
    } = useGetAllRegistration({
        pageNumber: pageNumber,
        pageSize: pageSize,
        verificationStatus: verificationStatus === "all" ? "" : verificationStatus, // Handle "all" case explicitly if needed, usually empty string is all
        fullName: fullNameParam, // Use URL search param directly for API call to match current view
        IsDescending: isDescending
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
            console.error("Error approving registration:", error);
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
            console.error("Error rejecting registration:", error);
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
        <div className={`h-full flex-1 flex-col space-y-8 ${isMobile ? 'p-2 space-y-4' : 'p-8'} flex`}>
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
                <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
                    <DataTable
                        data={registrations}
                        columns={columns}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        pageCount={data?.totalPages}
                    >
                        {() => (
                            <RegistrationTableToolbar
                                searchValue={fullName}
                                onSearchChange={handleSearchChange}
                                statusFilter={verificationStatus}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                    </DataTable>
                </div>
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
