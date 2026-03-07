"use client";

import { Check, Minus, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const features = [
  { category: "Cốt lõi", name: "Truy cập khóa học", tooltip: "Truy cập vào kho tàng khóa học chất lượng cao" },
  { category: "Cốt lõi", name: "Chứng chỉ hoàn thành", tooltip: "Nhận chứng chỉ sau khi hoàn thành khóa học" },
  { category: "AI & Công cụ", name: "AI Chatbot hỗ trợ", tooltip: "Hỏi đáp 24/7 với trợ lý ảo thông minh" },
  { category: "AI & Công cụ", name: "Phân tích lộ trình học", tooltip: "AI phân tích và đề xuất lộ trình tối ưu" },
  { category: "AI & Công cụ", name: "Chấm điểm bài tập AI", tooltip: "Nhận phản hồi chi tiết ngay lập tức" },
  { category: "Nâng cao", name: "Mentor 1:1", tooltip: "Hỗ trợ trực tiếp từ chuyên gia" },
  { category: "Nâng cao", name: "Tải xuống tài liệu", tooltip: "Học offline mọi lúc mọi nơi" },
];

const plans = [
  { name: "Free", color: "text-gray-500" },
  { name: "Plus", color: "text-blue-600" },
  { name: "Pro", color: "text-purple-600" },
  { name: "Ultra", color: "text-yellow-600" },
];

const comparisonData: Record<string, Record<string, boolean | string>> = {
  "Truy cập khóa học": { Free: "Cơ bản", Plus: "Tất cả", Pro: "Tất cả + VIP", Ultra: "Tất cả + VIP + Sớm" },
  "Chứng chỉ hoàn thành": { Free: false, Plus: true, Pro: true, Ultra: true },
  "AI Chatbot hỗ trợ": { Free: "35 req/tuần", Plus: "50 req/tuần", Pro: "100 req/tuần", Ultra: "200 req/tuần" },
  "Phân tích lộ trình học": { Free: false, Plus: true, Pro: true, Ultra: true },
  "Chấm điểm bài tập AI": { Free: false, Plus: true, Pro: true, Ultra: true },
  "Mentor 1:1": { Free: false, Plus: false, Pro: "1 buổi/tháng", Ultra: "Hàng tuần" },
  "Tải xuống tài liệu": { Free: false, Plus: true, Pro: true, Ultra: true },
};

export function ComparisonTable() {
  return (
    <section className="py-24 px-4 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
      
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">So Sánh Tính Năng Chi Tiết</h2>

        <div className="overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-xl shadow-purple-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b-2 border-gray-200">
                  <th className="py-8 px-6 text-gray-900 font-bold w-1/3 min-w-[200px] text-lg uppercase tracking-wider">Tính năng</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={`py-8 px-6 text-xl font-black text-center w-1/6 min-w-[120px] ${plan.color}`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors last:border-0 odd:bg-gray-50/30">
                    <td className="py-5 px-6 text-gray-800 font-semibold flex items-center gap-2.5">
                      {feature.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-purple-500 transition-colors cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white border-0">
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    {plans.map((plan) => {
                      const value = comparisonData[feature.name][plan.name];
                      return (
                        <td key={plan.name} className="py-5 px-6 text-center text-sm md:text-base border-l border-gray-100/50">
                          {value === true ? (
                            <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600 font-bold" />
                                </div>
                            </div>
                          ) : value === false ? (
                            <div className="flex justify-center"><Minus className="w-5 h-5 text-gray-300" /></div>
                          ) : (
                            <span className="text-gray-900 font-bold bg-gray-100/80 px-3 py-1 rounded-full text-xs md:text-sm inline-block">
                                {value as string}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
