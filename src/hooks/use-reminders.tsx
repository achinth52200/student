
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
  setReminderStatus: (id: string, completed: boolean) => void;
  deleteReminder: (id: string) => void;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const storageKey = user ? `reminders_${user.uid}` : 'reminders_guest';


  useEffect(() => {
    const storedReminders = localStorage.getItem(storageKey);
    if (storedReminders) {
        setReminders(JSON.parse(storedReminders).map((r: Reminder) => ({...r, dueDate: new Date(r.dueDate)})));
    } else {
        localStorage.setItem(storageKey, JSON.stringify(initialReminders));
        setReminders(initialReminders);
    }
  }, [storageKey]);

  const updateStoredReminders = (newReminders: Reminder[]) => {
      localStorage.setItem(storageKey, JSON.stringify(newReminders));
  }

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    setReminders(prev => {
        const newReminder = { ...reminder, id: crypto.randomUUID() };
        const updated = [newReminder, ...prev];
        updateStoredReminders(updated);
        return updated;
    });
  };
  
  const setReminderStatus = (id: string, completed: boolean) => {
    setReminders(prev => {
        const updated = prev.map(r => r.id === id ? { ...r, completed } : r);
        updateStoredReminders(updated);
        return updated;
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => {
        if (r.id === id) {
            const updatedReminder = { ...r, completed: !r.completed };
            const updatedList = reminders.map(rem => rem.id === id ? updatedReminder : rem);
            updateStoredReminders(updatedList);
            return updatedReminder;
        }
        return r;
    }));
  };
  
  const deleteReminder = (id: string) => {
    setReminders(prev => {
        const updated = prev.filter(r => r.id !== id);
        updateStoredReminders(updated);
        return updated;
    });
  };

  return (
    <ReminderContext.Provider value={{ reminders, addReminder, toggleReminder, setReminderStatus, deleteReminder }}>
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
