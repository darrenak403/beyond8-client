'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FormikForm, FormikField, Yup } from '@/components/ui/formik-form';
import { useForgotPassword, useRegister, useResendOtp, useVerifyOtpRegister } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OtpDialog } from '@/components/auth/OtpDialog';
import { toast } from 'sonner';
import { describe } from 'node:test';

const registerSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số')
        .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
});

interface RegisterValues {
    email: string;
    password: string;
    confirmPassword: string;
    [key: string]: unknown;
}

export function RegisterForm() {
    const { mutateRegister, isLoading: isRegisterLoading } = useRegister();
    const { mutateVerifyOtpRegister, isLoading: isVerifyLoading } = useVerifyOtpRegister();
    const { mutateResendOtp, isLoading: isResendLoading } = useResendOtp();
    const router = useRouter();

    const [showOtp, setShowOtp] = useState(false);
    const [emailForOtp, setEmailForOtp] = useState("");

    const handleSubmit = (values: RegisterValues) => {
        setEmailForOtp(values.email);
        mutateRegister({ email: values.email, password: values.password }, {
            onSuccess: () => {
                setShowOtp(true);
            }
        });
    };

    const handleVerifyOtp = (otp: string) => {
        mutateVerifyOtpRegister({ email: emailForOtp, otpCode: otp }, {
            onSuccess: () => {
                setShowOtp(false);
                toast.success('Xác thực thành công!', {
                    description: 'Vui lòng đăng nhập để tiếp tục'
                });
                router.push('/login');
            }
        });
    };

    return (
        <>
            <FormikForm<RegisterValues>
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
            >
                {({ isValid, dirty }) => (
                    <>
                        <FormikField
                            name="email"
                            label="Email *"
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                            disabled={isRegisterLoading}
                        />

                        <FormikField
                            name="password"
                            label="Mật khẩu *"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                            disabled={isRegisterLoading}
                        />

                        <FormikField
                            name="confirmPassword"
                            label="Xác nhận mật khẩu *"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                            disabled={isRegisterLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-full text-white text-base font-medium cursor-pointer mt-6"
                            disabled={isRegisterLoading || !isValid || !dirty}
                        >
                            {isRegisterLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>

                        {/* Divider */}
                        <div className="relative pt-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-dashed border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Đã có tài khoản?</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/login">
                                <Button variant="outline" className="w-full h-12 rounded-full border-gray-200 font-normal justify-start px-6 relative hover:bg-gray-100 hover:text-primary mt-3 cursor-pointer">
                                    <div className="flex items-center justify-center w-full relative">
                                        <svg className="absolute left-0 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                        </svg>
                                        <span>Đăng nhập</span>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </FormikForm>

            <OtpDialog
                open={showOtp}
                onOpenChange={setShowOtp}
                email={emailForOtp}
                onVerify={handleVerifyOtp}
                onResend={() => { mutateResendOtp(emailForOtp) }}
                isLoading={isVerifyLoading}
            />
        </>
    );
}
