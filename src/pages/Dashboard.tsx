import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { DuePayments } from "@/components/dashboard/PaymentSchedule";
import { MonthlyOverview } from "@/components/dashboard/MonthlyOverview";
import { MonthlyBudget } from "@/components/dashboard/MonthlyBudget";
import { RecentTransactionsTable } from "@/components/transactions/RecentTransactionsTable";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import CountUp from "react-countup";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  TrendingUp,
  TrendingDown,
  Gift,
} from "lucide-react";
import type { DashboardData } from "@/types";
import { SavingsStreak } from "@/components/dashboard/SavingsStreak";
import { MonthlyChallenge } from "@/components/dashboard/MonthlyChallenge";
import { api } from "@/lib/api";

// Define Challenge interface to match MonthlyChallenge props
interface Challenge {
  title: string;
  description: string;
  target: number;
  current: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuthStore();
  const [streakDays] = useState(5);
  const [monthlyChallenge, setMonthlyChallenge] = useState<Challenge | null>(null);

  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");

  // 🌤️ Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("🌤️ Good Morning");
    else if (hour < 18) setGreeting("☀️ Good Afternoon");
    else setGreeting("🌙 Good Evening");
    setDate(format(new Date(), "EEEE, MMMM d"));
  }, []);

  // 📊 Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await api.user.getDashboard();
        setDashboardData(data);
        setMonthlyChallenge(data.challenge || null);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData)
    return (
      <div className="text-center mt-10 text-gray-500">
        No dashboard data available.
      </div>
    );

  // 🧮 Stats setup
  const username = user?.name || "User";
  const totalIncome = parseFloat(dashboardData.totalIncome || "0");
  const totalExpenses = parseFloat(dashboardData.totalExpenses || "0");
  const netSavings = totalIncome - totalExpenses;
  const currentBalance = parseFloat(dashboardData.balance || "0");

  const stats = [
    {
      name: "Current Balance",
      value: currentBalance,
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
      color: "text-blue-600 dark:text-blue-400",
      indicator: <ArrowUpRight className="h-3 w-3 text-blue-500" />,
    },
    {
      name: "Total Income",
      value: totalIncome,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      color: "text-green-600 dark:text-green-400",
      indicator: <ArrowUpRight className="h-3 w-3 text-green-500" />,
    },
    {
      name: "Total Expenses",
      value: totalExpenses,
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
      color: "text-red-600 dark:text-red-400",
      indicator: <ArrowDownRight className="h-3 w-3 text-red-500" />,
    },
    {
      name: "Net Savings",
      value: netSavings,
      icon: <PiggyBank className="h-5 w-5 text-emerald-500" />,
      color:
        netSavings >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
      indicator:
        netSavings >= 0 ? (
          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
        ) : (
          <ArrowDownRight className="h-3 w-3 text-red-500" />
        ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-[#141414] dark:text-gray-100 transition-colors duration-300">
      <div className="w-full px-7 py-10 space-y-8">
        {/* 🌤️ Dynamic Greeting Section */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 p-5 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting},{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {username}
              </motion.span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-semibold">
              Here’s your financial overview for{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {date}
              </span>
              . Keep up the great work 💪
            </p>
          </div>
        </motion.div>

        {/* 💰 Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-md transition-all"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {stat.icon} {stat.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold flex items-center gap-1 ${stat.color}`}
                >
                  ₹
                  <CountUp
                    end={stat.value}
                    duration={1.5}
                    separator=","
                    decimals={2}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1 leading-none">
                  {stat.indicator}
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 📊 Charts Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 h-[420px]">
            <CashFlowChart transactions={dashboardData.recentTransactions} />
          </div>

          <div className="space-y-4">
            <MonthlyOverview
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              savings={netSavings}
            />
            <MonthlyBudget totalExpenses={totalExpenses} />
          </div>
        </div>

        {/* 📈 Spending + Payments + Challenges */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 max-w-[480px] w-full -mt-[79px]">
            <SpendingChart data={dashboardData.categoryBreakdown} />
          </div>

          <div className="md:col-span-1 flex-1 -mt-[79px]">
            <DuePayments />
          </div>

          <div className="md:col-span-1 flex-1 space-y-6">
            <SavingsStreak streakDays={streakDays} maxStreak={30} />
            {monthlyChallenge ? (
  <MonthlyChallenge challenge={monthlyChallenge} />
) : (
  <Card className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-pink-500" />
      <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
        Monthly Challenge
      </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-6 text-center">
      <p className="text-sm text-muted-foreground">
        No active challenge this month 💭
      </p>
    </CardContent>
  </Card>
)}
          </div>
        </div>

        {/* 🧾 Recent Transactions */}
        <RecentTransactionsTable
          transactions={[...dashboardData.recentTransactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)}
        />
      </div>

      <CreateTransactionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {}}
      />
    </div>
  );
}
