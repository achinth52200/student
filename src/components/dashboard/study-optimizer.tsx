"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot, BookCheck } from "lucide-react";
import { useForm } from "react-hook-form";

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

const initialState = {
  message: "",
  schedule: "",
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

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

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
            {state.schedule && (
              <div className="rounded-lg border bg-secondary/50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Bot className="w-5 h-5" />
                  Optimized Schedule
                </h4>
                <p className="text-sm text-secondary-foreground whitespace-pre-wrap font-mono">
                  {state.schedule}
                </p>
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
