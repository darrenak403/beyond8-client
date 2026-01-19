export interface AdminUser {
    id: string
    email: string
    passwordHash: string
    role: string
    fullName: string
    avatarUrl: string | null
    phoneNumber: string | null
    isActive: boolean
    isEmailVerified: boolean
    lastLoginAt: string | null
    timezone: string
    locale: string
    status: "Active" | "Inactive" | "Banned" // Assuming potential other statuses
}
