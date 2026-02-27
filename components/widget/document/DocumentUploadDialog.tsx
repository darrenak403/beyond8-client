import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, FileText, Download, Loader2 } from "lucide-react"

interface DocumentUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    metadata: {
        title: string
        description: string
        isDownloadable: boolean
    }
    setMetadata: (metadata: {
        title: string
        description: string
        isDownloadable: boolean
    }) => void
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export default function DocumentUploadDialog({
    open,
    onOpenChange,
    metadata,
    setMetadata,
    onConfirm,
    onCancel,
    isLoading
}: DocumentUploadDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileUp className="w-5 h-5 text-blue-600" />
                        Tải tài liệu lên
                    </DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết cho tài liệu của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 bg-gray-50/50">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base font-semibold text-gray-900">
                                Tiêu đề <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="title"
                                    value={metadata.title}
                                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                    className="pl-9 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nhập tiêu đề tài liệu..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={metadata.description}
                                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                className="bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] resize-none"
                                placeholder="Mô tả ngắn về tài liệu này..."
                            />
                        </div>

                        <Card className="border-gray-200 shadow-sm">
                            <CardContent className="p-3 flex items-center justify-between">
                                <Label htmlFor="downloadable" className="cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                                        <Download className="w-4 h-4" />
                                    </div>
                                    Cho phép tải về
                                </Label>
                                <Switch
                                    id="downloadable"
                                    checked={metadata.isDownloadable}
                                    onCheckedChange={(checked) => setMetadata({ ...metadata, isDownloadable: checked })}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-black"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading || !metadata.title}
                        className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200 px-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải lên...
                            </>
                        ) : (
                            'Lưu tài liệu'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
