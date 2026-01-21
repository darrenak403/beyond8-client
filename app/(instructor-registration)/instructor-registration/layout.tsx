'use client';

export default function InstructorRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
    </div>
  );
}
