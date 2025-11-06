import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid } from 'lucide-react';
import Badge from '@/components/ui/badge';
import type { Transaction } from '@/types';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      t.category?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower) ||
      t.type?.toLowerCase().includes(searchLower)
    );
  });

  const getTransactionName = (transaction: Transaction): string => {
    // Extract company/service name from description or category
    if (transaction.description) {
      const parts = transaction.description.split(' ');
      return parts[0] || transaction.category || 'Transaction';
    }
    return transaction.category || 'Transaction';
  };

  const getStatusColor = (transaction: Transaction): string => {
    // For now, mark all as completed except last one can be processing
    const isLast = transactions.indexOf(transaction) === transactions.length - 1;
    return isLast && transaction.type === 'DEBIT' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400';
  };

  const getStatusText = (transaction: Transaction): string => {
    const isLast = transactions.indexOf(transaction) === transactions.length - 1;
    return isLast && transaction.type === 'DEBIT' ? 'Processing' : 'Completed';
  };

  return (
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Transaction</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 bg-[#252525] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Grid className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Transaction</TableHead>
                <TableHead className="text-gray-400">Date & Time</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-[#252525]">
                    <TableCell className="font-medium text-white">
                      {getTransactionName(transaction)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {transaction.description || transaction.category}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {(() => {
                        const date = new Date(transaction.date);
                        const timeDate = transaction.createdAt ? new Date(transaction.createdAt) : date;
                        const hours = timeDate.getHours();
                        const minutes = timeDate.getMinutes();
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        const formattedHours = hours % 12 || 12;
                        const formattedMinutes = minutes.toString().padStart(2, '0');
                        return `${format(date, 'MMM dd, yyyy')} - ${formattedHours}:${formattedMinutes} ${ampm}`;
                      })()}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        transaction.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'CREDIT' ? '+' : '-'}$
                      {typeof transaction.amount === 'string'
                        ? parseFloat(transaction.amount || '0').toFixed(2)
                        : transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction)}>
                        {getStatusText(transaction)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

