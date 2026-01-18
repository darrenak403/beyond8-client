'use client';


import { RegisterForm } from '../components/registerForm';

export default function RegisterPage() {
    return (
        <div className="flex flex-col space-y-6">


            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-primary">
                    Tạo tài khoản mới
                </h1>
                <p className="text-sm text-gray-500">
                    Nhập thông tin chi tiết của bạn để bắt đầu
                </p>
            </div>

            {/* Form Component */}
            <RegisterForm />
        </div>
    );
}
