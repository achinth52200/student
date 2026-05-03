
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
  Sparkles, BookOpen, HeartPulse, Receipt, Clock, Zap,
} from "lucide-react";
import Link from "next/link";

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 75.50, type: 'expense', category: 'Groceries', date: '2024-07-15T10:00:00Z', status: 'Completed' },
    { id: '2', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: '2024-07-15T12:30:00Z', status: 'Completed' },
    { id: '3', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: '2024-07-16T08:00:00Z', status: 'Completed' },
];

const quickActions = [
  { label: "Expenses", desc: "Track & scan", icon: Receipt, href: "/expenses", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50", shadow: "shadow-blue-500/15", text: "text-blue-600" },
  { label: "Study Plan", desc: "AI schedule", icon: BookOpen, href: "/study-planner", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", shadow: "shadow-emerald-500/15", text: "text-emerald-600" },
  { label: "Well-being", desc: "AI mentor", icon: HeartPulse, href: "/well-being", gradient: "from-rose-500 to-pink-500", bg: "bg-rose-50", shadow: "shadow-rose-500/15", text: "text-rose-600" },
  { label: "Reminders", desc: "Stay on track", icon: Clock, href: "/reminders", gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", shadow: "shadow-amber-500/15", text: "text-amber-600" },
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
      label: "Total Income", value: `₹${totalIncome.toLocaleString()}`,
      change: "+12.5%", positive: true,
      icon: TrendingUp, iconGradient: "from-emerald-400 to-green-500",
      bgGradient: "from-emerald-50 to-green-50/50",
      borderColor: "border-emerald-200/60",
      dotClass: "dot-green",
    },
    {
      label: "Total Expenses", value: `₹${totalExpense.toLocaleString()}`,
      change: "-3.2%", positive: false,
      icon: TrendingDown, iconGradient: "from-rose-400 to-red-500",
      bgGradient: "from-rose-50 to-red-50/50",
      borderColor: "border-rose-200/60",
      dotClass: "dot-rose",
    },
    {
      label: "Net Balance", value: `₹${balance.toLocaleString()}`,
      change: "+8.1%", positive: true,
      icon: Wallet, iconGradient: "from-indigo-400 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50/50",
      borderColor: "border-indigo-200/60",
      dotClass: "dot-violet",
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
              <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 30%, rgba(236,72,153,0.04) 60%, rgba(6,182,212,0.03) 100%)',
                }}
              >
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-30 blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />
                <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full opacity-20 blur-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }} />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 tag-gradient mb-3">
                    <Sparkles className="w-3 h-3" /> Dashboard Overview
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {greeting},{" "}
                    <span className="gradient-text-vivid">{user?.displayName || 'Student'}</span> 👋
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                    Your AI-powered command center for academics, finances, and wellness.
                  </p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className={`stat-card rounded-2xl p-5 bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={stat.dotClass} />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.iconGradient} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-4.5 h-4.5 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-xs font-bold ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-[11px] text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70 mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <Link key={i} href={action.href}
                      className={`group relative rounded-2xl p-4 border border-transparent ${action.bg} hover:border-slate-200 hover:shadow-lg ${action.shadow} transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold block">{action.label}</span>
                          <span className={`text-[11px] ${action.text} font-medium`}>{action.desc}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <Card className="premium-card rounded-2xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/15">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">Budget Overview</CardTitle>
                          <CardDescription className="text-xs">Financial breakdown by category</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <BudgetChart transactions={transactions} />
                    </CardContent>
                  </Card>
                </div>

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
