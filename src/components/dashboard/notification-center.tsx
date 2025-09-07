
'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useReminders } from '@/hooks/use-reminders';
import { Checkbox } from '../ui/checkbox';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

export function NotificationCenter() {
  const { reminders, toggleReminder } = useReminders();
  const uncompletedReminders = reminders.filter(r => !r.completed);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {uncompletedReminders.length > 0 && (
            <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
                {uncompletedReminders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Reminders</h4>
            <p className="text-sm text-muted-foreground">
              Here are your upcoming tasks.
            </p>
          </div>
          <div className="grid gap-2">
            {uncompletedReminders.length > 0 ? (
                 uncompletedReminders.slice(0, 5).map((reminder) => (
                    <div
                        key={reminder.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
                    >
                        <Checkbox
                        id={`notif-${reminder.id}`}
                        checked={reminder.completed}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                        <div className="flex-grow">
                        <label
                            htmlFor={`notif-${reminder.id}`}
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
                 ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending reminders.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
