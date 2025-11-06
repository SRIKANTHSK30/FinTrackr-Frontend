import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Income</p>
              <p className="text-xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Savings</p>
              <p className="text-xl font-bold text-green-500">${savings.toFixed(2)}</p>
            </div>
          </div>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-bold text-white">{savingsPercentage}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

