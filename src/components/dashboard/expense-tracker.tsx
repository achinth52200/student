
"use client";

import { useState } from "react";
import type { Transaction } from "@/lib/types";
import { Plus, IndianRupee, Trash2, ArrowDown, ArrowUp } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categoryIcons: Record<string, string> = {
    'Groceries': '🛒',
    'Transport': '🚌',
    'Entertainment': '🎬',
    'Utilities': '💡',
    'Salary': '💰',
    'Other': '📋',
    'UPI': '📲'
}

const defaultCategories = ['Groceries', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Other', 'UPI'];

type ExpenseTrackerProps = {
    transactions: Transaction[];
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
    onDeleteTransaction: (id: string) => void;
}

export function ExpenseTracker({ transactions, onAddTransaction, onDeleteTransaction }: ExpenseTrackerProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<Transaction['category']>('Other');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
    });
    setDescription("");
    setAmount("");
  };

  const getCategoryIcon = (category: string) => {
    // Check if the category is a default one, otherwise it's a person's name for UPI
    if (categoryIcons[category]) {
        return categoryIcons[category];
    }
    // For UPI payments to individuals, try to show the first letter of their name
    if (category) {
        return category.charAt(0).toUpperCase();
    }
    return '📋';
  }
  
  const allCategories = Array.from(new Set([...defaultCategories, ...transactions.map(t => t.category)]));


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Manual Transactions</CardTitle>
        <CardDescription>
          Add, view, and manage your transactions manually.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end p-4 rounded-lg border bg-card-foreground/5">
            <div className="md:col-span-2">
                <label className="text-xs font-medium" htmlFor="description">Description</label>
                <Input id="description" placeholder="e.g., Coffee" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
             <div>
                <label className="text-xs font-medium" htmlFor="amount">Amount</label>
                <Input id="amount" type="number" placeholder="e.g., 5.50" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div className="flex gap-2">
                <div>
                    <label className="text-xs font-medium">Type</label>
                     <Select onValueChange={(v: any) => setType(v)} defaultValue={type}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <label className="text-xs font-medium">Category</label>
                     <Select onValueChange={(v: any) => setCategory(v)} defaultValue={category}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button type="submit" className="w-full">
                <Plus className="mr-2"/> Add
            </Button>
        </form>

        <div className="relative h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                       <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-xl", t.type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50')}>
                        {getCategoryIcon(t.category)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.description}</span>
                        <span className="text-sm text-muted-foreground">
                           {format(new Date(t.date), "MMM dd, yyyy 'at' hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold text-lg`}
                  >
                    <div className="flex flex-col items-end">
                       <span className={cn('flex items-center', t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}>
                        {t.type === "income" ? <ArrowDown className="mr-1 h-5 w-5 text-green-500" /> : <ArrowUp className="mr-1 h-5 w-5 text-red-500" />}
                        RS {t.amount.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={'secondary'} className="capitalize max-w-[100px] truncate">{t.category}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t.category}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteTransaction(t.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
