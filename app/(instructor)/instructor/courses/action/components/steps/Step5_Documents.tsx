import { useRef, useState } from 'react'
import { FileText, Upload, Eye, Loader2, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DocumentUploadDialog from '@/components/widget/document/DocumentUploadDialog'
import { useMediaDocumentCourse } from '@/hooks/useMedia'
import { useCreateCourseDocument, useGetCourseDocument, useDeleteCourseDocument, useToggleDownloadCourseDocument } from '@/hooks/useCourse'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Step5DocumentsProps {
    courseId: string
}

export default function Step5Documents({ courseId }: Step5DocumentsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadDocumentCourseAsync, isUploadingDocumentCourse } = useMediaDocumentCourse()
    const { createCourseDocument, isPending: isCreatingDoc } = useCreateCourseDocument()
    const { courseDocument, isLoading: isLoadingDocs, refetch } = useGetCourseDocument(courseId)
    const { deleteCourseDocument } = useDeleteCourseDocument()
    const { toggleDownloadCourseDocument } = useToggleDownloadCourseDocument()

    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        isDownloadable: true
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileToUpload(file)
        setMetadata({
            title: file.name,
            description: '',
            isDownloadable: true
        })
        setIsDialogOpen(true)

        // Reset input to allow selecting same file again if canceled
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleConfirmUpload = async () => {
        if (!fileToUpload) return

        try {
            const mediaFile = await uploadDocumentCourseAsync(fileToUpload)

            if (mediaFile?.fileUrl) {
                await createCourseDocument({
                    courseId,
                    courseDocumentUrl: formatImageUrl(mediaFile.fileUrl) || '',
                    title: metadata.title,
                    description: metadata.description,
                    isDownloadable: metadata.isDownloadable
                })
                refetch()
                setIsDialogOpen(false)
                setFileToUpload(null)
            }
        } catch (error) {
            console.error('Failed to upload document:', error)
        }
    }

    const handleDelete = async (id: string) => {
        await deleteCourseDocument({ id })
        refetch()
    }

    const handleToggleDownload = async (id: string) => {
        await toggleDownloadCourseDocument({ id })
        refetch()
    }

    return (
        <div className="w-full mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Tài liệu khóa học</h2>
                <p className="text-muted-foreground">
                    Tải lên các tài liệu bổ trợ cho khóa học của bạn (PDF, Word, Excel, Slide...).
                </p>
            </div>

            <div className="grid gap-6">
                {/* Upload Area */}
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer
                        ${isUploadingDocumentCourse || isCreatingDoc ? 'opacity-50 pointer-events-none' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploadingDocumentCourse || isCreatingDoc}
                    />

                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-purple-50 rounded-full mb-1">
                            {isUploadingDocumentCourse || isCreatingDoc ? (
                                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                            ) : (
                                <Upload className="w-6 h-6 text-purple-600" />
                            )}
                        </div>
                        <h3 className="text-base font-semibold">
                            {isUploadingDocumentCourse ? 'Đang tải lên...' : isCreatingDoc ? 'Đang lưu...' : 'Tải tài liệu lên'}
                        </h3>
                        <p className="text-xs text-gray-500 max-w-sm">
                            Kéo thả hoặc click để chọn file
                        </p>
                    </div>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Tài liệu đã tải lên
                        <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                            {courseDocument?.length || 0}
                        </span>
                    </h3>

                    {isLoadingDocs ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : courseDocument && courseDocument.length > 0 ? (
                        <div className="grid gap-3">
                            {courseDocument.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow group"
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-medium truncate" title={doc.title}>{doc.title}</span>
                                            {doc.description && (
                                                <span className="text-sm text-gray-500 truncate" title={doc.description}>{doc.description}</span>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span>{format(new Date(doc.createdAt), 'dd/MM/yyyy', { locale: vi })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Status Badge */}
                                        <div className={`
                                            flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors
                                            ${doc.isDownloadable
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }
                                        `}
                                            onClick={() => handleToggleDownload(doc.id)}
                                            title={doc.isDownloadable ? 'Click để tắt tải xuống' : 'Click để bật tải xuống'}
                                        >
                                            <Switch
                                                checked={doc.isDownloadable}
                                                onCheckedChange={() => handleToggleDownload(doc.id)}
                                                id={`download-toggle-${doc.id}`}
                                                className="scale-75 data-[state=checked]:bg-green-600"
                                            />
                                            <Label htmlFor={`download-toggle-${doc.id}`} className="cursor-pointer">
                                                Cho phép tải xuống
                                            </Label>
                                        </div>

                                        <div className="h-4 w-px bg-gray-200 mx-1" />

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={doc.courseDocumentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600 transition-colors"
                                                title="Xem trước"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(doc.id)}
                                                title="Xóa tài liệu"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <FileText className="w-10 h-10 text-gray-300" />
                                <p>Chưa có tài liệu nào</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DocumentUploadDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                metadata={metadata}
                setMetadata={setMetadata}
                onConfirm={handleConfirmUpload}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isUploadingDocumentCourse || isCreatingDoc}
            />
        </div>
    )
}
