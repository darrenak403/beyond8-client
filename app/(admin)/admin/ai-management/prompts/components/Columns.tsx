"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AIPrompt } from '@/hooks/useAI';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Power } from "lucide-react"
import { format } from "date-fns"
import { ExpandableText } from "./ExpandableText"

interface GetColumnsProps {
  onEdit: (prompt: AIPrompt) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete, onToggleStatus }: GetColumnsProps): ColumnDef<AIPrompt>[] => [
  {
    accessorKey: "name",
    header: "Tên Prompt",
    cell: ({ row }) => {
      const prompt = row.original
      return (
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <span className="font-semibold text-slate-900 break-words whitespace-normal text-base leading-tight">
            {prompt.name}
          </span>
          {prompt.description && (
            <div className="text-xs text-slate-500">
               <ExpandableText text={prompt.description} maxLength={60} title="Mô tả prompt" />
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {prompt.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-auto font-medium bg-slate-100 text-slate-600 border border-slate-200 shadow-none">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => (
      <div className="font-medium text-slate-700 text-sm">
        {row.getValue("category")}
      </div>
    ),
  },
  {
    accessorKey: "template",
    header: "Mẫu (Template)",
    cell: ({ row }) => (
      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono leading-relaxed min-w-[200px]">
        <ExpandableText text={row.getValue("template")} maxLength={100} title="Nội dung Prompt Template" />
      </div>
    ),
  },
  {
    accessorKey: "version",
    header: "Phiên bản",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs border-slate-200 text-slate-500 bg-white">
        v{row.getValue("version")}
      </Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive")
      return (
        <Badge variant="outline"
          className={`font-medium border-0 px-2.5 py-1 ${
              isActive 
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' 
              : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20'
          }`}>
          {isActive ? 'Hoạt động' : 'Vô hiệu'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Ngày tạo</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-end gap-1 text-right text-sm text-slate-500">
         <span>{format(new Date(row.getValue("createdAt")), 'dd/MM/yyyy')}</span>
         <span className="text-xs text-slate-400">{format(new Date(row.getValue("createdAt")), 'HH:mm')}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
      const prompt = row.original
      const isActive = prompt.isActive;
      return (
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleStatus && onToggleStatus(prompt.id)}
            className={`h-8 w-8 rounded-lg ${isActive ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            title={isActive ? "Tắt prompt" : "Bật prompt"}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(prompt)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete && onDelete(prompt.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
