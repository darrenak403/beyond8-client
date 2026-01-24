"use client"

import { useRef, useMemo, useState } from "react"
import { FormikForm, FormikField } from "@/components/ui/formik-form"
import * as Yup from "yup"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { User } from "@/lib/api/services/fetchUsers"
import { useAddUser, useUpdateUser } from "@/hooks/useUsers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { mediaService } from "@/lib/api/services/fetchMedia"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { useIsMobile } from "@/hooks/useMobile"
import { RoleBadgeItem } from "./RoleBadge"

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
    mode: "add" | "edit"
}

type UserFormValues = {
    fullName: string
    email: string
    roles: string[]
    password?: string
    avatarUrl?: string
    phoneNumber?: string
    dateOfBirth?: string
    locale?: string
    timezone?: string
    [key: string]: any
}

const getUserValidationSchema = (mode: string) => Yup.object().shape({
    fullName: Yup.string()
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .required("Họ và tên là bắt buộc"),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
    roles: Yup.array()
        .of(Yup.string())
        .min(1, "Phải chọn ít nhất một vai trò")
        .required("Phải chọn vai trò"),
    password: mode === "add"
        ? Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc")
        : Yup.string().optional(),
    phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
        .min(10, "Số điện thoại phải có ít nhất 10 số")
        .max(11, "Số điện thoại không được quá 11 số")
        .optional(),
    dateOfBirth: Yup.date()
        .max(new Date(), "Ngày sinh không được lớn hơn hiện tại")
        .optional(),
    locale: Yup.string().optional(),
    timezone: Yup.string().optional(),
})

const ROLE_VALUES: Array<{ value: string, label: string }> = [
    { label: "Học viên", value: "ROLE_STUDENT" },
    { label: "Giảng viên", value: "ROLE_INSTRUCTOR" },
    { label: "Nhân viên", value: "ROLE_STAFF" },
    { label: "Admin", value: "ROLE_ADMIN" }
]

