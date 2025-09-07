"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Reminder } from '@/lib/types';

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Submit Math assignment",
    dueDate: new Date("2024-08-12T00:00:00.000Z"),
    completed: false,
  },
  {
    id: "2",
    title: "Group project meeting",
    dueDate: new Date("2024-08-13T00:00:00.000Z"),
    completed: false,
  },
  {
    id: "3",
    title: "Renew library books",
    dueDate: new Date("2024-08-09T00:00:00.000Z"),
    completed: true,
  },
];


type ReminderContextType = {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: crypto.randomUUID() };
    setReminders(prev => [newReminder, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <ReminderContext.Provider value={{ reminders, addReminder, toggleReminder }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
