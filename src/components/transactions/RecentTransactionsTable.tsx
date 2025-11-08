import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpRight, ArrowDownLeft, Coins } from "lucide-react";
import type { Transaction } from "@/types";

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      t.category?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower) ||
      t.type?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "failed":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <Card className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
       <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div className="flex items-center gap-2">
    <Coins className="h-5 w-5 text-pink-500" />
    <CardTitle className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
      Recent Transactions
    </CardTitle>
  </div>
     

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-56 sm:w-64 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 rounded-lg"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-[#1a1a1a]">
                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold">
                  <div className="text-left pl-8">Description</div>
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right">
                  Amount
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-center">
                  Category
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400 font-semibold text-right ">
                   <div className="text-right pr-8">Date</div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 dark:text-gray-400 py-8 font-semibold"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((t) => (
                  <TableRow
                    key={t.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1c1c1c] transition-all duration-200 rounded-lg"
                  >
                    <TableCell className="flex items-center gap-3 py-3">
                      {t.type === "CREDIT" ? (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500/10">
                          <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500/10">
                          <ArrowUpRight className="h-4 w-4 text-red-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {t.description || "Transaction"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.category || "General"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell
                      className={`font-semibold text-right ${
                        t.type === "CREDIT"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {t.type === "CREDIT" ? "+" : "-"}₹
                      {typeof t.amount === "string"
                        ? parseFloat(t.amount).toFixed(2)
                        : t.amount.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-center text-gray-400 dark:text-gray-300 font-semibold">
                      <span className="capitalize">{t.category || "Other"}</span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full font-semibold ${getStatusColor(
                          t.status || "completed"
                        )}`}
                      >
                        {(t.status || "Completed").toString()}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-gray-400 dark:text-gray-300 font-semibold">
                      {format(new Date(t.date), "MMM dd, yyyy")}
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
