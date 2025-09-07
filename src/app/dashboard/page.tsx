
"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { PersonalizedTips } from "@/components/dashboard/personalized-tips";
import { Reminders } from "@/components/dashboard/reminders";
import { WellbeingChat } from "@/components/dashboard/wellbeing-chat";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import type { Transaction } from "@/lib/types";

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 75.50, type: 'expense', category: 'Groceries', date: '2024-07-15T10:00:00Z', status: 'Completed' },
    { id: '2', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: '2024-07-15T12:30:00Z', status: 'Completed' },
    { id: '3', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: '2024-07-16T08:00:00Z', status: 'Completed' },
];

export default function DashboardPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                 <WellbeingChat />
              </div>
              <div className="grid grid-cols-1 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                        <CardDescription>A visual breakdown of your finances.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BudgetChart transactions={transactions} />
                    </CardContent>
                </Card>
                <Reminders />
                <PersonalizedTips />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
