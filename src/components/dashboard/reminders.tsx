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
import { useReminders } from "@/hooks/use-reminders";

export function Reminders() {
  const { reminders, addReminder, toggleReminder } = useReminders();
  const [newReminder, setNewReminder] = useState("");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder) return;
    addReminder({
      title: newReminder,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 1 week
      completed: false,
    });
    setNewReminder("");
  };
  
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => (a.completed ? 1 : -1) || new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
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
                    Due: {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
