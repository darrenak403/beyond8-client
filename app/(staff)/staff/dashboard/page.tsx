'use client';

import { StatsCards } from '@/app/(admin)/admin/dashboard/components/StatsCards';
import { RevenueChart } from '@/app/(admin)/admin/dashboard/components/RevenueChart';
import { CashflowChart } from '@/app/(admin)/admin/dashboard/components/CashflowChart';
import { TrafficChart } from '@/app/(admin)/admin/dashboard/components/TrafficChart';
import { useIsMobile } from '@/hooks/useMobile';

export default function StaffDashboard() {
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
