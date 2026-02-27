import React from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeaderPortal } from "./HeaderPortal";

interface NoSelectionProps {
    onBackToInfo?: () => void;
}

export const NoSelection: React.FC<NoSelectionProps> = ({ onBackToInfo }) => {
    const router = useRouter();
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <HeaderPortal>
                {/* Header with Exit Button and Tab Switcher */}
                <div className="flex items-center justify-between px-8 py-3 h-14 bg-white w-full">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.push('/instructor/courses')}
                            variant="outline"
                            className="w-full rounded-full hover:bg-gray-100 hover:text-gray-900"
                            size="sm"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Thoát
                        </Button>
                    </div>

                    {/* Tab Switcher in Center */}
                    {onBackToInfo && (
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200">
                                <button
                                    onClick={onBackToInfo}
                                    className="px-6 py-2 text-sm font-medium rounded-full transition-all text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                >
                                    Thông tin khóa học
                                </button>
                                <button
                                    className="px-6 py-2 text-sm font-medium rounded-full transition-all bg-white text-black shadow-sm ring-1 ring-black/5"
                                >
                                    Nội dung khóa học
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Empty right side to balance layout */}
                    <div className="w-[100px]"></div>
                </div>
            </HeaderPortal>

            <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-4 rounded-full shadow-sm inline-flex mb-6 ring-1 ring-gray-100">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Chưa chọn nội dung
                </h3>
                <p className="text-base text-gray-500 leading-relaxed">
                    Vui lòng chọn một <span className="font-semibold text-gray-700">Chương</span> hoặc <span className="font-semibold text-gray-700">Bài học</span> từ danh sách bên trái để bắt đầu chỉnh sửa.
                </p>
            </div>
        </div>
    );
};
