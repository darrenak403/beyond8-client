"use client"

import { DataTable } from "@/components/ui/data-table"
import { PaginationState, Updater } from "@tanstack/react-table"
import { getColumns } from "./components/Column"
import { CouponTableToolbar } from "./components/CouponTableToolbar"
import { useState, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { MobileCouponCard } from "./components/MobileCouponCard"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { useGetCouponForAdmin, useDeleteCoupon, useToggleCoupon } from "@/hooks/useCoupon"
import { Coupon } from "@/lib/api/services/fetchCoupon"
import { ConfirmDialog } from "@/components/widget/confirm-dialog"
import { useIsMobile } from "@/hooks/useMobile"
import { CouponDialog } from "@/components/widget/coupon/CouponDialog"

const CouponManagementPage = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isMobile = useIsMobile()

    // URL Params State
    const pageNumber = Number(searchParams.get("pageNumber")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 9;
    const isDescendingParam = searchParams.get("isDescending");
    const isDescending = isDescendingParam === "false" ? false : true;

    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    // Handle Pagination
    const pagination: PaginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageSize,
    };

    const setPagination = (updater: Updater<PaginationState>) => {
        const newPagination = typeof updater === "function" ? updater(pagination) : updater;
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageNumber", String(newPagination.pageIndex + 1));
        params.set("pageSize", String(newPagination.pageSize));
        params.set("isDescending", String(isDescending));
        router.push(`${pathname}?${params.toString()}`);
    };

    const { data, isLoading, isError, error, refetch, isFetching } = useGetCouponForAdmin({
        pageNumber: pageNumber,
        pageSize: pageSize,
        isDescending: isDescending,
    });

    const { deleteCoupon } = useDeleteCoupon();
    const { toggleCoupon } = useToggleCoupon();

    // Ensure URL params are initialized on mount
    useEffect(() => {
        const hasPageNumber = searchParams.has("pageNumber");
        const hasPageSize = searchParams.has("pageSize");

        if (!hasPageNumber || !hasPageSize) {
            const params = new URLSearchParams(searchParams.toString());
            if (!hasPageNumber) params.set("pageNumber", "1");
            if (!hasPageSize) params.set("pageSize", "9");
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, router, pathname]);

    const handleAdd = () => {
        setSelectedCoupon(null);
        setDialogMode("add");
        setIsDialogOpen(true);
    };

    const handleEdit = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDelete = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsDeleteDialogOpen(true);
    };

    const handleToggleStatus = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsStatusDialogOpen(true);
    };

    const onConfirmDelete = async () => {
        if (selectedCoupon) {
            try {
                await deleteCoupon(selectedCoupon.id);
                setIsDeleteDialogOpen(false);
            } catch (error) {
                // Toast handled in hook
            }
        }
    };

    const onConfirmStatusChange = async () => {
        if (selectedCoupon) {
            try {
                await toggleCoupon(selectedCoupon.id);
                setIsStatusDialogOpen(false);
            } catch (error) {
                // Toast handled in hook
            }
        }
    };


    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus
    });

    return (
        <div className={`h-full flex-1 flex-col space-y-2 ${isMobile ? 'p-2' : 'p-2'} flex`}>
            {isMobile && (
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Quản lý mã giảm giá</h2>
                    </div>
                </div>
            )}

            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        {error ? error.message : "Có lỗi xảy ra khi tải danh sách coupon."}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-[250px]" />
                        <Skeleton className="h-10 w-[100px]" />
                    </div>
                    <div className="rounded-md border">
                        <div className="h-12 border-b px-4 flex items-center gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 flex-1" />
                            ))}
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <Skeleton key={j} className="h-4 flex-1" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
                    {isMobile ? (
                        <div className="space-y-2">

                            {/* Mobile toolbar might need adjustment as it expects a table object. 
                   For now, we'll create a simplified toolbar or just buttons if needed. 
                   Actually, looking at UserPage, it passes the table. 
                   But passing mock might break filter logic in toolbar.
                   I will wrap the toolbar usage in a condition or just render buttons directly for mobile if table object is not available from mobile view logic.
                   Wait, UserPage creates a DataTable just for mobile? No, it conditionally renders.
                   The UserTableToolbar expects a table. 
                   Let's just use the DataTable component which provides the `table` instance via render prop.
               */}

                            {/* Since I can't easily get the table instance without rendering the DataTable, 
                   I will use the DataTable component for both mobile and desktop, 
                   but strictly control the rendering inside it?
                   UserPage does: isMobile ? (MobileView) : (DataTable).
                   UserPage passes `table` to Toolbar only inside DataTable render prop.
                   For mobile UserPage uses `UserTableToolbar` but passes what?
                   Ah, in UserPage: `UserTableToolbar` does NOT take `table` prop in the `interface`, but `CouponTableToolbar` DOES.
                   I made `CouponTableToolbar` dependent on `table` for filtering.
                   Reference UserPage again:
                   `UserTableToolbar` takes `searchValue`, `onSearchChange` etc. NOT `table`.
                   My `CouponTableToolbar` takes `table`.
                   I should refactor `CouponTableToolbar` to NOT take `table` if I want to reuse it easily, or just render it inside logic.
                   But `CouponTableToolbar` uses `table.getColumn()`.
                   
                   I will stick to the UserPage pattern where the toolbar is separate from table logic if possible, 
                   BUT `CouponTableToolbar` using `table` is powerful for `DataTableFacetedFilter`.
                   
                   Let's just render the Add button and simple search for mobile manually OR
                   Instantiate a dummy table instance? No that's too much.
                   
                   I'll modify `CouponManagementPage` to use `DataTable` always, but `DataTable` renders a table.
                   Shadcn `DataTable` usually renders a table.
                   
                   I will just replicate the Logic:
                   Mobile View needs its own controls if not using the Table.
               */}

                            <div className="flex items-center justify-between gap-2">
                                <Button onClick={handleAdd} className="w-full">Tạo mới</Button>
                                <Button variant="outline" onClick={() => refetch()} size="icon"><div className={isFetching ? "animate-spin" : ""}>↻</div></Button>
                            </div>

                            <div className="grid gap-2">
                                {data?.data?.map((coupon) => (
                                    <MobileCouponCard
                                        key={coupon.id}
                                        coupon={coupon}
                                        onEdit={() => handleEdit(coupon)}
                                        onDelete={() => handleDelete(coupon)}
                                        onToggleStatus={() => handleToggleStatus(coupon)}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-center space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                                    disabled={!data?.hasPreviousPage}
                                >
                                    Previous
                                </Button>
                                <div className="text-sm">
                                    Page {data?.pageNumber} of {data?.totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                                    disabled={!data?.hasNextPage}
                                >
                                    Next
                                </Button>
                            </div>

                        </div>
                    ) : (
                        <DataTable
                            data={data?.data || []}
                            columns={columns}
                            pageCount={data?.totalPages}
                            rowCount={data?.count}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                        >
                            {(table) => (
                                <CouponTableToolbar
                                    table={table}
                                    onAdd={handleAdd}
                                    onRefresh={() => refetch()}
                                    isFetching={isFetching}
                                />
                            )}
                        </DataTable>
                    )}
                </div>
            )}

            <CouponDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                initialData={selectedCoupon}
            />

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={onConfirmDelete}
                title="Xóa mã giảm giá?"
                description={`Bạn có chắc chắn muốn xóa mã "${selectedCoupon?.code}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                variant="destructive"
            />

            <ConfirmDialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                onConfirm={onConfirmStatusChange}
                title={selectedCoupon?.isActive ? "Vô hiệu hóa mã giảm giá?" : "Kích hoạt mã giảm giá?"}
                description={`Bạn có chắc chắn muốn ${selectedCoupon?.isActive ? "vô hiệu hóa" : "kích hoạt"} mã "${selectedCoupon?.code}"?`}
                confirmText={selectedCoupon?.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                variant={selectedCoupon?.isActive ? "destructive" : "success"}
            />
        </div>
    )
}

export default CouponManagementPage
