import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LearningPathSimulation from './components/LearningPathSimulation';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full relative">
            {/* Logo */}
            <Link href="/">
                <div className="absolute top-4 left-8 z-10">
                    <Image
                        src="/icon-logo.png"
                        alt="Beyond8 Logo"
                        width={80}
                        height={80}
                        className="h-20 w-auto"
                        priority
                    />
                </div>
            </Link>

            {/* Left side - Form Content */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-[400px]">
                    {children}
                </div>
            </div>

            {/* Right side - Learning Path Simulation */}
            <div className="hidden w-1/2 lg:block relative overflow-hidden bg-gray-100">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg-auth.webp"
                        alt="Background Auth"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-white/20" />
                </div>

                {/* Simulation Overlay */}
                <div className="relative z-10 h-full w-full">
                    <LearningPathSimulation />
                </div>
            </div>
        </div>
    );
}
