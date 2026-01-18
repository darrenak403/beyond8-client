'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FormikForm, FormikField, Yup } from '@/components/ui/formik-form';
import { useLogin } from '@/hooks/useAuth';

const loginSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
});

interface LoginValues {
    email: string;
    password: string;
    [key: string]: unknown;
}

export function LoginForm() {
    const { mutateLogin, isLoading } = useLogin();

    const handleSubmit = (values: LoginValues) => {
        mutateLogin(values);
    };

    return (
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
                        disabled={isLoading}
                    />

                    <FormikField
                        name="password"
                        label="Mật khẩu *"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="h-10 rounded-full px-4 bg-white border-gray-200"
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        className="w-full h-10 rounded-full text-white text-base font-medium cursor-pointer"
                        disabled={isLoading || !isValid || !dirty}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>

                    {/* Divider */}
                    <div className="relative pt-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-dashed border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Chưa có tài khoản?</span>
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
    );
}
