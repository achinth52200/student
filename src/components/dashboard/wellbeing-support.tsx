
"use client";

import { useEffect, useState, useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  feedback: "",
  audioDataUri: "",
  errors: {},
};

const wellbeingSupportSchema = z.object({
  stressLevel: z.coerce.number().min(1).max(10),
  emotionalRegulation: z
    .string()
    .min(1, "Please describe your emotional state."),
  physicalActivity: z
    .string()
    .min(1, "Please describe your physical activity."),
  sleepQuality: z.string().min(1, "Please describe your sleep quality."),
  studyHours: z.coerce.number().min(0),
});

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
  const form = useForm<z.infer<typeof wellbeingSupportSchema>>({
    resolver: zodResolver(wellbeingSupportSchema),
    defaultValues: {
      stressLevel: 5,
      emotionalRegulation: "",
      physicalActivity: "",
      sleepQuality: "",
      studyHours: 3,
    },
  });
  const [stressLevel, setStressLevel] = useState(5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (state.audioDataUri && audioRef.current) {
        audioRef.current.src = state.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.audioDataUri]);

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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Level</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        name={field.name}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emotionalRegulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emotional State</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Feeling a bit anxious about exams."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="physicalActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Activity</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Went for a 30-min run twice this week."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sleepQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Quality</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Waking up a few times during the night."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studyHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Today's Study Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
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
                {state.audioDataUri && (
                    <div className="mt-4 flex items-center gap-2">
                       <Volume2 className="h-5 w-5 text-muted-foreground" />
                       <audio ref={audioRef} controls className="w-full h-10">
                            Your browser does not support the audio element.
                       </audio>
                    </div>
                )}
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
