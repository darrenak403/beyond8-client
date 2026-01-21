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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { ExternalLink, Facebook, Linkedin, Globe } from "lucide-react";
import Image from "next/image";
import { InstructorRegistrationResponse } from "@/lib/api/services/fetchInstructorRegistration";

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
    if (!registration) return null;

    const { user } = registration;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Chi tiết đơn đăng ký giảng viên</DialogTitle>
                    <DialogDescription>
                        Xem xét thông tin và duyệt đơn đăng ký của {user.fullName}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6">
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
                                        registration.verificationStatus === "Approved"
                                            ? "default" // or success if available
                                            : registration.verificationStatus === "Rejected"
                                                ? "destructive"
                                                : "secondary"
                                    }
                                >
                                    {registration.verificationStatus}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Đăng ngày:{" "}
                                    {format(new Date(registration.createdAt), "dd/MM/yyyy")}
                                </span>
                            </div>
                        </div>

                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                                <TabsTrigger value="documents">Tài liệu xác minh</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-4 mt-4">
                                {/* Bio */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Giới thiệu</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {registration.bio || "Chưa có thông tin giới thiệu."}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Expertise */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Lĩnh vực chuyên môn</CardTitle>
                                    </CardHeader>
                                    <CardContent>
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
                                    </CardContent>
                                </Card>

                                {/* Education */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Học vấn</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {registration.education.map((edu, index) => (
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
                                        ))}
                                        {registration.education.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                Chưa cập nhật
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Work Experience */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Kinh nghiệm làm việc
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {registration.workExperience.map((exp, index) => (
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
                                        ))}
                                        {registration.workExperience.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                Chưa cập nhật
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

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
                                    {/* <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <p className="font-medium text-center">Mặt trước</p>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                {registration.frontCccdUrl ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={registration.frontCccdUrl}
                                                            alt="CCCD Front"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                                        Không có ảnh
                                                    </div>
                                                )}
                                            </div>
                                            {registration.frontCccdUrl && (
                                                <div className="flex justify-center">
                                                    <Button variant="link" size="sm" asChild>
                                                        <a href={registration.frontCccdUrl} target="_blank" rel="noopener noreferrer">
                                                            Xem ảnh gốc <ExternalLink className="ml-1 h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <p className="font-medium text-center">Mặt sau</p>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                {registration.backCccdUrl ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={registration.backCccdUrl}
                                                            alt="CCCD Back"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                                        Không có ảnh
                                                    </div>
                                                )}
                                            </div>
                                            {registration.backCccdUrl && (
                                                <div className="flex justify-center">
                                                    <Button variant="link" size="sm" asChild>
                                                        <a href={registration.backCccdUrl} target="_blank" rel="noopener noreferrer">
                                                            Xem ảnh gốc <ExternalLink className="ml-1 h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent> */}
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 border-t gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {registration.verificationStatus === "Pending" && (
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
