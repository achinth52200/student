export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string | Date;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type Reminder = {
  id: string;
  title: string;
  dueDate: Date | string;
  completed: boolean;
};

export type ScheduleItem = {
    course: string;
    task: string;
    mainTopic: string;
    coreTopics: string;
    duration: string;
    suggestedTime: string;
}
