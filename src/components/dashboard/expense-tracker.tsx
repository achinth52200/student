"use client";

import { useState } from "react";
import type { Transaction } from "@/lib/types";
import { PlusCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Part-time job",
    amount: 500.0,
    type: "income",
    category: "Salary",
    date: new Date("2024-05-01"),
  },
  {
    id: "2",
    description: "Groceries",
    amount: 55.2,
    type: "expense",
    category: "Groceries",
    date: new Date("2024-05-03"),
  },
  {
    id: "3",
    description: "Textbooks",
    amount: 120.0,
    type: "expense",
    category: "Utilities",
    date: new Date("2024-05-05"),
  },
];

export function ExpenseTracker() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      description,
      amount: parseFloat(amount),
      type,
      category: "Other", // Simplified for this example
      date: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet /> Expense Tracker
        </CardTitle>
        <CardDescription>
          Keep a log of your income and expenses to stay on budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <form onSubmit={handleAddTransaction} className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="flex-grow"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full sm:w-28"
          />
          <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>
        <div className="relative h-[240px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {t.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{t.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {format(t.date, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      t.type === "income" ? "text-green-600" : ""
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    ₹{t.amount.toFixed(2)}
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
