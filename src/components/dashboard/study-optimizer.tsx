"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot, BookCheck, Download } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ScheduleItem } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";
import { useReminders } from "@/hooks/use-reminders";
import { Logo } from "../icons";

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
  const [state, formAction] = useActionState(
    optimizeStudyScheduleAction,
    initialState
  );
  const { toast } = useToast();
  const form = useForm();
  const { addReminder } = useReminders();

  useEffect(() => {
    if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
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
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8" /><path d="M6 18h12" /><path d="M10 3v7c0 1.1-.9 2-2 2H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-5c-1.1 0-2-.9-2-2V3" /><path d="m14 3-4 8 4 8" /></svg>`;
    doc.addSvgIcon(logoSvg, 14, 15, { width: 24, height: 24 });
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("StudentSync", 40, 24);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your Optimized Study Schedule", 14, 40);


    autoTable(doc, {
      startY: 50,
      head: [["Course", "Task", "Main Topic", "Core Topics", "Duration", "Suggested Time"]],
      body: state.schedule.map(item => 
        [item.course, item.task, item.mainTopic, item.coreTopics, item.duration, item.suggestedTime]
      ),
      headStyles: { fillColor: [22, 163, 74] }, // Example: Green header
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
      <Form {...form}>
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
              <FormField
                control={form.control}
                name="courseDeadlines"
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="courseDeadlines">Course Deadlines</FormLabel>
                    <Textarea
                      id="courseDeadlines"
                      name="courseDeadlines"
                      placeholder="e.g., Math 101 Final - 2024-05-15"
                      className="h-32"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priorities"
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="priorities">Priorities</FormLabel>
                    <Textarea
                      id="priorities"
                      name="priorities"
                      placeholder="e.g., Math 101 - High"
                      className="h-32"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="mainTopic"
                    render={() => (
                    <FormItem>
                        <FormLabel htmlFor="mainTopic">Main Topic</FormLabel>
                        <Input id="mainTopic" name="mainTopic" placeholder="e.g., Algebra" />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coreTopics"
                    render={() => (
                    <FormItem>
                        <FormLabel htmlFor="coreTopics">Core Topics</FormLabel>
                        <Input id="coreTopics" name="coreTopics" placeholder="e.g., Binomial theorem, Linear equations" />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="duration"
                    render={() => (
                    <FormItem>
                        <FormLabel htmlFor="duration">Duration</FormLabel>
                        <Input id="duration" name="duration" placeholder="e.g., 3 hours" />
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
      </Form>
    </Card>
  );
}
