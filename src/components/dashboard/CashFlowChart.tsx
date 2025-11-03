import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { Transaction } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface CashFlowChartProps {
  transactions: Transaction[];
}

type TimeRange = 'Week' | 'Month' | 'Year' | 'All';

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Month');

  // Generate data based on selected range
  const getChartData = () => {
    if (selectedRange === 'Month') {
      // Last 12 months
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

    // For other ranges, return sample data structure
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
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Cash Flow</CardTitle>
          <div className="flex gap-2">
            {(['Week', 'Month', 'Year', 'All'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className={
                  selectedRange === range
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800'
                }
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 300]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#252525',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend
                wrapperStyle={{ color: '#fff' }}
                iconType="line"
              />
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
        </div>
      </CardContent>
    </Card>
  );
}

