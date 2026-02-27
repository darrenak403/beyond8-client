'use client'

import { useGetDownloadMediaUrl } from '@/hooks/useMedia'
import { ReactNode } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface DocumentDownloadButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    url: string
    fileName?: string
    children: ReactNode
}

export default function DocumentDownloadButton({
    url,
    fileName,
    children,
    onClick,
    ...props
}: DocumentDownloadButtonProps) {
    const { refetch, isFetching } = useGetDownloadMediaUrl(url, { enabled: false })

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFetching) return;

        if (onClick) {
            onClick(e);
        }

        try {
            const result = await refetch();

            if (result.data?.data?.downloadUrl) {
                window.open(result.data.data.downloadUrl, '_blank');
            } else {
                toast.error("Không thể lấy đường dẫn tải xuống. Vui lòng thử lại sau.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tải xuống.");
        }
    };

    return (
        <a
            href="#"
            onClick={handleClick}
            {...props}
            className={`${props.className || ''} ${isFetching ? 'opacity-70 cursor-wait' : ''}`}
        >
            {isFetching ? (
                <Loader2 className="animate-spin w-4 h-4 mx-auto" />
            ) : (
                children
            )}
        </a>
    )
}
