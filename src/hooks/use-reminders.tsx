
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Reminder } from '@/lib/types';
import { useAuth } from './use-auth';

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
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { user } = useAuth();
  const storageKey = user ? `reminders_${user.email}` : '';

  useEffect(() => {
    if (storageKey) {
        const storedReminders = localStorage.getItem(storageKey);
        if (storedReminders) {
            setReminders(JSON.parse(storedReminders).map((r: Reminder) => ({...r, dueDate: new Date(r.dueDate)})));
        } else {
            // Seed with initial data if none exists
            localStorage.setItem(storageKey, JSON.stringify(initialReminders));
            setReminders(initialReminders);
        }
    } else {
        setReminders([]); // Clear reminders on logout
    }
  }, [storageKey]);

  const updateStoredReminders = (newReminders: Reminder[]) => {
      if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(newReminders));
      }
  }

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    setReminders(prev => {
        const newReminder = { ...reminder, id: crypto.randomUUID() };
        const updated = [newReminder, ...prev];
        updateStoredReminders(updated);
        return updated;
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => {
        if (r.id === id) {
            const updatedReminder = { ...r, completed: !r.completed };
            // Also update storage
            const updatedList = reminders.map(rem => rem.id === id ? updatedReminder : rem);
            updateStoredReminders(updatedList);
            return updatedReminder;
        }
        return r;
    }));
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
