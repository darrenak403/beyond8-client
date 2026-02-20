"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Coupon, CouponType, CreateCouponInstructorRequest, UpdateCouponRequest } from "@/lib/api/services/fetchCoupon"
import { useCreateCouponForCourse, useUpdateCoupon } from "@/hooks/useCoupon"

import { useGetCourseByInstructor } from "@/hooks/useCourse"
import { CourseLevel } from "@/lib/api/services/fetchCourse"
import { useAuth } from "@/hooks/useAuth"
import { useUserProfile } from "@/hooks/useUserProfile"

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
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, RefreshCcw, Ticket, Percent, DollarSign, Tag, Users, Clock, BookOpen, AlertTriangle, CalendarDays, CheckCircle2, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"


// Schema validation
const formSchema = z.object({
    code: z.string().min(3, "Mã phải có ít nhất 3 ký tự").max(20, "Mã tối đa 20 ký tự"),
    description: z.string().nullable(),
    type: z.nativeEnum(CouponType),
    value: z.coerce.number().min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
    minOrderAmount: z.coerce.number().min(0).nullable().optional(),
    maxDiscountAmount: z.coerce.number().min(0).nullable().optional(),
    usageLimit: z.coerce.number().min(0).nullable().optional(),
    usagePerUser: z.coerce.number().min(0).nullable().optional(),
    validFrom: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày bắt đầu không hợp lệ",
    }),
    validTo: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày kết thúc không hợp lệ",
    }),
    isActive: z.boolean(),
    // Instructor specific
    applicableCourseId: z.string().min(1, "Vui lòng chọn khóa học áp dụng"),
}).refine((data) => {
    const from = new Date(data.validFrom);
    const to = new Date(data.validTo);
    return to > from;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validTo"],
});

type FormValues = z.infer<typeof formSchema>;

interface InstructorCouponDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "add" | "edit"
    initialData?: Coupon | null
    preSelectedCourseId?: string | null
}

export function InstructorCouponDialog({
    open,
    onOpenChange,
    mode,
    initialData,
    preSelectedCourseId
}: InstructorCouponDialogProps) {
    const { createCoupon, isPending: isCreating } = useCreateCouponForCourse();
    const { updateCoupon, isPending: isUpdating } = useUpdateCoupon();
    const { courses } = useGetCourseByInstructor({
        pageSize: 100,
        pageNumber: 1,
        isDescending: true,
        level: CourseLevel.All
    }); // Fetch enough courses
    const { user } = useAuth();
    const { userProfile, isLoading: isLoadingProfile } = useUserProfile();

    const isPending = isCreating || isUpdating || isLoadingProfile;
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
            validFrom: "",
            validTo: "",
            isActive: true,
            applicableCourseId: preSelectedCourseId || "",
        },
    });

    const couponType = form.watch("type");

    // Check if coupon belongs to instructor (has applicableCourseId)
    const isGlobalCoupon = initialData && !initialData.applicableCourseId;

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
                    applicableCourseId: initialData.applicableCourseId || "",
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
                    applicableCourseId: preSelectedCourseId || "",
                });
            }
        }
    }, [open, mode, initialData, form, preSelectedCourseId]);

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
                const instructorId = user?.id || userProfile?.id;
                if (!instructorId) {
                    console.error("User/Instructor ID not found");
                    return;
                }
                const res = await createCoupon({
                    ...payloadCommon,
                    applicableCourseId: values.applicableCourseId,
                    instructorId: instructorId
                } as CreateCouponInstructorRequest);
                if (res.isSuccess) {
                    onOpenChange(false);
                }
            } else if (mode === "edit" && initialData) {
                // Instructor can only update their own coupons
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
                        <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                {mode === "add" ? "Tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm mt-0.5">
                                {mode === "add"
                                    ? "Thiết lập các thông số khuyến mãi cho khóa học của bạn"
                                    : "Cập nhật thông tin và điều kiện của mã giảm giá"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
                            {isGlobalCoupon && mode === "edit" && (
                                <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200 text-yellow-800 text-sm flex items-start gap-3 mb-6">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Lưu ý:</strong> Đây là mã giảm giá hệ thống (không gắn với khóa học cụ thể). Bạn có thể không có quyền chỉnh sửa đầy đủ.
                                    </div>
                                </div>
                            )}

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
                                            {/* Course Selection */}
                                            <FormField
                                                control={form.control}
                                                name="applicableCourseId"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-base font-semibold text-gray-900">Khóa học áp dụng <span className="text-red-500">*</span></FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            value={field.value}
                                                            disabled={mode === "edit" || !!preSelectedCourseId}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 bg-white border-gray-200 focus:ring-orange-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                                        <SelectValue placeholder="Chọn khóa học" />
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {courses.map(course => (
                                                                    <SelectItem key={course.id} value={course.id}>
                                                                        {course.title}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator />

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
                                                                    className="h-11 uppercase font-mono tracking-wider font-semibold bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                                                                    className="h-11 w-11 shrink-0 border-gray-200 hover:bg-gray-50 hover:text-orange-600"
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
                                                        <FormLabel className="text-sm font-medium text-gray-700">Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Mô tả ngắn về chương trình khuyến mãi..."
                                                                {...field}
                                                                value={field.value || ''}
                                                                className="h-11 bg-white border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

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
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-transparent bg-gray-50 p-4 hover:bg-orange-50 hover:text-orange-900 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-orange-700 cursor-pointer transition-all shadow-sm">
                                                                        <Percent className="mb-2 h-6 w-6 text-gray-400 peer-data-[state=checked]:text-orange-500" />
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
                                                        <FormItem className="space-y-2">
                                                            <FormLabel className="text-sm font-medium text-gray-700">Giá trị giảm <span className="text-red-500">*</span></FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        className="h-11 pr-12 font-medium bg-white border-gray-200 text-lg"
                                                                        placeholder="0"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 flex items-center justify-center w-12 pointer-events-none text-muted-foreground font-semibold bg-gray-50 border-l h-full rounded-r-md">
                                                                        {couponType === CouponType.Percentage ? "%" : "đ"}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
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
                                                                            type="number"
                                                                            {...field}
                                                                            value={field.value ?? ''}
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
                                                                        type="number"
                                                                        {...field}
                                                                        value={field.value ?? ''}
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
                                                                                    "w-full justify-start text-left font-normal h-11 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 hover:bg-white hover:text-black",
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
                                                                                    "w-full justify-start text-left font-normal h-11 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 hover:bg-white hover:text-black",
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
                                                                        type="number"
                                                                        {...field}
                                                                        value={field.value ?? ''}
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
                                                                        type="number"
                                                                        {...field}
                                                                        value={field.value ?? ''}
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
                                className="rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200 px-6 min-w-[140px]"
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
