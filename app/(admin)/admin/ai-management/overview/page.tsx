'use client';

import React from 'react';
import { useAIUsageStatistics } from '@/hooks/useAI';
import { AIStats } from './components/AIStats';
import { AIChart } from './components/AIChart';
import { AIHistoryTable } from './components/AIHistoryTable';

export default function AIOverviewPage() {
  const { data: statsData, isLoading } = useAIUsageStatistics();
  const stats = statsData?.data;

  return (
    <div className="space-y-6">      
      {/* Statistics Cards */}
      <AIStats stats={stats} isLoading={isLoading} />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Section - Takes 3 cols on large screens */}
        <div className="col-span-4 lg:col-span-3">
          <AIChart stats={stats} isLoading={isLoading} />
        </div>
        
        {/* Recent History Table - Takes 4 cols on large screens */}
        <div className="col-span-4 lg:col-span-4">
          <AIHistoryTable />
        </div>
      </div>
    </div>
  );
}