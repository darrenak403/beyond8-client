'use client';

import { StatsCards } from './components/StatsCards';
import { RevenueChart } from './components/RevenueChart';
import { TrafficChart } from './components/TrafficChart';
import { useIsMobile } from '@/hooks/useMobile';

export default function AdminDashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      {/* Stats Cards */}
      <StatsCards />

        <RevenueChart />

      {/* Bottom: Traffic Chart */}
      <TrafficChart />
    </div>
  );
}
