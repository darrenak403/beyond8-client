'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAIUsageHistory } from '@/hooks/useAI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AIHistoryTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const pageNumber = Number(searchParams.get('PageNumber')) || 1;
  const pageSize = Number(searchParams.get('PageSize')) || 5;
  const isDescending = searchParams.get('IsDescending') !== 'false'; // Default to true

  // Sync default params to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    if (!searchParams.has('PageNumber')) {
      params.set('PageNumber', '1');
      hasChanges = true;
    }
    if (!searchParams.has('PageSize')) {
      params.set('PageSize', '5');
      hasChanges = true;
    }
    if (!searchParams.has('IsDescending')) {
      params.set('IsDescending', 'true');
      hasChanges = true;
    }

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const { data: historyRes, isLoading } = useAIUsageHistory({
    PageNumber: pageNumber,
    PageSize: pageSize,
    IsDescending: isDescending,
  });

  const history = historyRes?.data || [];

  return (
    <Card className="col-span-4 shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Thao tác</TableHead>
              <TableHead className="text-right">Chi phí</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <TableRow key={i}>
                   <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                   <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                 </TableRow>
               ))
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Chưa có hoạt động nào gần đây.
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(record.createdAt), 'MMM dd, HH:mm')}
                  </TableCell>
                  <TableCell>
                      {record.model}
                  </TableCell>
                  <TableCell>{record.operation}</TableCell>
                  <TableCell className="text-right font-medium">
                     ${record.totalCost.toFixed(6)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'Success' ? 'default' : 'destructive'} 
                           className={record.status === 'Success' ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-none' : ''}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
