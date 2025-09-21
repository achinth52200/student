// Implemented by Gemini.
'use server';
/**
 * @fileOverview A flow to simulate fetching recent financial transactions.
 *
 * - getRecentTransactions - A function that returns a list of mock transactions.
 * - RecentTransactionsOutput - The return type for the getRecentTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { Transaction } from '@/lib/types';

const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.enum(['Groceries' , 'Transport' , 'Entertainment' , 'Utilities' , 'Salary' , 'Other' , 'UPI']),
  date: z.string(),
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

const RecentTransactionsOutputSchema = z.object({
  transactions: z.array(TransactionSchema),
});
export type RecentTransactionsOutput = z.infer<typeof RecentTransactionsOutputSchema>;

// Expanded mock data for new transactions
const allMockTransactions: Omit<Transaction, 'date' | 'id'>[] = [
    {
      description: 'Online Course Subscription',
      amount: 45.0,
      type: 'expense',
      category: 'Other',
      status: 'Completed',
    },
    {
      description: 'Scholarship Grant',
      amount: 1000.0,
      type: 'income',
      category: 'Salary',
      status: 'Completed',
    },
     {
      description: 'Pizza with friends',
      amount: 22.0,
      type: 'expense',
      category: 'Entertainment',
      status: 'Completed',
    },
    {
      description: 'Freelance Project Payment',
      amount: 350.0,
      type: 'income',
      category: 'Salary',
      status: 'Completed',
    },
    {
      description: 'Gym Membership',
      amount: 40.0,
      type: 'expense',
      category: 'Utilities',
      status: 'Completed',
    },
    {
      description: 'Coffee',
      amount: 5.5,
      type: 'expense',
      category: 'Groceries',
      status: 'Completed',
    },
    {
      description: 'Refund for returned item',
      amount: 60.0,
      type: 'income',
      category: 'Other',
      status: 'Completed',
    },
    {
      description: 'Concert Tickets',
      amount: 120.0,
      type: 'expense',
      category: 'Entertainment',
      status: 'Completed',
    },
     {
      description: 'Mobile Recharge',
      amount: 10.0,
      type: 'expense',
      category: 'Utilities',
      status: 'Completed',
    },
];


export async function getRecentTransactions(): Promise<RecentTransactionsOutput> {
  return getRecentTransactionsFlow();
}

const getRecentTransactionsFlow = ai.defineFlow(
  {
    name: 'getRecentTransactionsFlow',
    inputSchema: z.undefined(),
    outputSchema: RecentTransactionsOutputSchema,
  },
  async () => {
    // In a real app, this would be an API call to a bank or payment gateway.
    // Here, we'll return a random subset of mock data with a unique ID and current date.
    
    // Get a random number of transactions to return (e.g., 1 to 3)
    const numTransactions = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...allMockTransactions].sort(() => 0.5 - Math.random());
    const selectedTransactions = shuffled.slice(0, numTransactions);

    const transactionsWithDate = selectedTransactions.map(t => ({
      ...t, 
      id: `txn-${Date.now()}-${Math.random()}`, // Create a unique ID
      date: new Date().toISOString()
    }));
    
    return {
      transactions: transactionsWithDate,
    };
  }
);
