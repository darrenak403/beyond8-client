"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableTextProps {
  text: string
  maxLength?: number
}

export function ExpandableText({ text, maxLength = 100 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!text) return null
  if (text.length <= maxLength) return <span>{text}</span>

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="whitespace-pre-wrap break-words">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </span>
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <span className="flex items-center gap-1">
            Thu gọn <ChevronUp className="h-3 w-3" />
          </span>
        ) : (
          <span className="flex items-center gap-1">
            Xem thêm <ChevronDown className="h-3 w-3" />
          </span>
        )}
      </Button>
    </div>
  )
}
