"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Coupon, CouponType, CreateCouponRequest, UpdateCouponRequest } from "@/lib/api/services/fetchCoupon"
import { useCreateCoupon, useUpdateCoupon } from "@/hooks/useCoupon"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, RefreshCcw, Ticket, Percent, DollarSign, Tag, Users, CalendarDays, CheckCircle2, CalendarIcon, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"


// Schema validation
const formSchema = z.object({
    code: z.string().min(3, "Mã phải có ít nhất 3 ký tự").max(20, "Mã tối đa 20 ký tự"),
    description: z.string().min(1, "Vui lòng nhập mô tả cho mã giảm giá"),
    type: z.nativeEnum(CouponType),
    value: z.coerce.number().min(1, "Giá trị giảm phải lớn hơn hoặc bằng 1"),
    minOrderAmount: z.coerce.number().min(0, "Đơn hàng tối thiểu không được âm").nullable().optional(),
    maxDiscountAmount: z.coerce.number().min(1, "Giảm tối đa phải lớn hơn hoặc bằng 1").nullable().optional(),
    usageLimit: z.coerce.number().min(1, "Tổng lượt sử dụng phải lớn hơn hoặc bằng 1").nullable().optional(),
    usagePerUser: z.coerce.number().min(1, "Lượt dùng / khách phải lớn hơn hoặc bằng 1").nullable().optional(),
    validFrom: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày bắt đầu không hợp lệ",
    }),
    validTo: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày kết thúc không hợp lệ",
    }),
    isActive: z.boolean(),
}).refine((data) => {
    if (data.type === CouponType.Percentage && data.value > 100) {
        return false;
    }
    return true;
}, {
    message: "Giá trị phần trăm không được vượt quá 100%",
    path: ["value"],
}).refine((data) => {
    const from = new Date(data.validFrom);
    const to = new Date(data.validTo);
    return to > from;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validTo"],
});

type FormValues = z.infer<typeof formSchema>;

interface CouponDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "add" | "edit"
    initialData?: Coupon | null
}

