import { useGetDownloadMediaUrl } from "@/hooks/useMedia"
import React from "react"

interface DownloadableFileItemProps {
    url: string
    children: (props: { signedUrl: string | undefined; isLoading: boolean }) => React.ReactNode
}

export default function DownloadableFileItem({ url, children }: DownloadableFileItemProps) {
    const { data, isLoading } = useGetDownloadMediaUrl(url)
    const signedUrl = data?.data?.downloadUrl

    return <>{children({ signedUrl, isLoading })}</>
}
