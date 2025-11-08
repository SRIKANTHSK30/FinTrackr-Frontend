import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { Transaction } from '@/types';
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from 'date-fns';
import { Activity } from 'lucide-react'; // Icon for Cash Flow

interface CashFlowChartProps {
  transactions: Transaction[];
}

type TimeRange = 'Week' | 'Month' | 'Year' | 'All';

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Month');

  const getChartData = () => {
    if (selectedRange === 'Month') {
      const months = eachMonthOfInterval({
        start: subMonths(new Date(), 11),
        end: new Date(),
      });

      return months.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthTransactions = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return tDate >= monthStart && tDate <= monthEnd;
        });

        return {
          month: format(month, 'MMM'),
          Income: monthTransactions
            .filter((t) => t.type === 'CREDIT')
            .reduce((sum, t) => sum + Number(t.amount), 0),
          Expense: monthTransactions
            .filter((t) => t.type === 'DEBIT')
            .reduce((sum, t) => sum + Number(t.amount), 0),
        };
      });
    }

    // Placeholder data for other ranges
    return Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(new Date(), 11 - i);
      return {
        month: format(month, 'MMM'),
        Income: Math.random() * 200 + 50,
        Expense: Math.random() * 150 + 50,
      };
    });
  };

  const data = getChartData();

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
            Cash Flow
          </CardTitle>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['Week', 'Month', 'Year', 'All'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={selectedRange === range ? 'default' : 'outline'}
              onClick={() => setSelectedRange(range)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedRange === range
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
            />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#000',
              }}
            />
            <Legend wrapperStyle={{ color: '#6b7280' }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 4 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="Expense"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
