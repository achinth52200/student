"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { ExpenseTracker } from "@/components/dashboard/expense-tracker";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Transaction } from "@/lib/types";

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 75.50, type: 'expense', category: 'Groceries', date: '2024-07-15T10:00:00Z', status: 'Completed' },
    { id: '2', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: '2024-07-15T12:30:00Z', status: 'Completed' },
    { id: '3', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: '2024-07-16T08:00:00Z', status: 'Completed' },
    { id: '4', description: 'Movie night', amount: 35.75, type: 'expense', category: 'Entertainment', date: '2024-07-16T20:00:00Z', status: 'Completed' },
    { id: '5', description: 'Electricity bill', amount: 75, type: 'expense', category: 'Utilities', date: '2024-07-17T14:00:00Z', status: 'Completed' },
    { id: '6', description: 'Scholarship', amount: 1000, type: 'income', category: 'Salary', date: '2024-07-18T11:00:00Z', status: 'Completed' },
];

export default function ExpensesPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      status: 'Completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <ExpenseTracker 
                    transactions={transactions} 
                    onAddTransaction={addTransaction} 
                    onDeleteTransaction={deleteTransaction}
                />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                        <CardDescription>A visual breakdown of your finances.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <BudgetChart transactions={transactions} />
                    </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
