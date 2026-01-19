'use client';

import { Button } from '@/components/ui/button';
import { FormikForm, FormikField, Yup } from '@/components/ui/formik-form';
import { useResetPassword } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số')
        .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
});

interface ResetPasswordValues {
    password: string;
    confirmPassword: string;
    [key: string]: unknown;
}

export function ResetPasswordForm() {
    const { mutateResetPassword, isLoading } = useResetPassword();
    const router = useRouter();

    const handleSubmit = (values: ResetPasswordValues) => {
        const email = sessionStorage.getItem('resetPasswordEmail');
        const otp = sessionStorage.getItem('resetPasswordOtp');

        if (!email || !otp) {
            toast.error('Thiếu thông tin xác thực. Vui lòng thực hiện lại quy trình.');
            router.push('/login');
            return;
        }

        mutateResetPassword({
            email,
            otpCode: otp,
            newPassword: values.password,
            confirmNewPassword: values.confirmPassword
        }, {
            onSuccess: () => {
                sessionStorage.removeItem('resetPasswordEmail');
                sessionStorage.removeItem('resetPasswordOtp');
                router.push('/login');
            }
        });
    };

    return (
        <FormikForm<ResetPasswordValues>
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
        >
            {({ isValid, dirty }) => (
                <>
                    <FormikField
                        name="password"
                        label="Mật khẩu mới *"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="h-10 rounded-full px-4 bg-white border-gray-200"
                        disabled={isLoading}
                    />

                    <FormikField
                        name="confirmPassword"
                        label="Xác nhận mật khẩu *"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        className="h-10 rounded-full px-4 bg-white border-gray-200"
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        className="w-full h-10 rounded-full text-white text-base font-medium cursor-pointer mt-4"
                        disabled={isLoading || !isValid || !dirty}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </Button>
                </>
            )}
        </FormikForm>
    );
}
