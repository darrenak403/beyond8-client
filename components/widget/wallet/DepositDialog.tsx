"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { useChargeWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DepositDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    hideTrigger?: boolean;
    triggerClassName?: string;
}

export function DepositDialog({ open, onOpenChange, hideTrigger, triggerClassName }: DepositDialogProps = {}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;
    const [amount, setAmount] = useState<string>("");
    const { chargeWallet, isPending } = useChargeWallet();
    const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(null);
    const [pendingDialogOpen, setPendingDialogOpen] = useState(false);

    const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

    const navigateToPayment = (url: string) => {
        sessionStorage.setItem("isWalletTopUp", "true");
        sessionStorage.setItem("walletTopUpReturnUrl", window.location.pathname);
        window.location.href = url;
    };

    const handleDeposit = async () => {
        const numAmount = parseInt(amount.replace(/\D/g, ""), 10);

        if (isNaN(numAmount) || numAmount < 10000) {
            toast.error("Số tiền nạp không hợp lệ. Tối thiểu là 10.000 VNĐ.");
            return;
        }

        try {
            const response = await chargeWallet({ amount: numAmount });
            if (response?.isSuccess && response.data?.paymentUrl) {
                if (response.data.isPending) {
                    setPendingPaymentUrl(response.data.paymentUrl);
                    setIsOpen(false);
                    setPendingDialogOpen(true);
                } else {
                    navigateToPayment(response.data.paymentUrl);
                }
            } else {
                toast.error(response?.message || "Không thể tạo liên kết thanh toán.");
            }
        } catch (error) {
            console.error(error);
            // useChargeWallet hook already shows error toast
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value) {
            setAmount(parseInt(value, 10).toLocaleString());
        } else {
            setAmount("");
        }
    };

    return (
        <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!hideTrigger && (
                <DialogTrigger asChild>
                    <Button variant="outline" className={cn("rounded-full hover:bg-gray-50 hover:text-black gap-2 border-2 transition-all", triggerClassName)}>
                        <PlusCircle className="h-4 w-4" />
                        Nạp tiền
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl">
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                            <PlusCircle className="h-6 w-6 text-violet-600" />
                            Nạp tiền vào ví
                        </DialogTitle>
                        <DialogDescription className="mt-2">
                            Chọn hoặc nhập số tiền bạn muốn nạp qua cổng thanh toán VNPay.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Mệnh giá nạp nhanh</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {presetAmounts.map((preset) => {
                                const isSelected = amount === preset.toLocaleString();
                                return (
                                    <Button
                                        key={preset}
                                        type="button"
                                        variant="outline"
                                        onClick={() => setAmount(preset.toLocaleString())}
                                        className={`h-auto py-2.5 transition-all ${isSelected
                                            ? "border-violet-600 bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-600 hover:bg-violet-50 hover:text-violet-700"
                                            : "hover:border-violet-300 hover:bg-slate-50 text-gray-600 border-gray-200 hover:text-violet-600 cursor-pointer"
                                            }`}
                                    >
                                        <span className="font-medium">{preset.toLocaleString()} đ</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Hoặc nhập số tiền khác (VNĐ)</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Tối thiểu 10.000"
                                autoComplete="off"
                                className="pl-4 pr-12 py-6 text-lg font-semibold rounded-xl border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 transition-shadow"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 font-medium">
                                VNĐ
                            </div>
                        </div>
                        {amount && parseInt(amount.replace(/\D/g, ""), 10) < 10000 && (
                            <p className="text-sm text-red-500 font-medium mt-1">Số tiền tối thiểu là 10.000 VNĐ</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50/50 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isPending}
                        className="sm:w-auto w-full rounded-xl border-gray-300 hover:bg-gray-100 font-medium"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDeposit}
                        disabled={isPending || !amount || parseInt(amount.replace(/\D/g, ""), 10) < 10000}
                        className="sm:w-auto w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shadow-sm shadow-violet-200"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : null}
                        Thanh toán qua VNPay
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <AlertDialog open={pendingDialogOpen} onOpenChange={setPendingDialogOpen}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        Bạn đang có giao dịch chưa xử lý
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Bạn còn một giao dịch nạp tiền đang chờ xử lý. Vui lòng hoàn tất giao dịch đó trước khi tạo giao dịch mới. Bạn có muốn tiếp tục thanh toán giao dịch đang chờ không?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Đóng</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => pendingPaymentUrl && navigateToPayment(pendingPaymentUrl)}
                        className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                    >
                        Tiếp tục thanh toán
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
