export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'Groceries' | 'Transport' | 'Entertainment' | 'Utilities' | 'Salary' | 'Other';
  date: Date;
};

export type Reminder = {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
};
