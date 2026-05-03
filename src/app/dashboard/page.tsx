
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
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight,
  Sparkles, BookOpen, HeartPulse, Receipt, Clock,
} from "lucide-react";
import Link from "next/link";

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 75.50, type: 'expense', category: 'Groceries', date: '2024-07-15T10:00:00Z', status: 'Completed' },
    { id: '2', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: '2024-07-15T12:30:00Z', status: 'Completed' },
    { id: '3', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: '2024-07-16T08:00:00Z', status: 'Completed' },
];

const quickActions = [
  { label: "Expenses", icon: Receipt, href: "/expenses", color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
  { label: "Study Plan", icon: BookOpen, href: "/study-planner", color: "from-violet-500 to-purple-400", shadow: "shadow-violet-500/20" },
  { label: "Well-being", icon: HeartPulse, href: "/well-being", color: "from-rose-500 to-pink-400", shadow: "shadow-rose-500/20" },
  { label: "Reminders", icon: Clock, href: "/reminders", color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/20" },
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

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const stats = [
    {
      label: "Total Income",
      value: `₹${totalIncome.toLocaleString()}`,
      change: "+12.5%",
      positive: true,
      icon: TrendingUp,
      color: "text-emerald-400",
      dotColor: "bg-emerald-400",
    },
    {
      label: "Total Expenses",
      value: `₹${totalExpense.toLocaleString()}`,
      change: "-3.2%",
      positive: false,
      icon: TrendingDown,
      color: "text-rose-400",
      dotColor: "bg-rose-400",
    },
    {
      label: "Net Balance",
      value: `₹${balance.toLocaleString()}`,
      change: "+8.1%",
      positive: true,
      icon: Wallet,
      color: "text-[hsl(250,90%,72%)]",
      dotColor: "bg-[hsl(250,90%,65%)]",
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
            <main className="p-5 sm:p-6 lg:p-8 space-y-6">

              {/* Hero Welcome */}
              <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-[hsla(250,90%,65%,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(250,90%,65%,0.08)] via-transparent to-[hsla(200,85%,55%,0.05)]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-[hsla(250,90%,65%,0.06)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[hsl(250,90%,72%)]" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dashboard</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome back, <span className="gradient-text">{user?.displayName || 'Student'}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
                    Here&apos;s your financial overview and AI-powered insights for today.
                  </p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="stat-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`activity-dot ${stat.dotColor}`} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                      </div>
                      <div className={`stat-icon-wrap ${stat.color}`}>
                        <stat.icon className="w-5 h-5 relative z-10" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-xs font-semibold ${stat.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className={`group relative rounded-xl p-4 border border-[hsla(250,30%,25%,0.12)] bg-[hsla(225,18%,9%,0.5)] hover:border-[hsla(250,90%,65%,0.15)] transition-all duration-300 hover:-translate-y-0.5`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg ${action.shadow} group-hover:scale-105 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{action.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Budget Chart - Takes 3 cols */}
                <div className="lg:col-span-3">
                  <Card className="premium-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[hsla(250,90%,65%,0.12)] flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-[hsl(250,90%,72%)]" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Budget Overview</CardTitle>
                          <CardDescription className="text-xs">Financial breakdown by category</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <BudgetChart transactions={transactions} />
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Takes 2 cols */}
                <div className="lg:col-span-2 space-y-6">
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
