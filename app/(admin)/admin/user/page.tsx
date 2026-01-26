"use client"

import { DataTable } from "@/components/ui/data-table"
import { PaginationState } from "@tanstack/react-table"
import { getColumns } from "./components/Columns"
import { UserTableToolbar } from "./components/UserTableToolbar"
import { useState, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import { UserDialog } from "./components/UserDialog"
import { MobileUserCard } from "./components/MobileUserCard"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RotateCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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

  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle Pagination
  const pagination: PaginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageSize,
  };

  const setPagination = (updater: any) => {
    const newPagination = typeof updater === "function" ? updater(pagination) : updater;
    const params = new URLSearchParams();
    params.set("pageNumber", String(newPagination.pageIndex + 1));
    params.set("pageSize", String(newPagination.pageSize));
    params.set("isDescending", String(isDescending));
    // Preserve email if it exists
    if (email) {
      params.set("email", email);
    }
    // Preserve role if it exists
    if (role) {
      params.set("role", role);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("role", value);
    } else {
      params.delete("role");
    }
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // We need to request pageNumber starting from 1 for the API
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAllUsers({
    pageNumber: pageNumber,
    pageSize: pageSize,
    isDescending: isDescending,
    email: email,
    role: role
  });

  // Let's add local state for search input
  const [searchValue, setSearchValue] = useState(email);

  // Ensure URL params are initialized on mount
  useEffect(() => {
    const hasPageNumber = searchParams.has("pageNumber");
    const hasPageSize = searchParams.has("pageSize");

    if (!hasPageNumber || !hasPageSize) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasPageNumber) params.set("pageNumber", "1");
      if (!hasPageSize) params.set("pageSize", "8");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  // Sync local state with URL param (in case URL changes externally)
  useEffect(() => {
    setSearchValue(email);
  }, [email]);

  const debouncedSearch = useDebounce(searchValue, 500);

  // Effect to update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== email) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("email", debouncedSearch);
      } else {
        params.delete("email");
      }
      params.set("pageNumber", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams, email]);

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
        toast.success("Ngưng hoạt động tài khoản thành công");
        setIsDeleteDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Ngưng hoạt động tài khoản thất bại");
      }
    }
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onChangeStatus: handleChangeStatus,
    onDelete: handleDelete,
  });

  return (
    <div className={`h-full flex-1 flex-col space-y-8 ${isMobile ? 'p-2 space-y-4' : 'p-8'} flex`}>
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
          {isMobile ? (
            <div className="space-y-4">
              <UserTableToolbar
                table={null as any} // Toolbar doesn't actually use table for search/filter in this implementation
                onAdd={handleAdd}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                roleFilter={role}
                onRoleChange={handleRoleChange}
              />
              <div className="grid gap-4">
                {data?.users?.map((user) => (
                  <MobileUserCard
                    key={user.id}
                    user={user}
                    onEdit={() => handleEdit(user)}
                    onDelete={() => handleDelete(user)}
                    onChangeStatus={() => handleChangeStatus(user)}
                  />
                ))}
              </div>
              {/* Mobile Pagination */}
              <div className="flex items-center justify-center px-2 py-4">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination((prev: any) => ({ ...prev, pageIndex: 0 }))}
                    disabled={!data?.hasPreviousPage}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination((prev: any) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                    disabled={!data?.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.min(3, data?.totalPages || 1) }, (_, i) => {
                    let startPage = Math.max(0, pagination.pageIndex - 1);
                    const endPage = Math.min((data?.totalPages || 1) - 1, startPage + 2);

                    if (endPage - startPage < 2) {
                      startPage = Math.max(0, endPage - 2);
                    }

                    const pageNum = startPage + i;
                    if (pageNum >= (data?.totalPages || 0)) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.pageIndex === pageNum ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        onClick={() => setPagination((prev: any) => ({ ...prev, pageIndex: pageNum }))}
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination((prev: any) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                    disabled={!data?.hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination((prev: any) => ({ ...prev, pageIndex: (data?.totalPages || 1) - 1 }))}
                    disabled={!data?.hasNextPage}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
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
                  roleFilter={role}
                  onRoleChange={handleRoleChange}
                />
              )}
            </DataTable>
          )}
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
