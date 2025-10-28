import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import type { DashboardData } from '@/types';
import { TransactionList } from '@/components/transactions/TransactionList';
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
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

  const stats = [
    {
      name: 'Total Income',
      value: `₹${dashboardData.totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      trend: 'positive',
      description: 'All credits',
    },
    {
      name: 'Total Expense',
      value: `₹${dashboardData.totalExpense.toFixed(2)}`,
      icon: TrendingDown,
      trend: 'negative',
      description: 'All debits',
    },
    {
      name: 'Balance',
      value: `₹${dashboardData.balance.toFixed(2)}`,
      icon: DollarSign,
      trend: dashboardData.balance >= 0 ? 'positive' : 'negative',
      description: 'Net balance',
    },
    {
      name: 'Transactions',
      value: dashboardData.recentTransactions.length.toString(),
      icon: Wallet,
      trend: 'neutral',
      description: 'Recent entries',
    },
  ];

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Here's your financial overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <Icon className={`h-4 w-4 ${
                    stat.trend === 'positive' ? 'text-green-600' : 
                    stat.trend === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    stat.trend === 'positive' ? 'text-green-600' : 
                    stat.trend === 'negative' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.categoryBreakdown.length > 0 ? (
                <SpendingChart data={dashboardData.categoryBreakdown} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No spending data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.recentTransactions.length > 0 ? (
                <IncomeExpenseChart transactions={dashboardData.recentTransactions} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transaction data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Button onClick={() => setShowCreateDialog(true)} className="mb-4">
            + Add Transaction
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={dashboardData.recentTransactions} onUpdate={loadDashboard} />
          </CardContent>
        </Card>
      </div>

      <CreateTransactionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadDashboard}
      />
    </div>
  );
}

