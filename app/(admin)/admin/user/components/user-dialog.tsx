"use client"

import { useMemo } from "react"
import { Field } from "formik"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormikForm, FormikField } from "@/components/ui/formik-form"

import { getUserValidationSchema, UserFormValues } from "./user-validation"
import { AdminUser } from "@/types/admin-user"

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: AdminUser | null
    mode: "add" | "edit"
    onSubmit: (data: UserFormValues) => void
}

const ROLES = ["admin", "user", "manager"]

export function UserDialog({
    open,
    onOpenChange,
    user,
    mode,
    onSubmit,
}: UserDialogProps) {
    const initialValues: UserFormValues = useMemo(() => {
        if (user && mode === "edit") {
            return {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status,
                password: "",
            }
        }
        return {
            fullName: "",
            email: "",
            role: "user",
            status: "Active",
            password: "",
        }
    }, [user, mode])

    const validationSchema = useMemo(() => getUserValidationSchema(mode), [mode])

    const handleSubmit = (values: UserFormValues) => {
        onSubmit(values)
        onOpenChange(false)
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add"
                            ? "Thêm người dùng"
                            : mode === "edit"
                                ? "Chỉnh sửa người dùng"
                                : "Chi tiết người dùng"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "view"
                            ? "Xem thông tin chi tiết của người dùng."
                            : "Nhập thông tin người dùng ở đây. Nhấn lưu khi hoàn tất."}
                    </DialogDescription>
                </DialogHeader>

                <FormikForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {({ setFieldValue, values, errors, touched }) => (
                        <>
                            <FormikField
                                name="fullName"
                                label="Họ và tên"
                                placeholder="Nguyễn Văn A"

                            />
                            <FormikField
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="example@gmail.com"

                            />

                            {mode === "add" && (
                                <FormikField
                                    name="password"
                                    label="Mật khẩu"
                                    type="password"
                                    placeholder="******"

                                />
                            )}

                            <div className="space-y-2">
                                <Label>Vai trò</Label>
                                <Select

                                    onValueChange={(value) => setFieldValue("role", value)}
                                    value={values.role}
                                >
                                    <SelectTrigger className={errors.role && touched.role ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && touched.role && (
                                    <p className="text-[0.8rem] font-medium text-destructive">
                                        {errors.role as string}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select

                                    onValueChange={(value) => setFieldValue("status", value)}
                                    value={values.status}
                                >
                                    <SelectTrigger className={errors.status && touched.status ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Hoạt động</SelectItem>
                                        <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                                        <SelectItem value="Banned">Đã cấm</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && touched.status && (
                                    <p className="text-[0.8rem] font-medium text-destructive">
                                        {errors.status as string}
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button type="submit">Lưu thay đổi</Button>
                            </DialogFooter>
                        </>
                    )}
                </FormikForm>
            </DialogContent>
        </Dialog>
    )
}
