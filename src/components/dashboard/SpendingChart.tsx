import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import type { CategoryStats } from "@/types";
import { motion } from "framer-motion";
import { PieChartIcon } from "lucide-react";

interface SpendingChartProps {
  data: CategoryStats[];
}

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
];

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    name: item.categoryName || "Unknown",
    value: Math.abs(Number(item.totalAmount || 0)),
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const spentPercentage =
    total > 0 ? Math.round((total / (total + 1000)) * 100) : 75;

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl h-[360px]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <CardTitle className="text-gray-900 dark:text-gray-100 text-base font-semibold">
          Spending Categories
        </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart Section */}
        <div className="relative w-[150px] h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {spentPercentage}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
            </motion.div>
          </div>
        </div>

        {/* Legend + Details Section */}
        <div className="flex-1 w-full mt-4 lg:mt-10 space-y-3">
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No spending data available yet.
            </p>
          ) : (
            <>
              {chartData.slice(0, 5).map((item, index) => {
                const percentage =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      {percentage}%
                    </span>
                  </div>
                );
              })}

              {chartData.length > 5 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">
                  + {chartData.length - 5} more categories
                </p>
              )}
            </>
          )}

          <Button
            variant="ghost"
            className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-600/10 text-sm font-medium"
          >
            View Full Breakdown →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
