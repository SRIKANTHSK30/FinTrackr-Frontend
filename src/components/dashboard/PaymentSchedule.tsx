import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Home, Car, Zap } from 'lucide-react';

interface Payment {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  dueDate: string;
  amount: string;
}

const payments: Payment[] = [
  {
    id: '1',
    name: 'House Rent',
    icon: Home,
    dueDate: '8 Nov 2025',
    amount: '$100.00',
  },
  {
    id: '2',
    name: 'Car Insurance',
    icon: Car,
    dueDate: '10 Nov 2025',
    amount: '$79.00',
  },
  {
    id: '3',
    name: 'Electricity Bill',
    icon: Zap,
    dueDate: '15 Dec 2025',
    amount: '$45.00',
  },
];

export function PaymentSchedule() {
  const [selectedTab, setSelectedTab] = useState<'Transfer' | 'Request'>('Transfer');

  return (
    <Card className="bg-[#1f1f1f] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Payment Schedule</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedTab === 'Transfer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('Transfer')}
              className={
                selectedTab === 'Transfer'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800'
              }
            >
              Transfer
            </Button>
            <Button
              variant={selectedTab === 'Request' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('Request')}
              className={
                selectedTab === 'Request'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800'
              }
            >
              Request
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => {
            const Icon = payment.icon;
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{payment.name}</p>
                    <p className="text-xs text-gray-400">{payment.dueDate}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">{payment.amount}</p>
              </div>
            );
          })}
          <Button
            variant="ghost"
            className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
          >
            View all
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

