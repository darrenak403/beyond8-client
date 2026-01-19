import * as Yup from "yup"

export const getUserValidationSchema = (mode: string) => Yup.object().shape({
    fullName: Yup.string()
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .required("Họ và tên là bắt buộc"),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
    role: Yup.string()
        .required("Phải chọn vai trò"),
    status: Yup.string()
        .oneOf(["Active", "Inactive", "Banned"], "Trạng thái không hợp lệ")
        .required("Trạng thái là bắt buộc"),
    password: mode === "add"
        ? Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc")
        : Yup.string().optional(),
})

export type UserFormValues = {
    fullName: string
    email: string
    role: string
    status: "Active" | "Inactive" | "Banned"
    password?: string
}
