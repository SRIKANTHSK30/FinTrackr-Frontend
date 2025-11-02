import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryStats } from '@/types';
import type { PieLabelRenderProps } from 'recharts';

interface SpendingChartProps {
  data: CategoryStats[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: Math.abs(Number(item.totalAmount)),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: PieLabelRenderProps) => {
              const { name, percent, cx, cy } = props;
              const percentage = typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'; // ✅ safe check
              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#000"
                >
                  {`${name ?? ''} ${percentage}%`}
                </text>
              );
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
