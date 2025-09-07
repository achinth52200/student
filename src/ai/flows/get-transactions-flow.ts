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
  date: z.string().transform((str) => new Date(str)), // Keep as string for schema, transform in code if needed
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

const RecentTransactionsOutputSchema = z.object({
  transactions: z.array(TransactionSchema),
});
export type RecentTransactionsOutput = z.infer<typeof RecentTransactionsOutputSchema>;

// Mock data for new transactions
const newMockTransactions: Omit<Transaction, 'date'>[] = [
    {
      id: '7',
      description: 'Online Course Subscription',
      amount: 45.0,
      type: 'expense',
      category: 'Other',
      status: 'Completed',
    },
    {
      id: '8',
      description: 'Scholarship Grant',
      amount: 1000.0,
      type: 'income',
      category: 'Salary',
      status: 'Completed',
    },
     {
      id: '9',
      description: 'Pizza with friends',
      amount: 22.0,
      type: 'expense',
      category: 'Entertainment',
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
    // Here, we'll return mock data with the current date.
    const transactionsWithDate = newMockTransactions.map(t => ({...t, date: new Date().toISOString()}));
    
    return {
      transactions: transactionsWithDate,
    };
  }
);
