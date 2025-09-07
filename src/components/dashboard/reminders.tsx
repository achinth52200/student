"use client";

import { useState, useMemo } from "react";
import { Bell, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import type { Reminder } from "@/lib/types";

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Submit Math assignment",
    dueDate: new Date("2024-06-12T00:00:00.000Z"),
    completed: false,
  },
  {
    id: "2",
    title: "Group project meeting",
    dueDate: new Date("2024-06-13T00:00:00.000Z"),
    completed: false,
  },
  {
    id: "3",
    title: "Renew library books",
    dueDate: new Date("2024-06-09T00:00:00.000Z"),
    completed: true,
  },
];

export function Reminders() {
  const [reminders, setReminders] = useState(initialReminders);
  const [newReminder, setNewReminder] = useState("");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder) return;
    const reminder: Reminder = {
      id: new Date().toISOString(),
      title: newReminder,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 1 week
      completed: false,
    };
    setReminders([reminder, ...reminders]);
    setNewReminder("");
  };

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };
  
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => (a.completed ? 1 : -1) || a.id.localeCompare(b.id));
  }, [reminders]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell /> Reminders
        </CardTitle>
        <CardDescription>Your upcoming deadlines and tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddReminder} className="flex gap-2">
          <Input
            placeholder="Add a new reminder..."
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
          />
          <Button type="submit" size="icon" variant="outline">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </form>
        <div className="space-y-3 h-[180px] overflow-y-auto pr-2">
          {sortedReminders
            .map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-3"
              >
                <Checkbox
                  id={reminder.id}
                  checked={reminder.completed}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
                <div className="flex-grow">
                  <label
                    htmlFor={reminder.id}
                    className={`text-sm ${
                      reminder.completed
                        ? "text-muted-foreground line-through"
                        : "font-medium"
                    }`}
                  >
                    {reminder.title}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Due: {format(reminder.dueDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
