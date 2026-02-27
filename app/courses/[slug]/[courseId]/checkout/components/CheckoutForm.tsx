"use client";

import { useState } from "react";
import { QrCode, Copy, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  slug: string;
  courseId: string;
}

export default function CheckoutForm({ slug, courseId }: CheckoutFormProps) {
  const [isManual, setIsManual] = useState(false);
  const [isLayoutSplit, setIsLayoutSplit] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    // toast.success(`Đã sao chép ${field}`); // Uncomment if toast is available
    setTimeout(() => setCopiedField(null), 2000);
  };

  const onManualPayment = () => {
      setIsLayoutSplit(true);
      setIsManual(true);
  }

  const onBackToQR = () => {
      setIsManual(false);
      // setIsLayoutSplit(false) will be called AFTER animation exits
  }

  return (
      <div className="w-full max-w-5xl mx-auto min-h-[600px] flex flex-col justify-center">
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
            className={`grid gap-8 items-center ${isLayoutSplit ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
        >
            {/* Left Column: QR Code */}
            <motion.div 
                layout
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                className={`flex flex-col items-center justify-center ${!isLayoutSplit ? "py-10" : ""}`}
            >
              <motion.div 
                  layout
                  className="relative rounded-3xl overflow-hidden border border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80"
                  animate={{ 
                      scale: isLayoutSplit ? 1 : 1.1,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                  {/* Header usually in scanner, but we keep it clean */}
                  <div className={`flex flex-col items-center justify-center bg-slate-900 transition-all duration-700 ease-in-out ${isLayoutSplit ? "w-64 h-64" : "w-80 h-80"}`}>
                      <QrCode className={`transition-all duration-700 ease-in-out ${isLayoutSplit ? "w-32 h-32" : "w-40 h-40"} text-white/10`} />
                      
                      {/* Central Logo */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className={`bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-700 ease-in-out ${isLayoutSplit ? "w-16 h-16" : "w-20 h-20"}`}>
                              <span className="font-extrabold text-blue-600 text-sm tracking-tighter">VNPAY</span>
                          </div>
                      </div>

                      {/* Scanning Animation */}
                      <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm animate-[scan_2.5s_ease-in-out_infinite] top-0 z-0 opacity-80" />
                  </div>
                  
                  {/* Decorative corners */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white/30 rounded-tl-xl pointer-events-none" />
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white/30 rounded-tr-xl pointer-events-none" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white/30 rounded-bl-xl pointer-events-none" />
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white/30 rounded-br-xl pointer-events-none" />

                  <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-400/80 uppercase tracking-widest">Quét để thanh toán</span>
                  </div>
              </motion.div>

               <AnimatePresence mode="popLayout">
                {!isManual && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 flex flex-col items-center gap-4"
                    >
                        <h3 className="text-2xl font-bold text-gray-900">Thanh toán qua mã QR</h3>
                        {/* <p className="text-gray-500 text-center max-w-sm">
                            Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã.
                        </p> */}
                        <Button 
                            onClick={onManualPayment}
                            variant="outline"
                            className="mt-2 h-12 px-8 rounded-full border-2 border-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta/5 hover:border-brand-magenta/20 hover:text-brand-magenta font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Thanh toán thủ công
                        </Button>
                    </motion.div>
                )}
               </AnimatePresence>
            </motion.div>

            {/* Right Column: Info & Instructions (Only visible when manual) */}
            <AnimatePresence mode="wait" onExitComplete={() => setIsLayoutSplit(false)}>
            {isManual && (
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2, ease: "easeOut" } }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3, ease: "easeIn" } }}
                    className="space-y-6 p-6 rounded-3xl border border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80"
                >   
                   {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-magenta/5 text-brand-magenta font-semibold text-sm mb-2 border border-brand-magenta/10">
                    <QrCode className="w-4 h-4" />
                    <span>Cổng thanh toán VNPay</span>
                 </div>            */}
                    <div className="flex items-center justify-between mb-2">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={onBackToQR}
                            className="text-gray-400 hover:text-brand-magenta hover:bg-white -ml-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại QR
                        </Button>
                        <span className="text-xs font-bold bg-brand-magenta/5 text-brand-magenta px-3 py-1 rounded-full uppercase tracking-wider border border-brand-magenta/10">Chuyển khoản 24/7</span>
                    </div>

                    {/* <div className="space-y-1 pb-4 border-b border-brand-magenta/10">
                        <span className="text-sm text-gray-500 font-medium">Tổng thanh toán</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold text-4xl text-brand-magenta">599.000</span>
                            <span className="text-xl text-gray-500 font-medium">đ</span>
                        </div>
                    </div> */}

                    <div className="space-y-5">
                       {/* Bank Name */}
                       <div className="space-y-1.5">
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Ngân hàng</span>
                            <div className="flex items-center justify-between p-3 bg-brand-magenta/5 rounded-xl border border-brand-magenta/10 group hover:border-brand-magenta/30 transition-colors">
                                <span className="font-bold text-gray-900">MB Bank (Quân Đội)</span>
                                <div className="h-6 w-6 rounded-full bg-brand-magenta flex items-center justify-center text-white text-[10px] font-bold">MB</div>
                            </div>
                       </div>

                       {/* Account Number */}
                       <div className="space-y-1.5">
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Số tài khoản</span>
                            <div className="flex items-center justify-between p-3 bg-brand-magenta/5 rounded-xl border border-brand-magenta/10 group hover:border-brand-magenta/30 transition-colors">
                                <span className="font-mono text-lg font-bold text-gray-900 tracking-wide">9999 8888 6666</span>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-gray-400 hover:text-brand-magenta hover:bg-brand-magenta/10"
                                    onClick={() => handleCopy("999988886666", "Số tài khoản")}
                                >
                                    {copiedField === "Số tài khoản" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                       </div>

                       {/* Account Name */}
                        <div className="space-y-1.5">
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Chủ tài khoản</span>
                            <div className="flex items-center justify-between p-3 bg-brand-magenta/5 rounded-xl border border-brand-magenta/10 group hover:border-brand-magenta/30 transition-colors">
                                <span className="font-bold text-gray-900 uppercase">CÔNG TY CP BEYOND 8</span>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-gray-400 hover:text-brand-magenta hover:bg-brand-magenta/10"
                                    onClick={() => handleCopy("CÔNG TY CP BEYOND 8", "Tên chủ tài khoản")}
                                >
                                    {copiedField === "Tên chủ tài khoản" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                       </div>

                       {/* Content */}
                        <div className="space-y-1.5">
                            <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Nội dung chuyển khoản</span>
                            <div className="flex items-center justify-between p-3 bg-brand-magenta/10 rounded-xl border border-brand-magenta/20 group hover:border-brand-magenta/40 transition-colors">
                                <span className="font-mono text-brand-magenta font-bold">BY8 20240201</span>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-brand-magenta/70 hover:text-brand-magenta hover:bg-brand-magenta/10"
                                    onClick={() => handleCopy("BY8 20240201", "Nội dung")}
                                >
                                    {copiedField === "Nội dung" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                       </div>
                    </div>
                    
                    <div className="pt-2 text-center">
                        <p className="text-xs text-muted-foreground">
                            Hệ thống sẽ tự động kích hoạt khóa học sau khi nhận được thanh toán.
                        </p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
      </div>
  );
}
