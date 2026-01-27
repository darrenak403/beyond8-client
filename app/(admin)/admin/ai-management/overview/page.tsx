'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAIUsageStatistics, useAIAllHistory } from '@/hooks/useAI';
import { AIStats } from './components/AIStats';
import { AIChart } from './components/AIChart';


import { DataTable } from "@/components/ui/data-table";
import { PaginationState } from "@tanstack/react-table";
import { historyColumns } from './components/HistoryColumns';
import { AIHistorySkeleton } from './components/AIHistorySkeleton';

export default function AIOverviewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Statistics ---
  const { data: statsData, isLoading: isLoadingStats } = useAIUsageStatistics();
  const stats = statsData?.data;

  // --- History Table Logic ---
  const pageNumber = Number(searchParams.get('PageNumber')) || 1;
  const pageSize = Number(searchParams.get('PageSize')) || 5;
  const isDescending = searchParams.get('IsDescending') !== 'false';

  // Sync URL params
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

  const { data: historyRes, isLoading: isLoadingHistory } = useAIAllHistory({
    PageNumber: pageNumber,
    PageSize: pageSize,
    IsDescending: isDescending,
  });

  const history = historyRes?.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = historyRes?.metadata as any;
  const totalPages = metadata?.totalPages || 1;

  const pagination: PaginationState = {
      pageIndex: pageNumber - 1,
      pageSize: pageSize,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPagination = (updater: any) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      const params = new URLSearchParams(searchParams.toString());
      params.set("PageNumber", String(newPagination.pageIndex + 1));
      params.set("PageSize", String(newPagination.pageSize));
      router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">      
      {/* Statistics Cards */}
      <AIStats stats={stats} isLoading={isLoadingStats} />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-3">
          <AIChart stats={stats} isLoading={isLoadingStats} />
        </div>
        
        <div className="col-span-4 lg:col-span-4">
             <h3 className="font-semibold text-lg">Hoạt động gần đây</h3>
             {isLoadingHistory ? (
                <AIHistorySkeleton />
             ) : (
                <DataTable
                    data={history}
                    columns={historyColumns}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    pageCount={totalPages}
                    className="min-h-0"
                />
             )}
        </div>
      </div>
    </div>
  );
}