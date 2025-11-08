import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface SavingsStreakProps {
  streakDays: number;
  maxStreak?: number;
}

export function SavingsStreak({ streakDays, maxStreak = 30 }: SavingsStreakProps) {
  const percentage = Math.min((streakDays / maxStreak) * 100, 100);

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl transition-colors duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
            Savings Streak
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{streakDays} days</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">staying within budget!</p>
          </motion.div>

          {/* Progress bar with shorter width */}
          <div className="mt-3 w-4/5 mx-auto h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-3 bg-yellow-500 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
