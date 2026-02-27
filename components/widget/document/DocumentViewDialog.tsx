'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'
import DocumentDownloadButton from '@/components/ui/document-download-button'

interface DocumentViewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    url: string | null
    title?: string
    isDownloadable?: boolean
}

const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'image'
    }
    if (['pdf'].includes(extension)) {
        return 'pdf'
    }
    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
        return 'office'
    }
    return 'unknown'
}

export default function DocumentViewDialog({
    open,
    onOpenChange,
    url,
    title = 'Xem tài liệu',
    isDownloadable = false
}: DocumentViewDialogProps) {
    const [loading, setLoading] = React.useState(true)

    if (!url) return null

    const fileType = getFileType(url)
    const isImage = fileType === 'image'
    const isPdf = fileType === 'pdf'
    const isOffice = fileType === 'office'

    // Microsoft Office Online Viewer for better embedding without Google branding
    const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`

    // Google Docs Viewer (fallback if needed, but trying to avoid as requested)
    // const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`

    const handleLoad = () => setLoading(false)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[70vw] w-full h-[85vh] p-0 gap-0 bg-zinc-950 border-zinc-800 overflow-hidden flex flex-col sm:rounded-xl shadow-2xl">

                {/* Header - Immersive Dark Glass */}
                <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/10 bg-white/5 backdrop-blur-md z-50">
                    <h2 className="text-sm font-medium text-white/90 truncate max-w-[60%] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                        {title}
                    </h2>

                    <div className="flex items-center gap-2">
                        {isDownloadable && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10 h-8 gap-2"
                                asChild
                            >
                                <DocumentDownloadButton
                                    url={url}
                                    title={title}
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tải xuống</span>
                                </DocumentDownloadButton>
                            </Button>
                        )}

                        <div
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded-full hover:bg-white/10 cursor-pointer text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className="flex-1 w-full bg-black/50 relative"
                    onContextMenu={(e) => !isDownloadable && e.preventDefault()}
                >
                    {loading && !isImage && (
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                                <p className="text-white/50 text-xs animate-pulse">Đang tải tài liệu...</p>
                            </div>
                        </div>
                    )}

                    {isImage ? (
                        <div className="w-full h-full flex items-center justify-center overflow-auto p-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={title}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg bg-white/5"
                                onLoad={handleLoad}
                            />
                        </div>
                    ) : isPdf ? (
                        <iframe
                            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full relative z-10"
                            frameBorder="0"
                            title="PDF Viewer"
                            onLoad={handleLoad}
                        />
                    ) : isOffice ? (
                        <iframe
                            src={officeViewerUrl}
                            className="w-full h-full relative z-10"
                            frameBorder="0"
                            title="Office Document Viewer"
                            onLoad={handleLoad}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4">
                            <p>Không thể xem trước tệp này.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
