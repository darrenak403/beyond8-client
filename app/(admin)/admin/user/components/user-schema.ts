import { z } from "zod"

export const userSchema = z.object({
    fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    role: z.string().min(1, "Vui lòng chọn vai trò"),
    status: z.enum(["Active", "Inactive", "Banned"]),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
})

export type UserFormValues = z.infer<typeof userSchema>
