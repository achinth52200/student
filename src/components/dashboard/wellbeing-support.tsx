
"use client";

import { useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot, Volume2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";

type WellbeingSupportState = {
  message?: string
  feedback?: string
  audioDataUri?: string
  errors?: {
    stressLevel?: string[]
    emotionalRegulation?: string[]
    physicalActivity?: string[]
    sleepQuality?: string[]
    studyHours?: string[]
  }
}

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
  const [state, setState] = useState<WellbeingSupportState>({});
  const { toast } = useToast();
  const [stressLevel, setStressLevel] = useState(5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    const result = await provideWellbeingSupportAction(formData);
    setState(result);
  }

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
      <form ref={formRef} action={handleAction}>
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
            <div className="space-y-2">
                <Label>Stress Level</Label>
                <div className="flex items-center gap-4">
                    <Slider
                    name="stressLevel"
                    defaultValue={[stressLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setStressLevel(value[0])}
                    />
                    <span className="text-sm font-medium w-4">
                        {stressLevel}
                    </span>
                </div>
            </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emotionalRegulation">Emotional State</Label>
              <Textarea
                name="emotionalRegulation"
                id="emotionalRegulation"
                placeholder="e.g., Feeling a bit anxious about exams."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalActivity">Physical Activity</Label>
              <Textarea
                name="physicalActivity"
                id="physicalActivity"
                placeholder="e.g., Went for a 30-min run twice this week."
                rows={3}
              />
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="sleepQuality">Sleep Quality</Label>
                <Textarea
                    name="sleepQuality"
                    id="sleepQuality"
                    placeholder="e.g., Waking up a few times during the night."
                />
            </div>
           <div className="space-y-2">
                <Label htmlFor="studyHours">Today's Study Hours</Label>
                <Input type="number" min="0" name="studyHours" id="studyHours" defaultValue={3}/>
            </div>
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
    </Card>
  );
}
