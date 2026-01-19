'use client';

import { LoginForm } from "../components/loginForm";



export default function LoginPage() {
    return (
        <div className="flex flex-col space-y-6">


            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-primary">
                    Chào mừng bạn đến với Beyond8
                </h1>
            </div>

            {/* Form Component */}
            <LoginForm />
        </div>
    );
}
