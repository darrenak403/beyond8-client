'use client';

import { ResetPasswordForm } from '../components/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-primary">
                    Đặt lại mật khẩu
                </h1>
                <p className="text-sm text-gray-500">
                    Nhập mật khẩu mới của bạn để hoàn tất quá trình
                </p>
            </div>

            {/* Form Component */}
            <ResetPasswordForm />
        </div>
    );
}
