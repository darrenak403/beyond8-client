'use client';

import { RegisterForm } from "../components/registerForm";
import { motion } from "framer-motion";


export default function RegisterPage() {
    return (
        <motion.div
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >


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
        </motion.div>
    );
}
