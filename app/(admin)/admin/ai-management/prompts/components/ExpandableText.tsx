import { useState } from "react"
import { ContentDialog } from "@/components/widget/content-dialog"

interface ExpandableTextProps {
  text: string
  maxLength?: number
  title?: string
}

export function ExpandableText({ text, maxLength = 100, title = "Chi tiết nội dung" }: ExpandableTextProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!text) return null

  if (text.length <= maxLength) {
      return <span className="whitespace-pre-wrap break-words">{text}</span>
  }

  return (
    <>
      <span 
        className="cursor-pointer hover:text-slate-900 transition-colors whitespace-pre-wrap break-words"
        onClick={() => setIsOpen(true)}
        title="Nhấn để xem chi tiết"
      >
        {text.substring(0, maxLength)}...
      </span>

      <ContentDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        content={text}
      />
    </>
  )
}
