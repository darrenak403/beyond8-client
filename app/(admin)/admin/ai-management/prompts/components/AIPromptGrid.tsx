"use client"

import { AIPrompt } from '@/hooks/useAI';
import { AIPromptCard } from './AIPromptCard';

interface AIPromptGridProps {
    prompts: AIPrompt[];
    onEdit: (prompt: AIPrompt) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string) => void;
}

export function AIPromptGrid({ prompts, onEdit, onDelete, onToggleStatus }: AIPromptGridProps) {
    if (prompts.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p>Không có prompt nào</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {prompts.map(prompt => (
                <AIPromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
}
