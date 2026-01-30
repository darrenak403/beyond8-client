"use client"

import { AIPrompt } from '@/hooks/useAI';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Edit, 
    Trash2, 
    Copy, 
    Power, 
    MoreHorizontal, 
    Thermometer, 
    Cpu, 
    Calendar,
    Layers
} from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIPromptCardProps {
    prompt: AIPrompt;
    onEdit: (prompt: AIPrompt) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string) => void;
}

export function AIPromptCard({ prompt, onEdit, onDelete, onToggleStatus }: AIPromptCardProps) {
    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(prompt.template);
        toast.success("Template copied to clipboard!");
    };

    const isActive = prompt.isActive;

    return (
        <Card className="group relative flex flex-col h-full bg-white border border-slate-200/80 shadow-sm hover:border-primary/50 transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="p-5 pb-2 space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-900/90 truncate tracking-tight leading-tiht group-hover:text-primary transition-colors" title={prompt.name}>
                                {prompt.name}
                            </h3>
                            <div className={cn(
                                "shrink-0 w-2 h-2 rounded-full",
                                isActive ? "bg-emerald-500" : "bg-primary/50"
                            )} />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 text-slate-600">
                                <span className="text-[10px] text-slate-400">v</span>{prompt.version}
                            </span>
                            <span className="text-primary/50">•</span>
                            <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3 text-slate-400" />
                                {prompt.category}
                            </span>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEdit(prompt)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4 text-blue-500" /> Modify
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyTemplate} className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4 text-primary/50" /> Copy Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleStatus && onToggleStatus(prompt.id)} className="cursor-pointer">
                                <Power className={cn("mr-2 h-4 w-4", isActive ? "text-amber-500" : "text-emerald-500")} /> 
                                {isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete && onDelete(prompt.id)} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-1 flex-1 flex flex-col gap-4">
                {prompt.description && (
                    <div className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                        {prompt.description}
                    </div>
                )}

                {/* Template Preview Code Block */}
                <div className="relative group/code mt-auto">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-primary/50 to-primary/50 rounded-lg opacity-0 group-hover/code:opacity-20 transition duration-500 blur"></div>
                    <div className="relative bg-slate-900 rounded-lg p-3 border border-slate-800 shadow-inner">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/code:opacity-100 transition-opacity duration-200">
                             <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={handleCopyTemplate}
                                title="Copy"
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="text-[11px] font-mono text-slate-300 line-clamp-3 leading-loose selection:bg-primary/50">
                            <span className="text-purple-400">template</span> <span className="text-slate-500">:=</span>
                            <br/>
                            {prompt.template}
                        </div>
                    </div>
                </div>

                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {prompt.tags.slice(0, 3).map(tag => (
                            <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="text-[10px] px-2 py-0.5 h-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/50 transition-colors"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium self-center px-1">
                                +{prompt.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5" title="Max Tokens">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{prompt.maxTokens}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Temperature">
                        <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{prompt.temperature}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400" title={`Created: ${format(new Date(prompt.createdAt), 'PP')}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(prompt.createdAt), 'dd/MM/yy')}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
