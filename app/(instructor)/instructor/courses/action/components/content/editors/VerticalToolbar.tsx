"use client";

import React from "react";
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Code,
    FileType, // For CodeBlock
    Quote,
    Minus,
    Undo,
    Redo,
    WrapText, // For HardBreak
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToolbar } from "@/components/ui/toolbar-provider";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    disabled = false,
}: {
    onClick: () => void;
    isActive?: boolean;
    icon: LucideIcon;
    label: string;
    disabled?: boolean;
}) => (
    <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className={cn(
                        "h-8 w-8 rounded-sm",
                        isActive ? "bg-purple-100 text-purple-900" : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="px-2 py-1 text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export function VerticalToolbar() {
    const { editor } = useToolbar();

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-1 w-full px-1">
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                icon={Undo}
                label="Hoàn tác"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                icon={Redo}
                label="Làm lại"
            />

            <Separator className="my-2 w-8" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                icon={Bold}
                label="In đậm"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                icon={Italic}
                label="In nghiêng"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                icon={Strikethrough}
                label="Gạch ngang"
            />

            <Separator className="my-2 w-8" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                icon={List}
                label="Danh sách"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                icon={ListOrdered}
                label="Danh sách số"
            />

            <Separator className="my-2 w-8" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                icon={Code}
                label="Code"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                icon={FileType}
                label="Khối code"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                icon={Quote}
                label="Trích dẫn"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                icon={Minus}
                label="Đường kẻ ngang"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHardBreak().run()}
                icon={WrapText}
                label="Ngắt dòng"
            />
        </div>
    );
}
