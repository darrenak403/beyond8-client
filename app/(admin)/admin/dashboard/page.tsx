'use client';

import { StatsCards } from './components/StatsCards';
import { RevenueChart } from './components/RevenueChart';
import { CashflowChart } from './components/CashflowChart';
import { TrafficChart } from './components/TrafficChart';
import { useIsMobile } from '@/hooks/useMobile';

export default function AdminDashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      {/* Stats Cards */}
      <StatsCards />

      {/* Middle Row: Revenue & Cashflow */}
      <div className={`grid ${isMobile ? 'gap-2' : 'gap-4 lg:grid-cols-2'}`}>
        <RevenueChart />
        <CashflowChart />
      </div>

      {/* Bottom: Traffic Chart */}
      <TrafficChart />
    </div>
  );
}
