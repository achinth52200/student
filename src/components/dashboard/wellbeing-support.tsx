"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot } from "lucide-react";
import { useForm } from "react-hook-form";

import { provideWellbeingSupportAction } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  feedback: "",
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : "Get Feedback"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function WellbeingSupport() {
  const [state, formAction] = useActionState(
    provideWellbeingSupportAction,
    initialState
  );
  const { toast } = useToast();
  const form = useForm();
  const [stressLevel, setStressLevel] = useState(5);

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
              <Sparkles className="text-accent-foreground" />
              AI-Driven Well-being Support
            </CardTitle>
            <CardDescription>
              Get personalized feedback to maintain your mental and physical
              well-being.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="stressLevel"
              defaultValue={stressLevel}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Level</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        defaultValue={[stressLevel]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => {
                          setStressLevel(value[0]);
                          field.onChange(value[0]);
                        }}
                      />
                    </FormControl>
                    <span className="text-sm font-medium w-4">
                      {stressLevel}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emotionalRegulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="emotionalRegulation">Emotional State</FormLabel>
                    <FormControl>
                      <Textarea
                        id="emotionalRegulation"
                        placeholder="e.g., Feeling a bit anxious about exams."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="physicalActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="physicalActivity">Physical Activity</FormLabel>
                    <FormControl>
                      <Textarea
                        id="physicalActivity"
                        placeholder="e.g., Went for a 30-min run twice this week."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sleepQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="sleepQuality">Sleep Quality</FormLabel>
                  <FormControl>
                    <Textarea
                      id="sleepQuality"
                      placeholder="e.g., Waking up a few times during the night."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studyHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="studyHours">Today's Study Hours</FormLabel>
                  <FormControl>
                    <Input
                      id="studyHours"
                      type="number"
                      defaultValue="3"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value,10))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {state.feedback && (
              <div className="rounded-lg border bg-secondary/50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Bot className="w-5 h-5" />
                  AI Feedback
                </h4>
                <p className="text-sm text-secondary-foreground whitespace-pre-wrap">
                  {state.feedback}
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