export function UserDialog({
    open,
    onOpenChange,
    user,
    mode,
}: UserDialogProps) {
    const isMobile = useIsMobile()
    const { mutateAsync: addUser, isPending: isAdding } = useAddUser()

    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser()

    // Local state for file upload
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const initialValues: UserFormValues = useMemo(() => {
        if (user && mode === "edit") {
            return {
                fullName: user.fullName || "",
                email: user.email || "",
                roles: user.roles && user.roles.length > 0 ? user.roles : ["ROLE_STUDENT"],
                password: "",
                avatarUrl: user.avatarUrl || "",
                phoneNumber: user.phoneNumber || "",
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                locale: user.locale || "vi-VN",
                timezone: user.timezone || "Asia/Ho_Chi_Minh",
            }
        }
        return {
            fullName: "",
            email: "",
            roles: ["Student"],
            password: "",
            avatarUrl: "",
            phoneNumber: "",
            dateOfBirth: "",
            locale: "vi-VN",
            timezone: "Asia/Ho_Chi_Minh",
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, mode, open])

    const validationSchema = useMemo(() => getUserValidationSchema(mode), [mode])

    const handleSubmit = async (values: UserFormValues) => {
        try {
            if (mode === "add") {
                const addData: any = {
                    ...values,
                    roles: values.roles,
                    avatarUrl: formatImageUrl(values.avatarUrl), // Already updated by handleFileChange
                    locale: values.locale || "vi-VN",
                    timezone: values.timezone || "Asia/Ho_Chi_Minh",
                    coverUrl: "",
                    dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : new Date().toISOString(),
                    phoneNumber: values.phoneNumber || "",
                }
                await addUser(addData)
                toast.success("Thêm người dùng thành công")
            } else {
                if (values.roles && user) {
                    await updateUser({ id: user.id, roles: values.roles })
                    toast.success("Cập nhật người dùng thành công")
                }
            }
            onOpenChange(false)
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    const toggleRole = (roleValue: string, currentRoles: string[], setFieldValue: (field: string, value: any) => void) => {
        const newRoles = currentRoles.includes(roleValue)
            ? currentRoles.filter(r => r !== roleValue)
            : [...currentRoles, roleValue];
        setFieldValue("roles", newRoles);
    };

    const isLoading = isAdding || isUpdating || isUploading

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={isMobile ? "max-w-full w-full h-[100dvh] rounded-none p-4 flex flex-col overflow-y-auto" : "sm:max-w-[800px]"}>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
                    </DialogTitle>
                    <DialogDescription>
                        Nhập thông tin người dùng ở đây. Nhấn lưu khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>

                <FormikForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {({ setFieldValue, values, errors, touched }) => {
                        const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0]
                            if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                    toast.error("Kích thước file không được vượt quá 5MB");
                                    return;
                                }
                                if (!file.type.startsWith("image/")) {
                                    toast.error("Vui lòng chọn file ảnh");
                                    return;
                                }

                                try {
                                    setIsUploading(true)
                                    const mediaFile = await mediaService.uploadAvatar(file)
                                    setFieldValue("avatarUrl", mediaFile.fileUrl)
                                    toast.success("Tải ảnh lên thành công")
                                } catch (error) {
                                    console.error("Upload failed", error)
                                    toast.error("Tải ảnh thất bại")
                                } finally {
                                    setIsUploading(false)
                                    // Reset input so validation triggers again if same file selected (optional)
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }
                            }
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                                {/* Left Column: Avatar */}
                                <div className="flex flex-col items-center gap-4 pt-4">
                                    <div
                                        className={`relative group ${mode === "add" ? "cursor-pointer" : ""}`}
                                        onClick={() => mode === "add" && !isLoading && fileInputRef.current?.click()}
                                    >
                                        <Avatar className="h-40 w-40 border-4 border-muted">
                                            <AvatarImage
                                                src={formatImageUrl(values.avatarUrl)}
                                                className="object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                            <AvatarFallback className="text-4xl text-muted-foreground">
                                                {values.fullName ? values.fullName.charAt(0).toUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>

                                        {mode === "add" && (
                                            <>
                                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    {isUploading ? (
                                                        <Loader2 className="text-white h-10 w-10 animate-spin" />
                                                    ) : (
                                                        <Camera className="text-white h-10 w-10" />
                                                    )}
                                                </div>

                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    disabled={isLoading}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="font-medium text-sm">Ảnh đại diện</p>
                                        {mode === "add" && (
                                            <p className="text-xs text-muted-foreground">
                                                {isUploading ? "Đang tải ảnh..." : "Nhấn vào ảnh để thay đổi"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Form Fields */}
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormikField
                                                name="fullName"
                                                label="Họ và tên"
                                                placeholder="Nguyễn Văn A"
                                                disabled={mode === "edit"}
                                            />
                                            <FormikField
                                                name="phoneNumber"
                                                label="Số điện thoại"
                                                placeholder="0123456789"
                                                disabled={mode === "edit"}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormikField
                                                name="email"
                                                label="Email"
                                                type="email"
                                                placeholder="example@gmail.com"
                                                disabled={mode === "edit"}
                                            />
                                            <FormikField
                                                name="dateOfBirth"
                                                label="Ngày sinh"
                                                type="date"
                                                max={new Date().toISOString().split("T")[0]}
                                                disabled={mode === "edit"}
                                            />
                                        </div>

                                        {mode === "add" && (
                                            <FormikField
                                                name="password"
                                                label="Mật khẩu"
                                                type="password"
                                                placeholder="******"
                                            />
                                        )}

                                        {ROLE_VALUES.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Vai trò <span className="text-destructive">*</span>
                                                </p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {ROLE_VALUES.map((role) => {
                                                        const isSelected = values.roles.includes(role.value);
                                                        return (
                                                            <RoleBadgeItem
                                                                key={role.value}
                                                                role={role.value}
                                                                variant={isSelected ? "secondary" : "outline"}
                                                                className={`cursor-pointer select-none ${isSelected ? "bg-primary/10 hover:bg-primary/20 border-primary/50 text-foreground" : "hover:bg-accent"}`}
                                                                onClick={() => toggleRole(role.value, values.roles, setFieldValue)}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                                {touched.roles && errors.roles && (
                                                    <p className="text-sm font-medium text-destructive">
                                                        {typeof errors.roles === 'string' ? errors.roles : "Vui lòng chọn vai trò"}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* <div className="grid grid-cols-2 gap-4">
                                            {mode === "edit" && (
                                                <div className="space-y-2">
                                                    <Label>Ngôn ngữ</Label>
                                                    <Select
                                                        onValueChange={(value) => setFieldValue("locale", value)}
                                                        value={values.locale}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn ngôn ngữ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {LOCALES.map((locale) => (
                                                                <SelectItem key={locale.value} value={locale.value}>
                                                                    {locale.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>

                                        {mode === "edit" && (
                                            <div className="space-y-2">
                                                <Label>Múi giờ</Label>
                                                <Select
                                                    onValueChange={(value) => setFieldValue("timezone", value)}
                                                    value={values.timezone}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn múi giờ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TIMEZONES.map((timezone) => (
                                                            <SelectItem key={timezone.value} value={timezone.value}>
                                                                {timezone.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )} */}
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto h-11 rounded-full">
                                            {isLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Lưu thay đổi
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </div>
                        )
                    }}
                </FormikForm>
            </DialogContent>
        </Dialog>
    )
}
