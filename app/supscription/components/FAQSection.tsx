"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Tôi có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào không?",
    answer: "Có, bạn có thể thay đổi gói dịch vụ của mình bất kỳ lúc nào trong phần cài đặt tài khoản. Việc nâng cấp sẽ có hiệu lực ngay lập tức, trong khi hạ cấp sẽ có hiệu lực vào chu kỳ thanh toán tiếp theo."
  },
  {
    question: "Gói miễn phí có giới hạn thời gian không?",
    answer: "Gói Miễn phí (Free) của chúng tôi có hiệu lực trải nghiệm trong 7 ngày đầu tiên sau khi đăng ký, với giới hạn 35 lượt hỏi đáp AI."
  },
  {
    question: "Tính năng AI hỗ trợ hoạt động như thế nào?",
    answer: "AI của chúng tôi sử dụng các mô hình ngôn ngữ tiên tiến để phân tích câu hỏi của bạn, gợi ý lộ trình học tập, và giải đáp thắc mắc ngay lập tức, giống như một gia sư riêng 24/7."
  },
  {
    question: "Tôi có được hoàn tiền nếu không hài lòng không?",
    answer: "Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày đầu tiên nếu bạn gặp lỗi kỹ thuật nghiêm trọng không thể khắc phục. Vui lòng liên hệ đội ngũ hỗ trợ để biết thêm chi tiết."
  },
  {
    question: "Phương thức thanh toán nào được chấp nhận?",
    answer: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (Momo, ZaloPay) và chuyển khoản ngân hàng."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 relative px-4">
         <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Câu Hỏi Thường Gặp</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-xl bg-white/50 px-4 md:px-6">
                        <AccordionTrigger className="text-gray-800 hover:text-purple-600 text-left py-4 md:py-6 text-base md:text-lg font-medium transition-colors">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-base pb-6 leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
         </div>
    </section>
  );
}
