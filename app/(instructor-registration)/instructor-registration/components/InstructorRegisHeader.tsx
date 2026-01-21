"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InstructorRegisHeader() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo - Clickable */}
        <Link href="/" className="flex items-center cursor-pointer">
          <Image
            src="/icon-logo.png"
            alt="Beyond 8"
            width={60}
            height={60}
            className="h-20 w-auto"
          />
        </Link>

        {/* Exit Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Thoát
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Thoát đăng ký giảng viên?</AlertDialogTitle>
              <AlertDialogDescription>
                Thông tin bạn đã nhập sẽ không được lưu. Bạn có chắc chắn muốn thoát?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleExit} className="bg-red-600 hover:bg-red-700">
                Thoát
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
