"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AIUsageRecord } from "@/lib/api/services/fetchAI"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const historyColumns: ColumnDef<AIUsageRecord>[] = [
  {
    accessorKey: "createdAt",
    header: "Thời gian",
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">
        {format(new Date(row.getValue("createdAt")), 'MMM dd, HH:mm')}
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div>{row.getValue("model")}</div>
    ),
  },
  {
    accessorKey: "operation",
    header: "Thao tác",
    cell: ({ row }) => (
      <div>{row.getValue("operation")}</div>
    ),
  },
  {
    accessorKey: "totalCost",
    header: () => <div className="text-right">Chi phí</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("totalCost"));
      return (
        <div className="text-right font-medium">
          ${cost.toFixed(6)}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant={status === 'Success' ? 'default' : 'destructive'} 
          className={status === 'Success' ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-none' : ''}
        >
          {status}
        </Badge>
      )
    },
  },
]
