'use client';

import { LoginForm } from "../components/LoginForm";
import { motion } from "framer-motion";



export default function LoginPage() {
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
                    Chào mừng bạn đến với Beyond8
                </h1>
            </div>

            {/* Form Component */}
            <LoginForm />
        </motion.div>
    );
}
