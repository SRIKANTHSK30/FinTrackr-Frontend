import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Home, Car, Zap, Bell, Clock } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  dueDate: string;
  amount?: string;
}

const reminders: Reminder[] = [
  { id: "1", title: "House Rent", icon: Home, dueDate: "8 Nov 2025", amount: "$100.00" },
  { id: "2", title: "Car Insurance", icon: Car, dueDate: "10 Nov 2025", amount: "$79.00" },
  { id: "3", title: "Electricity Bill", icon: Zap, dueDate: "15 Dec 2025", amount: "$45.00" },
  { id: "4", title: "Gym Subscription", icon: Bell, dueDate: "20 Nov 2025" },
  { id: "5", title: "Credit Card Bill", icon: Bell, dueDate: "30 Dec 2025", amount: "$210.00" },
];

export function DuePayments() {
  const [selectedTab, setSelectedTab] = useState<"Upcoming" | "Completed">("Upcoming");

  const filteredReminders = reminders
    .filter((r) =>
      selectedTab === "Upcoming"
        ? new Date(r.dueDate) >= new Date()
        : new Date(r.dueDate) < new Date()
    )
    .slice(0, 4); // limit to 4 items for dashboard

  return (
    <div className="max-w-[400px] w-full">
      <Card className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
             Due Payments / Reminders
            </CardTitle>
            <div className="flex gap-2">
              {["Upcoming", "Completed"].map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={selectedTab === tab ? "default" : "outline"}
                  onClick={() => setSelectedTab(tab as "Upcoming" | "Completed")}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${
                    selectedTab === tab
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-transparent border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          {filteredReminders.length > 0 ? (
            <div className="space-y-3">
              {filteredReminders.map((reminder) => {
                const Icon = reminder.icon;
                return (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252525] rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/15 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {reminder.dueDate}
                        </p>
                      </div>
                    </div>
                    {reminder.amount && (
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {reminder.amount}
                      </p>
                    )}
                  </div>
                );
              })}

              <Button
                variant="ghost"
                className="w-full mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                View All Reminders →
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              No {selectedTab.toLowerCase()} payments found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
