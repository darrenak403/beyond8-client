'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIUsageStatistics } from '@/lib/api/services/fetchAI';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface AIChartProps {
  stats?: AIUsageStatistics;
  isLoading: boolean;
}

export function AIChart({ stats, isLoading }: AIChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl" />;
  }
  
  const tokenData = [
    {
      name: 'Tokens',
      Input: stats?.totalInputTokens || 0,
      Output: stats?.totalOutputTokens || 0,
    },
  ];

  return (
    <Card className="col-span-4 shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle>Phân bổ Tokens</CardTitle>
        <CardDescription>
          So sánh lượng tokens đầu vào và đầu ra
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tokenData} layout="vertical" barSize={40}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={50} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Input" fill="var(--secondary)" radius={[0, 4, 4, 0]} name="Tokens Đầu vào" stackId="a" />
              <Bar dataKey="Output" fill="var(--brand-pink)" radius={[0, 4, 4, 0]} name="Tokens Đầu ra" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
