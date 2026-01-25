"use client"

import { DataTable } from "@/components/ui/data-table"
import { PaginationState } from "@tanstack/react-table"
import { getColumns } from "./components/Columns"
import { UserTableToolbar } from "./components/UserTableToolbar"
import { useState, useCallback, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import { UserDialog } from "./components/UserDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useGetAllUsers, useUpdateUserStatus, useDeleteUser } from "@/hooks/useUsers"
import { User } from "@/lib/api/services/fetchUsers"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/widget/confirm-dialog"
import { useIsMobile } from "@/hooks/useMobile"

const UserManagementPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  // URL Params State
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 8;
  // Handle isDescending param, defaulting to true if not present or invalid
  const isDescendingParam = searchParams.get("isDescending");
  const isDescending = isDescendingParam === "false" ? false : true;

  const fullName = searchParams.get("fullName") || "";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Create query string helper
  const createQueryString = useCallback(
    (name: string, value: string | number | boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, String(value));
      return params.toString();
    },
    [searchParams]
  );

  // Handle Pagination
  const pagination: PaginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageSize,
  };

  const setPagination = (updater: any) => {
    const newPagination = typeof updater === "function" ? updater(pagination) : updater;
    router.push(`${pathname}?${createQueryString("pageNumber", newPagination.pageIndex + 1)}&${createQueryString("pageSize", newPagination.pageSize)}&${createQueryString("isDescending", isDescending)}`);
  };

  // Handle Search
  // const handleFullNameChange = (value: string) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (value) {
  //     params.set("fullName", value);
  //   } else {
  //     params.delete("fullName");
  //   }
  //   // Reset to page 1 on search
  //   params.set("pageNumber", "1");
  //   // Preserve current isDescending setting
  //   if (searchParams.get("isDescending")) {
  //     params.set("isDescending", searchParams.get("isDescending")!);
  //   }
  //   router.push(`${pathname}?${params.toString()}`);
  // };

  // We need to request pageNumber starting from 1 for the API
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAllUsers({
    pageNumber: pageNumber,
    pageSize: pageSize,
    isDescending: isDescending,
    fullName: fullName
  });

  // Let's add local state for search input
  const [searchValue, setSearchValue] = useState(fullName);

  // Sync local state with URL param (in case URL changes externally)
  useEffect(() => {
    setSearchValue(fullName);
  }, [fullName]);

  const debouncedSearch = useDebounce(searchValue, 500);

  // Effect to update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== fullName) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("fullName", debouncedSearch);
      } else {
        params.delete("fullName");
      }
      params.set("pageNumber", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams, fullName]);

  const { mutateAsync: updateUserStatus } = useUpdateUserStatus();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleAdd = () => {
    setSelectedUser(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleChangeStatus = (user: User) => {
    setSelectedUser(user);
    setIsStatusDialogOpen(true);
  };

  const onConfirmStatusChange = async () => {
    if (selectedUser) {
      try {
        await updateUserStatus(selectedUser.id);
        toast.success("Kích hoạt tài khoản thành công");
        setIsStatusDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Kích hoạt tài khoản thất bại");
      }
    }
  };

  const onConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        toast.success("Xóa người dùng thành công");
        setIsDeleteDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Xóa người dùng thất bại");
      }
    }
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onChangeStatus: handleChangeStatus,
    onDelete: handleDelete,
  });

  return (
    <div className={`h-full flex-1 flex-col space-y-8 ${isMobile ? 'p-4' : 'p-8'} flex`}>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error ? error.message : "Có lỗi xảy ra khi tải danh sách người dùng."}
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
              <Skeleton className="h-4 w-[30px]" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-[50px]" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
          <DataTable
            data={data?.users || []}
            columns={columns}
            pageCount={data?.totalPages}
            rowCount={data?.count}
            pagination={pagination}
            onPaginationChange={setPagination}
          >
            {(table) => (
              <UserTableToolbar
                table={table}
                onAdd={handleAdd}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />
            )}
          </DataTable>
        </div>
      )}

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        mode={dialogMode}
      />

      {/* Activation Dialog */}
      <ConfirmDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={onConfirmStatusChange}
        title="Kích hoạt tài khoản?"
        description="Người dùng này sẽ có thể truy cập lại vào hệ thống."
        confirmText="Kích hoạt"
        variant="success"
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        title="Bạn có chắc chắn không?"
        description="Hành động này không thể hoàn tác. Điều này sẽ ngưng hoạt động tài khoản người dùng."
        confirmText="Ngưng hoạt động"
        variant="destructive"
      />
    </div>
  )
}

export default UserManagementPage
