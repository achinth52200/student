"use client";
import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Banknote, Wallet } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-card border rounded-lg shadow-sm">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-primary">{`Amount: ₹${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
  
    return null;
  };

export function BudgetChart({ transactions }: { transactions: Transaction[] }) {
    const { income, expenses, expenseChartData, incomeChartData } = React.useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        const expenseByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                const category = transaction.category || 'Other';
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += transaction.amount;
                return acc;
            }, {} as Record<string, number>);
        
        const incomeByCategory = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, transaction) => {
                const category = transaction.category || 'Other';
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += transaction.amount;
                return acc;
            }, {} as Record<string, number>);

        const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
        const incomeChartData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));

        return { income, expenses, expenseChartData, incomeChartData };
    }, [transactions]);
    
    const balance = income - expenses;

  return (
    <>
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
            <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseChartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'hsl(var(--accent) / 0.5)'}} content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                            {expenseChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
        <TabsContent value="income">
             <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--accent) / 0.5)' }}
                            contentStyle={{
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                            formatter={(value) => `₹${Number(value).toFixed(2)}`}
                        />
                        <Pie
                            data={incomeChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            paddingAngle={5}
                            stroke="hsl(var(--background))"
                            strokeWidth={3}
                        >
                            {incomeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </TabsContent>
      </Tabs>
       <CardFooter className="flex-col items-start gap-4 border-t pt-6 mt-4">
          <div className="flex justify-between w-full text-sm">
            <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                <Banknote /> Total Income
            </div>
            <span className="font-semibold">₹{income.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full text-sm">
            <div className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
                <Banknote /> Total Expenses
            </div>
             <span className="font-semibold">₹{expenses.toFixed(2)}</span>
          </div>
           <div className="flex justify-between w-full text-base font-bold">
            <div className="flex items-center gap-2">
                <Wallet /> Current Balance
            </div>
             <span>₹{balance.toFixed(2)}</span>
          </div>
      </CardFooter>
    </>
  );
}