export function CouponDialog({ open, onOpenChange, mode, initialData }: CouponDialogProps) {
    const { createCoupon, isPending: isCreating } = useCreateCoupon();
    const { updateCoupon, isPending: isUpdating } = useUpdateCoupon();

    const isPending = isCreating || isUpdating;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            description: "",
            type: CouponType.Percentage,
            value: 0,
            minOrderAmount: null,
            maxDiscountAmount: null,
            usageLimit: null,
            usagePerUser: null,
            validFrom: "", // Set in useEffect
            validTo: "",   // Set in useEffect
            isActive: true,
        },
    });

    const couponType = form.watch("type");
    const [percentStep, setPercentStep] = useState<1 | 5 | 10 | 15>(1);

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                form.reset({
                    code: initialData.code,
                    description: initialData.description || "",
                    type: initialData.type as CouponType,
                    value: initialData.value,
                    minOrderAmount: initialData.minOrderAmount,
                    maxDiscountAmount: initialData.maxDiscountAmount,
                    usageLimit: initialData.usageLimit,
                    usagePerUser: initialData.usagePerUser,
                    validFrom: new Date(initialData.validFrom).toISOString().slice(0, 16),
                    validTo: new Date(initialData.validTo).toISOString().slice(0, 16),
                    isActive: initialData.isActive,
                });
            } else {
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

                form.reset({
                    code: "",
                    description: "",
                    type: CouponType.Percentage,
                    value: 0,
                    minOrderAmount: 0,
                    maxDiscountAmount: 0,
                    usageLimit: 100,
                    usagePerUser: 1,
                    validFrom: now.toISOString().slice(0, 16),
                    validTo: nextWeek.toISOString().slice(0, 16),
                    isActive: true,
                });
            }
        }
    }, [open, mode, initialData, form]);

    const generateCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 10;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        form.setValue('code', result);
    };

    const onSubmit = async (values: FormValues) => {
        try {
            const payloadCommon = {
                code: values.code,
                description: values.description || null,
                isActive: values.isActive,
                maxDiscountAmount: values.maxDiscountAmount || 0,
                minOrderAmount: values.minOrderAmount || 0,
                type: values.type,
                usageLimit: values.usageLimit || 0,
                usagePerUser: values.usagePerUser || 0,
                validFrom: new Date(values.validFrom).toISOString(),
                validTo: new Date(values.validTo).toISOString(),
                value: values.value,
            };

            if (mode === "add") {
                const res = await createCoupon(payloadCommon as CreateCouponRequest);
                if (res.isSuccess) {
                    onOpenChange(false);
                }
            } else if (mode === "edit" && initialData) {
                const res = await updateCoupon({
                    id: initialData.id,
                    coupon: payloadCommon as UpdateCouponRequest
                });
                if (res.isSuccess) {
                    onOpenChange(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "flex flex-col p-0 gap-0 transition-all duration-300 overflow-hidden max-w-6xl h-[85vh]",
                )}
            >
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                {mode === "add" ? "Tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                {mode === "add"
                                    ? "Thiết lập các thông số khuyến mãi cho khóa học"
                                    : "Cập nhật thông tin và điều kiện của mã giảm giá"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                {/* Column 1: Basic Information */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <Tag className="w-4 h-4 text-gray-500" />
                                                Thông tin cơ bản
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-4 flex-1">

                                            <FormField
                                                control={form.control}
                                                name="code"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-sm font-medium text-gray-700">Mã giảm giá <span className="text-red-500">*</span></FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="VD: SUMMER2024"
                                                                    {...field}
                                                                    disabled={mode === "edit"}
                                                                    className="h-11 uppercase font-mono tracking-wider font-semibold bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                                    maxLength={20}
                                                                />
                                                            </FormControl>
                                                            {mode === "add" && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={generateCode}
                                                                    className="h-11 w-11 shrink-0 border-gray-200 hover:bg-gray-50 hover:text-purple-600"
                                                                    title="Tạo mã ngẫu nhiên"
                                                                >
                                                                    <RefreshCcw className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-sm font-medium text-gray-700">Mô tả <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Mô tả ngắn về chương trình khuyến mãi..."
                                                                {...field}
                                                                value={field.value || ''}
                                                                className="min-h-[100px] resize-none bg-white border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

                                            <FormField
                                                control={form.control}
                                                name="isActive"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-gray-50/50 border-gray-200 mt-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">Kích hoạt ngay</FormLabel>
                                                            <FormDescription className="text-xs text-gray-500">
                                                                Mã sẽ có hiệu lực ngay sau khi tạo
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 2: Value & Type */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                Giá trị khuyến mãi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-6 flex-1">
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-sm font-medium text-gray-700">Loại giảm giá</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="grid grid-cols-2 gap-4"
                                                            >
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value={CouponType.Percentage} className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-transparent bg-gray-50 p-4 hover:bg-purple-50 hover:text-purple-900 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-purple-700 cursor-pointer transition-all shadow-sm">
                                                                        <Percent className="mb-2 h-6 w-6 text-gray-400 peer-data-[state=checked]:text-purple-500" />
                                                                        <div className="text-center font-semibold text-sm">Theo %</div>
                                                                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value={CouponType.FixedAmount} className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-transparent bg-gray-50 p-4 hover:bg-green-50 hover:text-green-900 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-green-700 cursor-pointer transition-all shadow-sm">
                                                                        <DollarSign className="mb-2 h-6 w-6 text-gray-400 peer-data-[state=checked]:text-green-500" />
                                                                        <div className="text-center font-semibold text-sm">Số tiền cố định</div>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="value"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <FormLabel className="text-sm font-medium text-gray-700 shrink-0">Giá trị giảm <span className="text-red-500">*</span></FormLabel>
                                                                <div className="flex items-center gap-2">
                                                                    {couponType === CouponType.Percentage && (
                                                                        <div className="flex items-center gap-1.5">
                                                                            {([1, 5, 10, 15] as const).map((s) => (
                                                                                <Button
                                                                                    key={s}
                                                                                    type="button"
                                                                                    size="sm"
                                                                                    onClick={() => setPercentStep(s)}
                                                                                    className={cn(
                                                                                        "h-6 px-2.5 text-xs rounded-full transition-all",
                                                                                        percentStep === s
                                                                                            ? "bg-purple-600 text-white border-transparent hover:bg-purple-700"
                                                                                            : "bg-white border border-gray-200 text-gray-500 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                                                                    )}
                                                                                >
                                                                                    {s}%
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-lg font-bold text-purple-600">
                                                                        {field.value ?? 0}{couponType === CouponType.Percentage ? "%" : "đ"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {couponType === CouponType.Percentage ? (
                                                                <>
                                                                    <div className="flex items-center gap-3">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="h-8 w-8 shrink-0 rounded-full border-gray-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                                                            onClick={() => field.onChange(Math.max(0, (Number(field.value) || 0) - percentStep))}
                                                                            disabled={(Number(field.value) || 0) <= 0}
                                                                        >
                                                                            <span className="text-base font-bold">−</span>
                                                                        </Button>
                                                                        <FormControl>
                                                                            <Slider
                                                                                min={0}
                                                                                max={100}
                                                                                step={1}
                                                                                value={[Number(field.value) || 0]}
                                                                                onValueChange={(vals) => field.onChange(vals[0])}
                                                                                className="py-2"
                                                                            />
                                                                        </FormControl>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="h-8 w-8 shrink-0 rounded-full border-gray-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                                                                            onClick={() => field.onChange(Math.min(100, (Number(field.value) || 0) + percentStep))}
                                                                            disabled={(Number(field.value) || 0) >= 100}
                                                                        >
                                                                            <span className="text-base font-bold">+</span>
                                                                        </Button>
                                                                    </div>
                                                                    <div className="flex justify-between text-xs text-gray-400 px-11">
                                                                        <span>0%</span>
                                                                        <span>25%</span>
                                                                        <span>50%</span>
                                                                        <span>75%</span>
                                                                        <span>100%</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <Input
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            {...field}
                                                                            value={field.value ?? ''}
                                                                            onChange={(e) => {
                                                                                let val = e.target.value.replace(/[^0-9]/g, "");
                                                                                if (val.length > 1 && val.startsWith("0")) {
                                                                                    val = val.replace(/^0+/, "");
                                                                                    if (val === "") val = "0";
                                                                                }
                                                                                field.onChange(val);
                                                                            }}
                                                                            className="h-11 pr-12 font-medium bg-white border-gray-200 text-lg"
                                                                            placeholder="0"
                                                                        />
                                                                        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-12 pointer-events-none text-muted-foreground font-semibold">
                                                                            đ
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                            )}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                {couponType === CouponType.Percentage && (
                                                    <FormField
                                                        control={form.control}
                                                        name="maxDiscountAmount"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <FormLabel className="text-sm font-medium text-gray-700">Giảm tối đa</FormLabel>
                                                                    <span className="text-xs text-muted-foreground uppercase">Tùy chọn</span>
                                                                </div>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <Input
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            {...field}
                                                                            value={field.value ?? ''}
                                                                            onChange={(e) => {
                                                                                let val = e.target.value.replace(/[^0-9]/g, "");
                                                                                if (val.length > 1 && val.startsWith("0")) {
                                                                                    val = val.replace(/^0+/, "");
                                                                                    if (val === "") val = "0";
                                                                                }
                                                                                field.onChange(val);
                                                                            }}
                                                                            className="h-11 bg-white border-gray-200 pr-10"
                                                                            placeholder="Không giới hạn"
                                                                        />
                                                                        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 pointer-events-none text-muted-foreground text-sm">
                                                                            đ
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}

                                                <FormField
                                                    control={form.control}
                                                    name="minOrderAmount"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <FormLabel className="text-sm font-medium text-gray-700">Đơn hàng tối thiểu</FormLabel>
                                                                <span className="text-xs text-muted-foreground uppercase">Tùy chọn</span>
                                                            </div>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        {...field}
                                                                        value={field.value ?? ''}
                                                                        onChange={(e) => {
                                                                            let val = e.target.value.replace(/[^0-9]/g, "");
                                                                            if (val.length > 1 && val.startsWith("0")) {
                                                                                val = val.replace(/^0+/, "");
                                                                                if (val === "") val = "0";
                                                                            }
                                                                            field.onChange(val);
                                                                        }}
                                                                        className="h-11 bg-white border-gray-200 pr-10"
                                                                        placeholder="0"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10 pointer-events-none text-muted-foreground text-sm">
                                                                        đ
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 3: Limit & Validity */}
                                <div className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                                Thời gian & Giới hạn
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 space-y-6 flex-1">
                                            <div className="space-y-4">
                                                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian hiệu lực</FormLabel>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="validFrom"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2">
                                                                <FormLabel className="text-sm text-gray-700">Bắt đầu</FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal h-11 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 hover:bg-white hover:text-black",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                {field.value ? (
                                                                                    format(new Date(field.value), "dd/MM/yyyy HH:mm")
                                                                                ) : (
                                                                                    <span>Chọn ngày bắt đầu</span>
                                                                                )}
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-4" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value ? new Date(field.value) : undefined}
                                                                            onSelect={(date) => {
                                                                                if (date) {
                                                                                    const existing = field.value ? new Date(field.value) : new Date();
                                                                                    date.setHours(existing.getHours(), existing.getMinutes());
                                                                                    field.onChange(date.toISOString());
                                                                                } else {
                                                                                    field.onChange("");
                                                                                }
                                                                            }}
                                                                            initialFocus
                                                                        />
                                                                        <div className="p-3 border-t border-border mt-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                                <Input
                                                                                    type="time"
                                                                                    value={field.value ? format(new Date(field.value), "HH:mm") : "00:00"}
                                                                                    onChange={(e) => {
                                                                                        if (field.value && e.target.value) {
                                                                                            const date = new Date(field.value);
                                                                                            const [hours, minutes] = e.target.value.split(":");
                                                                                            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                                                                                            field.onChange(date.toISOString());
                                                                                        }
                                                                                    }}
                                                                                    className="h-8 w-full"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="validTo"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2">
                                                                <FormLabel className="text-sm text-gray-700">Kết thúc</FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal h-11 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 hover:bg-white hover:text-black",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                {field.value ? (
                                                                                    format(new Date(field.value), "dd/MM/yyyy HH:mm")
                                                                                ) : (
                                                                                    <span>Chọn ngày kết thúc</span>
                                                                                )}
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-4" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value ? new Date(field.value) : undefined}
                                                                            onSelect={(date) => {
                                                                                if (date) {
                                                                                    const existing = field.value ? new Date(field.value) : new Date();
                                                                                    date.setHours(existing.getHours(), existing.getMinutes());
                                                                                    field.onChange(date.toISOString());
                                                                                } else {
                                                                                    field.onChange("");
                                                                                }
                                                                            }}
                                                                            initialFocus
                                                                        />
                                                                        <div className="p-3 border-t border-border mt-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                                <Input
                                                                                    type="time"
                                                                                    value={field.value ? format(new Date(field.value), "HH:mm") : "00:00"}
                                                                                    onChange={(e) => {
                                                                                        if (field.value && e.target.value) {
                                                                                            const date = new Date(field.value);
                                                                                            const [hours, minutes] = e.target.value.split(":");
                                                                                            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                                                                                            field.onChange(date.toISOString());
                                                                                        }
                                                                                    }}
                                                                                    className="h-8 w-full"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Giới hạn sử dụng</FormLabel>
                                                <div className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="usageLimit"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <FormLabel className="text-sm text-gray-700">Tổng lượt sử dụng</FormLabel>
                                                                    <Users className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        {...field}
                                                                        value={field.value ?? ''}
                                                                        onChange={(e) => {
                                                                            let val = e.target.value.replace(/[^0-9]/g, "");
                                                                            if (val.length > 1 && val.startsWith("0")) {
                                                                                val = val.replace(/^0+/, "");
                                                                                if (val === "") val = "0";
                                                                            }
                                                                            field.onChange(val);
                                                                        }}
                                                                        placeholder="Không giới hạn"
                                                                        className="h-11 bg-white border-gray-200"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="usagePerUser"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <FormLabel className="text-sm text-gray-700">Lượt dùng / Khách</FormLabel>
                                                                    <Tag className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        {...field}
                                                                        value={field.value ?? ''}
                                                                        onChange={(e) => {
                                                                            let val = e.target.value.replace(/[^0-9]/g, "");
                                                                            if (val.length > 1 && val.startsWith("0")) {
                                                                                val = val.replace(/^0+/, "");
                                                                                if (val === "") val = "0";
                                                                            }
                                                                            field.onChange(val);
                                                                        }}
                                                                        placeholder="1"
                                                                        className="h-11 bg-white border-gray-200"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-4 border-t bg-white flex-shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-black">
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200 px-6 min-w-[140px]"
                            >
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                {mode === "add" ? "Tạo mã ngay" : "Lưu thay đổi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
