import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MonthlyOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

const COLORS = ['#22c55e', '#ef4444'];

export function MonthlyOverview({ totalIncome, totalExpenses, savings }: MonthlyOverviewProps) {
  const data = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ];

  const savingsPercentage = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <CardTitle className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
            Monthly Overview
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          {/* Stats Section */}
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
              <p className="text-xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Savings</p>
              <p className="text-xl font-bold text-green-500">${savings.toFixed(2)}</p>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="relative w-40 h-40 lg:w-48 lg:h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35} // slightly bigger
                  outerRadius={60} // slightly bigger
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {savingsPercentage}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saved</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
