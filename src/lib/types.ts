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

export type ModuleFile = {
  id: string;
  name: string;
  type: string; // e.g., 'pdf', 'docx'
};

export type Module = {
  id: string;
  name: string;
  summary: string | null;
  audioDataUri: string | null;
  files: ModuleFile[];
};

export type Subject = {
  id: string;
  name: string;
  modules: Module[];
};
