'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FormikForm, FormikField, Yup } from '@/components/ui/formik-form';
import { useLogin, useForgotPassword, useVerifyOtpForgotPassword, useResendOtp, useVerifyOtpRegister } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordDialog } from '@/components/widget/auth/ForgotPasswordDialog';
import { OtpDialog } from '@/components/widget/auth/OtpDialog';
import { toast } from 'sonner';

const loginSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số')
        .required('Mật khẩu là bắt buộc'),
});

interface LoginValues {
    email: string;
    password: string;
    [key: string]: unknown;
}

export function LoginForm() {
    const { mutateLogin, isLoading: isLoginLoading } = useLogin();
    const { mutateForgotPassword, isLoading: isForgotLoading } = useForgotPassword();
    const { mutateResendOtp, isLoading: isResendLoading } = useResendOtp();
    const { mutateVerifyOtpForgotPassword, isLoading: isVerifyForgotLoading } = useVerifyOtpForgotPassword();
    const { mutateVerifyOtpRegister, isLoading: isVerifyRegisterLoading } = useVerifyOtpRegister();
    const router = useRouter();

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [emailForOtp, setEmailForOtp] = useState("");
    const [otpType, setOtpType] = useState<'forgot' | 'register'>('forgot');

    const handleSubmit = (values: LoginValues) => {
        mutateLogin(values, {
            onError: (error: any) => {
                if (error.message === "Tài khoản của bạn chưa được xác thực, vui lòng kiểm tra email để xác thực.") {
                    setEmailForOtp(values.email);
                    setOtpType('register');
                    mutateResendOtp(values.email);
                    setShowOtp(true);
                }
            }
        });
    };

    const handleForgotPasswordSuccess = (email: string) => {
        setEmailForOtp(email);
        setOtpType('forgot');
        mutateForgotPassword(email, {
            onSuccess: () => {
                setShowForgotPassword(false);
                setShowOtp(true);
            }
        });
    };

    const handleVerifyOtp = (otp: string) => {
        if (otpType === 'forgot') {
            mutateVerifyOtpForgotPassword({ email: emailForOtp, otpCode: otp }, {
                onSuccess: () => {
                    setShowOtp(false);
                    sessionStorage.setItem('resetPasswordEmail', emailForOtp);
                    sessionStorage.setItem('resetPasswordOtp', otp);
                    router.push('/reset-password');
                }
            });
        } else {
            mutateVerifyOtpRegister({ email: emailForOtp, otpCode: otp }, {
                onSuccess: () => {
                    setShowOtp(false);
                    toast.success('Xác thực tài khoản thành công!',
                        {
                            description: 'Vui lòng đăng nhập',
                        }
                    );
                }
            });
        }
    };

    const isVerifyLoading = otpType === 'forgot' ? isVerifyForgotLoading : isVerifyRegisterLoading;

    return (
        <>
            <FormikForm<LoginValues>
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
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
                            disabled={isLoginLoading}
                        />

                        <FormikField
                            name="password"
                            label="Mật khẩu *"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                            disabled={isLoginLoading}
                        />

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="link"
                                className="px-0 text-primary text-sm font-normal h-auto py-1"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Quên mật khẩu?
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-full text-white text-base font-medium cursor-pointer"
                            disabled={isLoginLoading || !isValid || !dirty}
                        >
                            {isLoginLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>

                        {/* Divider */}
                        <div className="relative pt-2">
                            {/* Divider */}
                            <div className="relative flex items-center justify-center w-full mt-6 mb-2">
                                <div className="flex-grow border-t border-dashed border-gray-300"></div>
                                <span className="px-4 bg-white text-xs uppercase text-gray-500 font-medium">Chưa có tài khoản?</span>
                                <div className="flex-grow border-t border-dashed border-gray-300"></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/register">
                                <Button variant="outline" className="w-full h-12 rounded-full border-gray-200 font-normal justify-start px-6 relative hover:bg-gray-100 hover:text-primary mt-3 cursor-pointer">
                                    <div className="flex items-center justify-center w-full relative">
                                        <svg className="absolute left-0 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        <span>Đăng ký</span>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </FormikForm>

            <ForgotPasswordDialog
                open={showForgotPassword}
                onOpenChange={setShowForgotPassword}
                onSuccess={handleForgotPasswordSuccess}
                isLoading={isForgotLoading}
            />

            <OtpDialog
                open={showOtp}
                onOpenChange={setShowOtp}
                email={emailForOtp}
                onVerify={handleVerifyOtp}
                onResend={() => mutateResendOtp(emailForOtp)}
                isLoading={isVerifyLoading}
            />
        </>
    );
}
