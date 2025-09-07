
"use client";

import { useState, useMemo } from "react";
import { Bell, PlusCircle, Trash2, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useReminders } from "@/hooks/use-reminders";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Reminders() {
  const { reminders, addReminder, setReminderStatus, deleteReminder } = useReminders();
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
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50"
              >
                <div className="flex-grow">
                  <p
                    className={cn("text-sm font-medium", reminder.completed && "text-muted-foreground line-through")}
                  >
                    {reminder.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setReminderStatus(reminder.id, true)}>
                            Done
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setReminderStatus(reminder.id, false)}>
                            Not Done
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteReminder(reminder.id)}>
                           <Trash2 className="mr-2 h-4 w-4"/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
