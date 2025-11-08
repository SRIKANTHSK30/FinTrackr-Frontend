import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";

interface MonthlyBudgetProps {
  totalExpenses: number;
  budgetLimit?: number;
}

export function MonthlyBudget({ totalExpenses, budgetLimit = 20000 }: MonthlyBudgetProps) {
  const spentPercentage = Math.min((totalExpenses / budgetLimit) * 100, 100);
  const isOverBudget = totalExpenses > budgetLimit;

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-sm transition-all">
      <CardHeader>
         <div className="flex items-center gap-2">
             <Gauge className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          Monthly Budget
        </CardTitle>
            </div>
          <div className="flex items-center gap-2">
    {isOverBudget && (
      <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">
        Over Budget!
      </span>
    )}
  </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Budget: ₹{budgetLimit.toLocaleString()}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-3 transition-all ${
              isOverBudget ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${spentPercentage}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Spent: ₹{totalExpenses.toLocaleString()}</span>
          <span>{spentPercentage.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
