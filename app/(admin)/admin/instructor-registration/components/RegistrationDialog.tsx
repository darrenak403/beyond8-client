import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ExternalLink, Facebook, Linkedin, Globe, Calendar, Users, BookOpen, Star, FileText, CreditCard } from "lucide-react";
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

    if (!registration) return null;

    const { user } = registration;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${isMobile ? "max-w-full w-full h-[100dvh] rounded-none p-0 flex flex-col" : "max-w-4xl max-h-[90vh] flex flex-col p-0"}`}>
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Chi tiết đơn đăng ký giảng viên</DialogTitle>
                    <DialogDescription>
                        Xem xét thông tin và duyệt đơn đăng ký của {user.fullName}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-6 pb-6">
                        {/* User Profile Header */}
                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatarUrl || ""} />
                                <AvatarFallback>
                                    {user.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                {user.dateOfBirth && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        Ngày sinh: {format(new Date(user.dateOfBirth), "dd/MM/yyyy")}
                                    </p>
                                )}
                                {registration.headline && (
                                    <p className="text-sm font-medium mt-1">
                                        {registration.headline}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-2">
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
                            <div className="flex flex-col items-end gap-1">
                                <Badge
                                    variant={
                                        registration.verificationStatus === VerificationStatus.Verified
                                            ? "default"
                                            : registration.verificationStatus === VerificationStatus.Rejected
                                                ? "destructive"
                                                : "secondary"
                                    }
                                >
                                    {
                                        registration.verificationStatus === VerificationStatus.Pending
                                            ? "Đang chờ"
                                            : registration.verificationStatus === VerificationStatus.Verified
                                                ? "Đã duyệt"
                                                : registration.verificationStatus === VerificationStatus.Rejected
                                                    ? "Đã từ chối"
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

                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                                <TabsTrigger value="financial">Tài chính</TabsTrigger>
                                <TabsTrigger value="documents">Tài liệu xác minh</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-4 mt-4">
                                <Accordion type="single" collapsible defaultValue="bio" className="w-full">
                                    {/* Bio */}
                                    <AccordionItem value="bio">
                                        <AccordionTrigger>Giới thiệu</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {registration.bio || "Chưa có thông tin giới thiệu."}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Education */}
                                    <AccordionItem value="education">
                                        <AccordionTrigger>Học vấn</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            {registration.education && registration.education.length > 0 ? (
                                                registration.education.map((edu, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-start border-b last:border-0 pb-4 last:pb-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{edu.school}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {edu.degree}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {edu.start} - {edu.end}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    Chưa cập nhật (No Data: {registration.education ? "Empty Array" : "Undefined"})
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Work Experience */}
                                    <AccordionItem value="work-experience">
                                        <AccordionTrigger>Kinh nghiệm làm việc</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            {registration.workExperience && registration.workExperience.length > 0 ? (
                                                registration.workExperience.map((exp, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-start border-b last:border-0 pb-4 last:pb-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{exp.company}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {exp.role}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {exp.from} - {exp.to}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    Chưa cập nhật (No Data: {registration.workExperience ? "Empty Array" : "Undefined"})
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Expertise */}
                                    <AccordionItem value="expertise">
                                        <AccordionTrigger>Lĩnh vực chuyên môn</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-wrap gap-2">
                                                {registration.expertiseAreas.map((area, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {area}
                                                    </Badge>
                                                ))}
                                                {registration.expertiseAreas.length === 0 && (
                                                    <span className="text-sm text-muted-foreground">
                                                        Chưa cập nhật
                                                    </span>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Certificates */}
                                    <AccordionItem value="certificates">
                                        <AccordionTrigger>Chứng chỉ</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            {registration.certificates && registration.certificates.length > 0 ? (
                                                registration.certificates.map((cert, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-start border-b last:border-0 pb-4 last:pb-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{cert.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {cert.issuer}
                                                            </p>
                                                            {cert.url && (
                                                                <a
                                                                    href={cert.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                                                >
                                                                    Xem chứng chỉ <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {cert.year}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Chưa cập nhật
                                                </p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            {/* Financial Tab */}
                            <TabsContent value="financial" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Thông tin ngân hàng
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            {registration.bankInfo || <span className="text-muted-foreground">Chưa cập nhật thông tin ngân hàng</span>}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Mã số thuế
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            {registration.taxId || <span className="text-muted-foreground">Chưa cập nhật mã số thuế</span>}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Căn cước công dân / Hộ chiếu
                                        </CardTitle>
                                        <CardDescription>
                                            Hình ảnh hai mặt của giấy tờ tùy thân
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {registration.identityDocuments && registration.identityDocuments.length > 0 ? (
                                            <div className="space-y-6">
                                                {registration.identityDocuments.map((doc, index) => (
                                                    <div key={index} className="space-y-4">
                                                        {registration.identityDocuments.length > 1 && (
                                                            <p className="font-medium text-sm text-muted-foreground">Bộ tài liệu {index + 1}</p>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <p className="font-medium text-center">Mặt trước</p>
                                                                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                                    {doc.frontImg ? (
                                                                        <Image
                                                                            src={formatImageUrl(doc.frontImg) || ""}
                                                                            alt="CCCD Front"
                                                                            fill
                                                                            className="object-cover"
                                                                            unoptimized
                                                                        />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                                                            Không có ảnh
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {doc.frontImg && (
                                                                    <div className="flex justify-center">
                                                                        <Button variant="link" size="sm" asChild>
                                                                            <a href={doc.frontImg} target="_blank" rel="noopener noreferrer">
                                                                                Xem ảnh gốc <ExternalLink className="ml-1 h-3 w-3" />
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="font-medium text-center">Mặt sau</p>
                                                                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                                    {doc.backImg ? (
                                                                        <Image
                                                                            src={formatImageUrl(doc.backImg) || ""}
                                                                            alt="CCCD Back"
                                                                            fill
                                                                            className="object-cover"
                                                                            unoptimized
                                                                        />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                                                            Không có ảnh
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {doc.backImg && (
                                                                    <div className="flex justify-center">
                                                                        <Button variant="link" size="sm" asChild>
                                                                            <a href={doc.backImg} target="_blank" rel="noopener noreferrer">
                                                                                Xem ảnh gốc <ExternalLink className="ml-1 h-3 w-3" />
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                                <FileText className="h-12 w-12 mb-2 opacity-50" />
                                                <p>Chưa có tài liệu xác minh</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {registration.verificationStatus === VerificationStatus.Pending && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={() => onReject(registration.id)}
                            >
                                Từ chối
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
