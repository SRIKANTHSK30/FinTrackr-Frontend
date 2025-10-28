import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import type { Transaction } from '@/types';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));

  // Group transactions by date
  const data = last7Days.reverse().map((date) => {
    const dateStr = format(date, 'MMM dd');
    const dayTransactions = transactions.filter(
      (t) => format(new Date(t.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return {
      date: dateStr,
      Income: dayTransactions
        .filter((t) => t.type === 'CREDIT')
        .reduce((sum, t) => sum + t.amount, 0),
      Expense: dayTransactions
        .filter((t) => t.type === 'DEBIT')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="Income" fill="#00C49F" />
          <Bar dataKey="Expense" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

