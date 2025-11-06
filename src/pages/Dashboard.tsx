import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { PaymentSchedule } from '@/components/dashboard/PaymentSchedule';
import { MonthlyOverview } from '@/components/dashboard/MonthlyOverview';
import { RecentTransactionsTable } from '@/components/transactions/RecentTransactionsTable';
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { DashboardData } from '@/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.user.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!dashboardData) {
    return <div>Failed to load dashboard data</div>;
  }

  const totalBalance = parseFloat(dashboardData.balance || '0');
  const totalSavings = parseFloat(dashboardData.totalIncome || '0') - parseFloat(dashboardData.totalExpenses || '0');
  const revenue = parseFloat(dashboardData.totalIncome || '0');
  const credit = parseFloat(dashboardData.totalExpenses || '0');

  const stats = [
    {
      name: 'Total Balance',
      value: `$${(totalBalance || 56240).toLocaleString()}`,
      trend: 'positive' as const,
      indicator: <ArrowUpRight className="h-3 w-3 text-green-500" />,
    },
    {
      name: 'Total Savings',
      value: `$${(totalSavings || 14200).toLocaleString()}`,
      trend: 'negative' as const,
      indicator: <ArrowDownRight className="h-3 w-3 text-red-500" />,
    },
    {
      name: 'Revenue',
      value: `$${(revenue || 14200).toLocaleString()}`,
      trend: 'positive' as const,
      indicator: <ArrowUpRight className="h-3 w-3 text-green-500" />,
    },
    {
      name: 'Credit',
      value: `$${(credit || 14200).toLocaleString()}`,
      trend: 'negative' as const,
      indicator: <ArrowDownRight className="h-3 w-3 text-red-500" />,
    },
  ];

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Top Bar */}
      <DashboardTopBar />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name} className="bg-[#1f1f1f] border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">{stat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {stat.indicator}
                    <span>vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cash Flow Chart */}
          <CashFlowChart transactions={dashboardData.recentTransactions} />

          {/* Second Row: Spending Categories, Payment Schedule, Monthly Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Spending Categories */}
            <div className="md:col-span-1">
              {dashboardData.categoryBreakdown.length > 0 ? (
                <SpendingChart data={dashboardData.categoryBreakdown} />
              ) : (
                <Card className="bg-[#1f1f1f] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Spending Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-gray-400">No spending data yet</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Schedule */}
            <div className="md:col-span-1">
              <PaymentSchedule />
            </div>

            {/* Monthly Overview */}
            <div className="md:col-span-1">
              <MonthlyOverview
                totalIncome={revenue}
                totalExpenses={credit}
                savings={totalSavings}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <RecentTransactionsTable transactions={dashboardData.recentTransactions} />
        </div>
      </div>

      <CreateTransactionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadDashboard}
      />
    </div>
  );
}

