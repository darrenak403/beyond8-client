"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AIUsageRecord } from "@/hooks/useAI"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const operationLabels: Record<string, string> = {
  ProfileReview: "Đánh giá hồ sơ",
  QuizGeneration: "Tạo câu hỏi",
  StudentAnswerReview: "Đánh giá câu trả lời",
  StudentFeedbackGeneration: "Tạo phản hồi",
  RubricBasedGrading: "Chấm điểm theo tiêu chí",
  Translation: "Dịch thuật",
  TextGeneration: "Tạo văn bản",
  ChatCompletion: "Hoàn thành chat",
  FormatQuizQuestions: "Định dạng câu hỏi",
  AssignmentGrading: "Chấm bài tập",
  ExplainQuizQuestion: "Giải thích câu hỏi",
  Embedding: "Embedding",
  Custom: "Tùy chỉnh",
}

const getOperationLabel = (operation: string): string => {
  return operationLabels[operation] || operation
}

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
      <div>{getOperationLabel(row.getValue("operation"))}</div>
    ),
  },
  {
    accessorKey: "totalCost",
    header: () => <div className="text-center">Chi phí</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("totalCost"));
      return (
        <div className="text-center font-medium">
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
