"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transaction } from "@/lib/types";

const mockData: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 50, type: 'expense', category: 'Groceries', date: new Date() },
    { id: '2', description: 'Bus fare', amount: 20, type: 'expense', category: 'Transport', date: new Date() },
    { id: '3', description: 'Movie night', amount: 35, type: 'expense', category: 'Entertainment', date: new Date() },
    { id: '4', description: 'Electricity bill', amount: 75, type: 'expense', category: 'Utilities', date: new Date() },
    { id: '5', description: 'More groceries', amount: 40, type: 'expense', category: 'Groceries', date: new Date() },
    { id: '6', description: 'Part-time job', amount: 500, type: 'income', category: 'Salary', date: new Date() },
];

export function BudgetChart() {
    const chartData = React.useMemo(() => {
        const expenseByCategory = mockData
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                if (!acc[transaction.category]) {
                    acc[transaction.category] = 0;
                }
                acc[transaction.category] += transaction.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(expenseByCategory).map(([name, total]) => ({ name, total }));
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Overview</CardTitle>
        <CardDescription>A visual breakdown of your spending by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
               <Tooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                contentStyle={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                }}
               />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
