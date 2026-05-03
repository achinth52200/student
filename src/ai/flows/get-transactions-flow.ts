
'use server';
/**
 * @fileOverview A flow to simulate fetching recent financial transactions.
 */

import type { Transaction } from '@/lib/types';

export type RecentTransactionsOutput = {
  transactions: Transaction[];
};

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
    // In a real app, this would be an API call to a bank or payment gateway.
    // Here, we'll return a random subset of mock data with a unique ID and current date.
    
    const numTransactions = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...allMockTransactions].sort(() => 0.5 - Math.random());
    const selectedTransactions = shuffled.slice(0, numTransactions);

    const transactionsWithDate = selectedTransactions.map(t => ({
      ...t, 
      id: `txn-${Date.now()}-${Math.random()}`,
      date: new Date().toISOString()
    }));
    
    return {
      transactions: transactionsWithDate,
    };
}
