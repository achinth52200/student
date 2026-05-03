
"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { PersonalizedTips } from "@/components/dashboard/personalized-tips";
import { Reminders } from "@/components/dashboard/reminders";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import type { Transaction } from "@/lib/types";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { useAuth } from "@/hooks/use-auth";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 75.50, type: 'expense', category: 'Groceries', date: '2024-07-15T10:00:00Z', status: 'Completed' },
    { id: '2', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: '2024-07-15T12:30:00Z', status: 'Completed' },
    { id: '3', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: '2024-07-16T08:00:00Z', status: 'Completed' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const storageKey = user ? `transactions_${user.uid}` : 'transactions_guest';

  React.useEffect(() => {
    const storedTransactions = localStorage.getItem(storageKey);
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      localStorage.setItem(storageKey, JSON.stringify(initialTransactions));
      setTransactions(initialTransactions);
    }
  }, [storageKey]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const statCards = [
    {
      label: "Total Income",
      value: `₹${totalIncome.toFixed(0)}`,
      icon: TrendingUp,
      gradient: "from-emerald-500/15 to-green-500/5",
      iconColor: "text-emerald-500",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Total Expenses",
      value: `₹${totalExpense.toFixed(0)}`,
      icon: TrendingDown,
      gradient: "from-rose-500/15 to-red-500/5",
      iconColor: "text-rose-500",
      borderColor: "border-rose-500/20",
    },
    {
      label: "Balance",
      value: `₹${balance.toFixed(0)}`,
      icon: Wallet,
      gradient: "from-primary/15 to-purple-500/5",
      iconColor: "text-primary",
      borderColor: "border-primary/20",
    },
    {
      label: "Transactions",
      value: transactions.length.toString(),
      icon: Target,
      gradient: "from-amber-500/15 to-orange-500/5",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              {/* Welcome Banner */}
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/10 border border-primary/10">
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back, <span className="gradient-text">{user?.displayName || 'Student'}</span> 👋
                </h2>
                <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your student life today.</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat, i) => (
                  <Card key={i} className={`premium-card bg-gradient-to-br ${stat.gradient} border ${stat.borderColor}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`stat-icon ${stat.iconColor}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                <div className="grid grid-cols-1 gap-6 md:col-span-2">
                   <Card className="premium-card">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            Budget Overview
                          </CardTitle>
                          <CardDescription>A visual breakdown of your finances.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <BudgetChart transactions={transactions} />
                      </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <Reminders />
                  <PersonalizedTips />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
