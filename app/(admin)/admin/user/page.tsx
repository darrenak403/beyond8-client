"use client"

import { DataTable } from "@/components/ui/data-table"
import { PaginationState } from "@tanstack/react-table"
import { getColumns } from "./components/columns"
import { UserTableToolbar } from "./components/user-table-toolbar"
import { useState } from "react"
import { UserDialog } from "./components/user-dialog"
import { UserDeleteDialog } from "./components/user-delete-dialog"
import { UserFormValues } from "./components/user-schema"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useGetAllUsers } from "@/hooks/useUsers"
import { useEffect } from "react"
import { User } from "@/lib/api/services/fetchUsers"

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // We need to request pageNumber starting from 1 for the API
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAllUsers({
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isDescending: true,
  })

  useEffect(() => {
    if (data) {
      setUsers(data.users || [])
    }
  }, [data])

  const handleAdd = () => {
    setSelectedUser(null)
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const onSubmitUser = (data: UserFormValues) => {
    if (dialogMode === "add") {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        avatarUrl: "",
        phoneNumber: "",
        isActive: data.status === "Active",
        isEmailVerified: false,
        lastLoginAt: new Date().toISOString(),
        timezone: "UTC",
        locale: "en-US",
        status: data.status as any,
        role: [data.role],
        passwordHash: "hash"
      }
      setUsers([...users, newUser])
    } else if (dialogMode === "edit" && selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, ...data, isActive: data.status === "Active", status: data.status as any, role: [data.role] }
          : u
      )
      setUsers(updatedUsers)
    }
  }

  const onConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
    }
  }

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h2>
          <p className="text-muted-foreground">
            Dưới đây là danh sách người dùng trong hệ thống!
          </p>
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
        <DataTable
          data={users}
          columns={columns}
          pageCount={data?.totalPages}
          rowCount={data?.count}
          pagination={pagination}
          onPaginationChange={setPagination}
        >
          {(table) => <UserTableToolbar table={table} onAdd={handleAdd} />}
        </DataTable>
      )}

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        mode={dialogMode}
        onSubmit={onSubmitUser}
      />

      <UserDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  )
}

export default UserManagementPage