"use client"

import { DataTable } from "@/components/ui/data-table"
import { AdminUser } from "@/types/admin-user"
import { getColumns } from "./components/columns"
import { UserTableToolbar } from "./components/user-table-toolbar"
import { useState } from "react"
import { UserDialog } from "./components/user-dialog"
import { UserDeleteDialog } from "./components/user-delete-dialog"
import { UserFormValues } from "./components/user-schema"

const mockUsers: AdminUser[] = [
  {
    id: "1",
    email: "alice@example.com",
    passwordHash: "hash1",
    role: "admin",
    fullName: "Alice Johnson",
    avatarUrl: null,
    phoneNumber: "123-456-7890",
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2023-10-25T10:00:00Z",
    timezone: "UTC",
    locale: "en-US",
    status: "Active",
  },
  {
    id: "2",
    email: "bob@example.com",
    passwordHash: "hash2",
    role: "user",
    fullName: "Bob Smith",
    avatarUrl: null,
    phoneNumber: null,
    isActive: true,
    isEmailVerified: false,
    lastLoginAt: "2023-10-24T14:30:00Z",
    timezone: "UTC",
    locale: "en-US",
    status: "Inactive",
  },
  {
    id: "3",
    email: "charlie@example.com",
    passwordHash: "hash3",
    role: "user",
    fullName: "Charlie Brown",
    avatarUrl: null,
    phoneNumber: null,
    isActive: false,
    isEmailVerified: true,
    lastLoginAt: null,
    timezone: "PST",
    locale: "en-US",
    status: "Banned",
  },
  {
    id: "4",
    email: "david@example.com",
    passwordHash: "hash4",
    role: "manager",
    fullName: "David Lee",
    avatarUrl: null,
    phoneNumber: "555-0199",
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2023-10-26T09:15:00Z",
    timezone: "EST",
    locale: "en-US",
    status: "Active",
  },
  {
    id: "5",
    email: "eva@example.com",
    passwordHash: "hash5",
    role: "user",
    fullName: "Eva Green",
    avatarUrl: null,
    phoneNumber: null,
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: "2023-10-20T11:20:00Z",
    timezone: "CET",
    locale: "en-GB",
    status: "Active",
  },
]

const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAdd = () => {
    setSelectedUser(null)
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const onSubmitUser = (data: UserFormValues) => {
    if (dialogMode === "add") {
      const newUser: AdminUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        avatarUrl: null,
        phoneNumber: null,
        isActive: data.status === "Active",
        isEmailVerified: false,
        lastLoginAt: null,
        timezone: "UTC",
        locale: "en-US",
        status: data.status as any,
        passwordHash: "hash" // In real app, password would be handled by backend
      }
      setUsers([...users, newUser])
    } else if (dialogMode === "edit" && selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, ...data, isActive: data.status === "Active", status: data.status as any }
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
      <DataTable data={users} columns={columns}>
        {(table) => <UserTableToolbar table={table} onAdd={handleAdd} />}
      </DataTable>

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