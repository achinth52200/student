
"use client";

import { useEffect } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { Sparkles, Bot, BookCheck, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import { optimizeStudyScheduleAction } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ScheduleItem } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";
import { useReminders } from "@/hooks/use-reminders";
import { Label } from "../ui/label";

const initialState: {
  message?: string;
  schedule?: ScheduleItem[];
  errors?: any;
} = {
  message: "",
  schedule: undefined,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Optimizing..." : "Optimize Schedule"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function StudyOptimizer() {
  const [state, formAction] = useFormState(
    optimizeStudyScheduleAction,
    initialState
  );
  const { toast } = useToast();
  const { addReminder } = useReminders();

  useEffect(() => {
    if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      toast({
        title: "Incomplete Details",
        description: "Please enter details for all fields to create a schedule.",
      });
    }
  }, [state, toast]);
  
   useEffect(() => {
    if (state.schedule) {
      // Add new reminders from the generated schedule
      state.schedule.forEach((item) => {
        addReminder({
          title: `${item.course}: ${item.task}`,
          dueDate: new Date(), // You might want a way to parse `suggestedTime`
          completed: false,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.schedule]);

  const downloadAsPDF = () => {
    if (!state.schedule) return;

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("StudentSync", 14, 22);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your Optimized Study Schedule", 14, 30);


    autoTable(doc, {
      startY: 40,
      head: [["Course", "Task", "Main Topic", "Core Topics", "Duration", "Suggested Time"]],
      body: state.schedule.map(item => 
        [item.course, item.task, item.mainTopic, item.coreTopics, item.duration, item.suggestedTime]
      ),
      headStyles: { fillColor: [34, 197, 94] },
      didDrawPage: (data) => {
        // Footer
        const str = `Page ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(10);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save("study_schedule.pdf");
  }

  return (
    <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookCheck className="text-accent-foreground" />
              Study Schedule Optimization
            </CardTitle>
            <CardDescription>
              Let AI create an optimized study plan based on your deadlines and
              priorities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courseDeadlines">Course Deadlines</Label>
                <Textarea
                  id="courseDeadlines"
                  name="courseDeadlines"
                  placeholder="e.g., Math 101 Final - 2024-05-15"
                  className="h-32"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priorities">Priorities</Label>
                <Textarea
                  id="priorities"
                  name="priorities"
                  placeholder="e.g., Math 101 - High"
                  className="h-32"
                />
              </div>
            </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="mainTopic">Main Topic</Label>
                    <Input id="mainTopic" name="mainTopic" placeholder="e.g., Algebra" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coreTopics">Core Topics</Label>
                    <Input id="coreTopics" name="coreTopics" placeholder="e.g., Binomial theorem, Linear equations" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g., 3 hours" />
                </div>
            </div>
            {state.schedule && state.schedule.length > 0 && (
              <div className="rounded-lg border bg-secondary/50 p-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                        <Bot className="w-5 h-5" />
                        Optimized Schedule
                    </h4>
                    <Button variant="outline" size="sm" onClick={downloadAsPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Main Topic</TableHead>
                            <TableHead>Core Topics</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Suggested Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {state.schedule.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.course}</TableCell>
                                <TableCell>{item.task}</TableCell>
                                <TableCell>{item.mainTopic}</TableCell>
                                <TableCell>{item.coreTopics}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell>{item.suggestedTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
    </Card>
  );
}
