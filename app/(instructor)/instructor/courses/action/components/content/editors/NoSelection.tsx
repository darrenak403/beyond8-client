import React from "react";
import { BookOpen } from "lucide-react";

interface NoSelectionProps {
    onBackToInfo?: () => void;
}

export const NoSelection: React.FC<NoSelectionProps> = ({ onBackToInfo }) => {
    return (
        <div className="flex-1 flex flex-col bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Tab Switcher */}
                {onBackToInfo && (
                    <div className="mb-8">
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                            <button
                                onClick={onBackToInfo}
                                className="px-6 py-2 text-sm font-medium rounded-full transition-all text-gray-500 hover:text-gray-900"
                            >
                                Thông tin khóa học
                            </button>
                            <button
                                className="px-6 py-2 text-sm font-medium rounded-full transition-all bg-white text-black shadow-sm"
                            >
                                Nội dung khóa học
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center max-w-md">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Chưa có chương nào được chọn
                    </h3>
                    <p className="text-sm text-gray-500">
                        Vui lòng chọn một chương từ danh sách bên trái hoặc tạo chương đầu tiên để bắt đầu.
                    </p>
                </div>
            </div>
        </div>
    );
};
