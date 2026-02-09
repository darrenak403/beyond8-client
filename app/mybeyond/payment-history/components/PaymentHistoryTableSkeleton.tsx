import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentHistoryTableSkeleton() {
  return (
    <div className="rounded-md border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]">
              <Skeleton className="h-4 w-32" />
            </TableHead>
            <TableHead className="w-[160px]">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="w-[140px]">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="w-[180px]">
              <Skeleton className="h-4 w-28" />
            </TableHead>
            <TableHead className="w-[180px]">
              <Skeleton className="h-4 w-28" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-28 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

