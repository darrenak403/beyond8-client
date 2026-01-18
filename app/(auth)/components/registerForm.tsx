'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Formik } from 'formik';

export function RegisterForm() {
    return (
        <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            {() => (
                <Form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="Nhập địa chỉ email"
                            type="email"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu *</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            type="password"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu *</Label>
                        <Input
                            id="confirm-password"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            type="password"
                            className="h-10 rounded-full px-4 bg-white border-gray-200"
                        />
                    </div>

                    <Button className="w-full h-10 rounded-full text-white text-base font-medium">
                        Đăng ký
                    </Button>



                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-dashed border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Đã có tài khoản?</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link href="/login">
                            <Button variant="outline" className="w-full h-12 rounded-full border-gray-200 font-normal justify-start px-6 relative hover:bg-gray-100 hover:text-primary mt-3">
                                <div className="flex items-center justify-center w-full relative">
                                    <svg className="absolute left-0 w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                    </svg>
                                    <span>Đăng nhập</span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
