"use client";

import { useState } from "react";
import type { Transaction } from "@/lib/types";
import { ArrowDownLeft, ArrowUpRight, Banknote, IndianRupee, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Received from Alex Doe",
    amount: 250.0,
    type: "income",
    category: "UPI",
    date: new Date("2024-06-12T14:30:00.000Z"),
    status: "Completed",
  },
  {
    id: "2",
    description: "Paid to Coffee Shop",
    amount: 15.5,
    type: "expense",
    category: "UPI",
    date: new Date("2024-06-12T09:15:00.000Z"),
    status: "Completed",
  },
  {
    id: "3",
    description: "Paid to Book Store",
    amount: 85.0,
    type: "expense",
    category: "UPI",
    date: new Date("2024-06-11T18:00:00.000Z"),
    status: "Completed",
  },
  {
    id: "4",
    description: "Received from Jane Smith",
    amount: 50.0,
    type: "income",
    category: "UPI",
    date: new Date("2024-06-11T11:45:00.000Z"),
    status: "Completed",
  },
  {
    id: "5",
    description: "Paid to Movie Theater",
    amount: 32.0,
    type: "expense",
    category: "UPI",
    date: new Date("2024-06-10T20:00:00.000Z"),
    status: "Failed"
  },
   {
    id: "6",
    description: "Paid for Groceries",
    amount: 75.2,
    type: "expense",
    category: "UPI",
    date: new Date("2024-06-10T17:30:00.000Z"),
    status: "Completed",
  },
];

export function ExpenseTracker() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote /> Transaction History
        </CardTitle>
        <CardDescription>
          Here is your recent UPI transaction history.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="relative h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-4">
                       <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", t.type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50')}>
                        {t.type === "income" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.description}</span>
                        <span className="text-sm text-muted-foreground">
                           {format(t.date, "MMM dd, yyyy 'at' hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold text-lg`}
                  >
                    <div className="flex flex-col items-end">
                       <span className={cn('flex items-center', t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-foreground')}>
                        {t.type === "income" ? "+" : "-"}
                        <IndianRupee className="h-5 w-5" />
                        {t.amount.toFixed(2)}
                      </span>
                      <Badge variant={t.status === 'Completed' ? 'secondary' : 'destructive'} className="mt-1">
                        {t.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
