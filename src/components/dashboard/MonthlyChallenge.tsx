import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";

interface Challenge {
  title: string;
  description: string;
  target: number;
  current: number;
}

interface MonthlyChallengeProps {
  challenge: Challenge;
}

export function MonthlyChallenge({ challenge }: MonthlyChallengeProps) {
  const { title, description, target, current } = challenge;
  const progress = Math.min((current / target) * 100, 100);

  const isCompleted = progress >= 100;

  return (
    <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl transition-colors duration-300">
       <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-pink-500" />
        <CardTitle className="text-gray-900 dark:text-gray-100 font-semibold text-lg">Monthly Challenge</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-1"
          >
            {title}
          </motion.p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className={`h-3 rounded-full transition-all ${
                isCompleted ? "bg-green-500" : "bg-pink-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {current} / {target} ({Math.round(progress)}%)
          </p>

          {isCompleted && (
            <p className="mt-2 text-green-600 dark:text-green-400 font-medium text-sm">
              🎉 Challenge Completed! Great job!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
