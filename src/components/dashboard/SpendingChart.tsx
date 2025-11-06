import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { CategoryStats } from '@/types';

interface SpendingChartProps {
  data: CategoryStats[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    name: item.categoryName || 'Unknown',
    value: Math.abs(Number(item.totalAmount || 0)),
  }));

  // Calculate total and percentage spent
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const spentPercentage = total > 0 ? Math.round((total / (total + 1000)) * 100) : 75; // Mock percentage

  return (
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Spending Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{spentPercentage}%</p>
                <p className="text-xs text-gray-400">Spent</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {chartData.slice(0, 4).map((item, index) => {
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{percentage}%</span>
                </div>
              );
            })}
            {chartData.length > 4 && (
              <div className="pt-2">
                <p className="text-sm text-gray-400">Others {100 - chartData.slice(0, 4).reduce((sum, item) => {
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return sum + pct;
                }, 0)}%</p>
              </div>
            )}
            <Button
              variant="ghost"
              className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
            >
              View Full
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
