import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AIUsageTableSkeleton() {
  return (
    <div className="rounded-md border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]"><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead className="w-[150px]"><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            <TableHead className="w-[180px]"><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead className="w-[120px]"><Skeleton className="h-4 w-20" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-2 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="w-px h-8 bg-gray-100 mx-1" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-2 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="w-px h-8 bg-gray-100 mx-1" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-2 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
