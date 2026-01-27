"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Transaction {
  id: string;
  source: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  type: "Sale" | "Withdrawal";
}

interface TransactionHistoryTableProps {
  transactions: Transaction[];
}

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nguồn / Khóa học</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.source}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === "Sale" ? "default" : "secondary"}>
                    {transaction.type === "Sale" ? "Bán hàng" : "Rút tiền"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${transaction.status === "Completed" ? "text-green-600 border-green-200 bg-green-50" : ""}
                      ${transaction.status === "Pending" ? "text-orange-600 border-orange-200 bg-orange-50" : ""}
                      ${transaction.status === "Failed" ? "text-red-600 border-red-200 bg-red-50" : ""}
                    `}
                  >
                    {transaction.status === "Completed" ? "Hoàn thành" : 
                     transaction.status === "Pending" ? "Đang xử lý" : "Thất bại"}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === "Sale" ? "text-green-600" : "text-gray-900"}`}>
                  {transaction.type === "Sale" ? "+" : "-"}
                  {transaction.amount.toLocaleString()} VNĐ
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
