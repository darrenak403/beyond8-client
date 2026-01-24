import { useState } from "react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ExternalLink, Facebook, Linkedin, Globe, Calendar, FileText, CreditCard, User, GraduationCap, Briefcase, Award } from "lucide-react";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { InstructorRegistrationResponse, VerificationStatus } from "@/lib/api/services/fetchInstructorRegistration";

import { useIsMobile } from "@/hooks/useMobile";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { useBanks } from "@/hooks/useBank";

interface RegistrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    registration: InstructorRegistrationResponse | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function RegistrationDialog({
    open,
    onOpenChange,
    registration,
    onApprove,
    onReject,
}: RegistrationDialogProps) {
    const isMobile = useIsMobile();
    const { banks } = useBanks();
    const [activeTab, setActiveTab] = useState("info");

    if (!registration) return null;

    const { user } = registration;

    const bankLogo = registration.bankInfo ? banks?.find(b =>
        b.shortName === registration.bankInfo?.bankName ||
        b.short_name === registration.bankInfo?.bankName ||
        b.name === registration.bankInfo?.bankName ||
        b.code === registration.bankInfo?.bankName
    )?.logo : null;

    const tabs = [
        { id: "info", label: "Thông tin chung", icon: User },
        { id: "financial", label: "Tài chính", icon: CreditCard },
        { id: "documents", label: "Tài liệu xác minh", icon: FileText },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${isMobile ? "max-w-full w-full h-[100dvh] rounded-none p-0 flex flex-col" : "max-w-4xl h-[90vh] flex flex-col p-0"}`}>
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Chi tiết đơn đăng ký giảng viên</DialogTitle>
                    <DialogDescription>
                        Xem xét thông tin và duyệt đơn đăng ký của {user.fullName}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className={`flex-1 ${isMobile ? "px-0" : "px-0"}`}>
                    <div className="space-y-6 pb-6">
                        {/* User Profile Header */}
                        <div className={`flex flex-col md:flex-row items-center md:items-start gap-4 p-4 border-b bg-muted/20 ${isMobile ? "mx-4 mt-4 rounded-lg border" : "mx-6 mt-6 rounded-lg border"}`}>
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatarUrl || ""} />
                                <AvatarFallback>
                                    {user.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center md:text-left bg-transparent">
                                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                {user.dateOfBirth && (
                                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        Ngày sinh: {format(new Date(user.dateOfBirth), "dd/MM/yyyy")}
                                    </p>
                                )}
                                {registration.headline && (
                                    <p className="text-sm font-medium mt-1">
                                        {registration.headline}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-2 justify-center md:justify-start">
                                    {registration.socialLinks.facebook && (
                                        <a
                                            href={registration.socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                    )}
                                    {registration.socialLinks.linkedIn && (
                                        <a
                                            href={registration.socialLinks.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {registration.socialLinks.website && (
                                        <a
                                            href={registration.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <Globe className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto mt-2 md:mt-0">
                                <Badge
                                    className={
                                        registration.verificationStatus === VerificationStatus.Verified
                                            ? "bg-green-600 hover:bg-green-700 whitespace-nowrap"
                                            : registration.verificationStatus === VerificationStatus.Hidden
                                                ? "bg-red-600 hover:bg-red-700 whitespace-nowrap"
                                                : registration.verificationStatus === VerificationStatus.Pending
                                                    ? "bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
                                                    : registration.verificationStatus === VerificationStatus.Recovering
                                                        ? "bg-blue-500 hover:bg-blue-600 whitespace-nowrap"
                                                        : "bg-yellow-500 hover:bg-yellow-600 whitespace-nowrap"
                                    }
                                >
                                    {
                                        registration.verificationStatus === VerificationStatus.Pending
                                            ? "Chờ duyệt"
                                            : registration.verificationStatus === VerificationStatus.Verified
                                                ? "Đã duyệt"
                                                : registration.verificationStatus === VerificationStatus.Hidden
                                                    ? "Đã từ chối"
                                                    : registration.verificationStatus === VerificationStatus.Recovering
                                                        ? "Yêu cầu khôi phục"
                                                        : "Yêu cầu cập nhật"
                                    }
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Đăng ký: {format(new Date(registration.createdAt), "dd/MM/yyyy HH:mm")}
                                </span>
                                {registration.updatedAt && (
                                    <span className="text-xs text-muted-foreground">
                                        Cập nhật: {format(new Date(registration.updatedAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                )}
                                {registration.verifiedAt && (
                                    <span className="text-xs text-green-600">
                                        Duyệt: {format(new Date(registration.verifiedAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white">
                            {/* Tab Navigation */}
                            <div className={`border-b ${isMobile ? "px-4" : "px-6"}`}>
                                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;

                                        return (
                                            <div key={tab.id} className="relative">
                                                <button
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${isMobile ? "text-sm" : "text-base"
                                                        } ${isActive
                                                            ? "text-primary"
                                                            : "text-gray-600 hover:text-gray-900"
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span>{tab.label}</span>
                                                </button>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 380,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className={`${isMobile ? "p-4" : "p-6"}`}>
                                {activeTab === "info" && (
                                    <div className="space-y-4">
                                        <Accordion type="single" collapsible defaultValue="basic-info" className="w-full space-y-4">
                                            {/* Basic Info (Bio, Headline, Expertise) */}
                                            <AccordionItem value="basic-info" className="border rounded-lg bg-white overflow-hidden">
                                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                            <User className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <span className="font-semibold text-base">Thông tin cơ bản</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 pt-2 space-y-4 border-t">
                                                    {registration.headline && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Tiêu đề chuyên môn</h4>
                                                            <p className="font-medium">{registration.headline}</p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Giới thiệu</h4>
                                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                            {registration.bio || "Chưa có thông tin giới thiệu."}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Lĩnh vực chuyên môn</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {registration.expertiseAreas && registration.expertiseAreas.length > 0 ? (
                                                                registration.expertiseAreas.map((area, index) => (
                                                                    <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                                                                        {area}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">Chưa cập nhật</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Education */}
                                            <AccordionItem value="education" className="border rounded-lg bg-white overflow-hidden">
                                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                            <GraduationCap className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <span className="font-semibold text-base">Học vấn</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 pt-2 border-t">
                                                    <div className="space-y-4 pt-2">
                                                        {registration.education && registration.education.length > 0 ? (
                                                            registration.education.map((edu, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative pl-4 border-l-2 border-purple-100 last:border-0 pb-4 last:pb-0"
                                                                >
                                                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                                        <div>
                                                                            <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                                                                            <p className="text-sm text-gray-600">{edu.degree}</p>
                                                                        </div>
                                                                        <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
                                                                            {edu.start} - {edu.end}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground text-center py-2">
                                                                Chưa cập nhật
                                                            </p>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Work Experience */}
                                            <AccordionItem value="work-experience" className="border rounded-lg bg-white overflow-hidden">
                                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                            <Briefcase className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <span className="font-semibold text-base">Kinh nghiệm làm việc</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 pt-2 border-t">
                                                    <div className="space-y-4 pt-2">
                                                        {registration.workExperience && registration.workExperience.length > 0 ? (
                                                            registration.workExperience.map((exp, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative pl-4 border-l-2 border-purple-100 last:border-0 pb-4 last:pb-0"
                                                                >
                                                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                                        <div>
                                                                            <h4 className="font-semibold text-gray-900">{exp.company}</h4>
                                                                            <p className="text-sm text-purple-700 font-medium">{exp.role}</p>
                                                                        </div>
                                                                        <Badge variant="outline" className="text-xs text-muted-foreground whitespace-nowrap">
                                                                            {format(new Date(exp.from), "MM/yyyy")} - {format(new Date(exp.to), "MM/yyyy")}
                                                                        </Badge>
                                                                    </div>
                                                                    {exp.description && (
                                                                        <p className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                                                            {exp.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground text-center py-2">
                                                                Chưa cập nhật
                                                            </p>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Certificates */}
                                            <AccordionItem value="certificates" className="border rounded-lg bg-white overflow-hidden">
                                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                                            <Award className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <span className="font-semibold text-base">Chứng chỉ</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4 pt-2 border-t">
                                                    <div className="space-y-4 pt-2">
                                                        {registration.certificates && registration.certificates.length > 0 ? (
                                                            registration.certificates.map((cert, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative pl-4 border-l-2 border-purple-100 last:border-0 pb-4 last:pb-0"
                                                                >
                                                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                                        <div>
                                                                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                                <p className="text-sm text-gray-600">{cert.issuer}</p>
                                                                                {cert.url && (
                                                                                    <>
                                                                                        <span className="text-gray-300">•</span>
                                                                                        <a
                                                                                            href={formatImageUrl(cert.url)}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="text-xs text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1 font-medium"
                                                                                        >
                                                                                            Xem <ExternalLink className="h-3 w-3" />
                                                                                        </a>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <Badge variant="outline" className="w-fit text-xs text-muted-foreground whitespace-nowrap">
                                                                            {cert.year}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground text-center py-2">
                                                                Chưa cập nhật
                                                            </p>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                )}

                                {activeTab === "financial" && (
                                    <div className="space-y-6">
                                        {/* Bank Info Card - Premium Credit Card Look */}
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 text-white shadow-xl ring-1 ring-white/10 transition-all hover:shadow-2xl">
                                            {/* Abstract Background Decoration */}
                                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                                            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                                            <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                                                {/* Top Row: Bank Name & Logo */}
                                                <div className="flex items-start justify-between mb-8">
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Ngân hàng thụ hưởng</p>
                                                        <h3 className="text-lg font-bold tracking-tight text-white/90">
                                                            {registration.bankInfo?.bankName || "Chưa cập nhật"}
                                                        </h3>
                                                    </div>
                                                    {bankLogo ? (
                                                        <div className="h-10 w-20 rounded bg-white p-1.5 flex items-center justify-center shadow-lg">
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={bankLogo}
                                                                    alt={registration.bankInfo.bankName}
                                                                    fill
                                                                    className="object-contain"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 w-14 rounded bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                                            <CreditCard className="h-5 w-5 text-white/50" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Middle Row: Account Number */}
                                                <div className="mb-8">
                                                    <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Số tài khoản</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-3xl font-medium tracking-widest text-white shadow-sm">
                                                            {registration.bankInfo?.accountNumber || "Wait for update"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Account Holder */}
                                                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                                                    <div>
                                                        <p className="text-[10px] font-medium text-slate-400 mb-1 uppercase tracking-wider">Chủ tài khoản</p>
                                                        <p className="font-semibold uppercase tracking-wide text-sm md:text-base">
                                                            {registration.bankInfo?.accountHolderName || "---"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        <span>Verified Bank</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tax ID - Clean Modern Row */}


                                        <div className="group rounded-xl border bg-white p-0 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-blue-200">
                                            <div className="flex items-center gap-5 p-5">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mã số thuế cá nhân</p>
                                                    {registration.taxId ? (
                                                        <p className="text-xl font-bold text-gray-900 font-mono tracking-wide">{registration.taxId}</p>
                                                    ) : (
                                                        <p className="text-sm italic text-muted-foreground">Chưa cập nhật mã số thuế</p>
                                                    )}
                                                </div>
                                                {registration.taxId && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                            Tax ID
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "documents" && (
                                    <div className="space-y-4">
                                        <div className="border rounded-lg bg-white overflow-hidden">
                                            <div className="px-4 py-3 border-b flex items-center gap-3 bg-muted/20">
                                                <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg">
                                                    <FileText className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="font-semibold text-base">Căn cước công dân</span>
                                                    <span className="text-xs font-normal text-muted-foreground">Hình ảnh hai mặt của giấy tờ tùy thân</span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                {registration.identityDocuments && registration.identityDocuments.length > 0 ? (
                                                    <div className="space-y-6">
                                                        {registration.identityDocuments.map((doc, index) => (
                                                            <div key={index} className="space-y-4">
                                                                {registration.identityDocuments.length > 1 && (
                                                                    <p className="font-medium text-sm text-muted-foreground border-b pb-1">Bộ tài liệu {index + 1}</p>
                                                                )}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div className="space-y-2">
                                                                        <p className="font-medium text-center text-sm">Mặt trước</p>
                                                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
                                                                            {doc.frontImg ? (
                                                                                <>
                                                                                    <Image
                                                                                        src={formatImageUrl(doc.frontImg) || ""}
                                                                                        alt="CCCD Front"
                                                                                        fill
                                                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                                        unoptimized
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                                        <a
                                                                                            href={doc.frontImg}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white hover:text-black"
                                                                                            title="Xem ảnh gốc"
                                                                                        >
                                                                                            <ExternalLink className="h-5 w-5" />
                                                                                        </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                                                    <div className="flex flex-col items-center gap-2">
                                                                                        <FileText className="h-8 w-8 opacity-20" />
                                                                                        <span className="text-xs">Không có ảnh</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <p className="font-medium text-center text-sm">Mặt sau</p>
                                                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
                                                                            {doc.backImg ? (
                                                                                <>
                                                                                    <Image
                                                                                        src={formatImageUrl(doc.backImg) || ""}
                                                                                        alt="CCCD Back"
                                                                                        fill
                                                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                                        unoptimized
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                                        <a
                                                                                            href={doc.backImg}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white hover:text-black"
                                                                                            title="Xem ảnh gốc"
                                                                                        >
                                                                                            <ExternalLink className="h-5 w-5" />
                                                                                        </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                                                    <div className="flex flex-col items-center gap-2">
                                                                                        <FileText className="h-8 w-8 opacity-20" />
                                                                                        <span className="text-xs">Không có ảnh</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                                                        <FileText className="h-12 w-12 mb-2 opacity-20" />
                                                        <p>Chưa có tài liệu xác minh</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 border-t gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {registration.verificationStatus === VerificationStatus.Pending
                        || registration.verificationStatus === VerificationStatus.Recovering && (
                            <>
                                <Button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                    onClick={() => onReject(registration.id)}
                                >
                                    Yêu cầu cập nhật
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => onApprove(registration.id)}
                                >
                                    Chấp nhận
                                </Button>
                            </>
                        )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
