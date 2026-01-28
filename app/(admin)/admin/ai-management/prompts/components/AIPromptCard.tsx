"use client"

import { AIPrompt } from '@/hooks/useAI';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, Power, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface AIPromptCardProps {
    prompt: AIPrompt;
    onEdit: (prompt: AIPrompt) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string) => void;
}

export function AIPromptCard({ prompt, onEdit, onDelete, onToggleStatus }: AIPromptCardProps) {
    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(prompt.template);
        toast.success("Đã sao chép template vào clipboard!");
    };

    const isActive = prompt.isActive;

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 border-slate-200">
            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base text-slate-900 truncate" title={prompt.name}>
                                {prompt.name}
                            </h3>
                            <Badge variant="outline" className={`shrink-0 text-[10px] px-1.5 py-0 h-5 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">v{prompt.version}</span>
                            <span>•</span>
                            <span>{prompt.category}</span>
                            <span>•</span>
                            <span>{format(new Date(prompt.createdAt), 'dd/MM/yyyy')}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(prompt)}>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyTemplate}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleStatus && onToggleStatus(prompt.id)}>
                                <Power className="mr-2 h-4 w-4" /> {isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete && onDelete(prompt.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 flex-1 space-y-3">
                {prompt.description && (
                    <div className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
                        {prompt.description}
                    </div>
                )}

                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 group relative">
                    <div className="text-xs text-slate-500 font-mono line-clamp-3">
                        {prompt.template}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-1 right-1 h-6 w-6 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleCopyTemplate}
                        title="Sao chép template"
                    >
                        <Copy className="h-3 w-3 text-slate-500" />
                    </Button>
                </div>

                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {prompt.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-slate-100 text-slate-600 border border-slate-200">
                                {tag}
                            </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">+{prompt.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-slate-400">
                <div className="flex gap-3">
                    <span title="Max Tokens">Tk: {prompt.maxTokens}</span>
                    <span title="Temperature">Tp: {prompt.temperature}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
