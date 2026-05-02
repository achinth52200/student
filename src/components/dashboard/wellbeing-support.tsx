
"use client";

import { useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles, Bot, Volume2, AlertCircle } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <Button type="submit" disabled={pending} className="w-full shadow-lg hover:shadow-primary/20 transition-all">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Analyzing your well-being...
        </>
      ) : (
        <>
          <Sparkles className="ml-2 h-4 w-4" />
          Get AI Feedback
        </>
      )}
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
    // Explicitly add the stressLevel from state because Radix Slider doesn't auto-submit its value
    formData.set('stressLevel', stressLevel.toString());
    const result = await provideWellbeingSupportAction(formData);
    setState(result);
    
    if (result.message && !result.errors && !result.feedback) {
       toast({
        variant: "destructive",
        title: "AI Response Error",
        description: result.message,
      });
    }
  }

  useEffect(() => {
    if (state.errors) {
      const firstError = Object.values(state.errors)[0]?.[0];
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError || "Please check all fields.",
      });
    }
  }, [state.errors, toast]);

  useEffect(() => {
    if (state.audioDataUri && audioRef.current) {
        audioRef.current.src = state.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.audioDataUri]);

  return (
    <Card className="glass-effect shadow-xl border-primary/10">
      <form ref={formRef} action={handleAction}>
        {/* Hidden input to ensure stressLevel is part of formData submission */}
        <input type="hidden" name="stressLevel" value={stressLevel} />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-6 w-6" />
            AI Well-being Mentor
          </CardTitle>
          <CardDescription>
            Share how you're feeling to receive empathetic, voice-enabled support from your AI mentor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-3 p-4 rounded-xl bg-accent/50">
                <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Current Stress Level</Label>
                    <span className="text-xl font-bold text-primary bg-background px-3 py-1 rounded-full shadow-inner">
                        {stressLevel}
                    </span>
                </div>
                <Slider
                    defaultValue={[stressLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setStressLevel(value[0])}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Relaxed</span>
                    <span>High Stress</span>
                </div>
            </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emotionalRegulation">Emotional State</Label>
              <Textarea
                name="emotionalRegulation"
                id="emotionalRegulation"
                placeholder="How are you feeling today? (e.g., Anxious about exams, happy with progress)"
                className="min-h-[100px] bg-background/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalActivity">Physical Activity</Label>
              <Textarea
                name="physicalActivity"
                id="physicalActivity"
                placeholder="Did you exercise? (e.g., 20-min walk, hit the gym, played football)"
                className="min-h-[100px] bg-background/50"
                required
              />
            </div>
          </div>

           <div className="space-y-2">
                <Label htmlFor="sleepQuality">Sleep Quality</Label>
                <Textarea
                    name="sleepQuality"
                    id="sleepQuality"
                    placeholder="Describe your sleep (e.g., Slept 8 hours deeply, restless night)"
                    className="bg-background/50"
                    required
                />
            </div>

           <div className="space-y-2">
                <Label htmlFor="studyHours">Today's Study Hours</Label>
                <Input 
                    type="number" 
                    min="0" 
                    max="24"
                    name="studyHours" 
                    id="studyHours" 
                    defaultValue={3}
                    className="bg-background/50"
                    required
                />
            </div>

          {state.feedback && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Sparkles className="h-5 w-5" />
                    Mentor Feedback
                  </h4>
                  {state.audioDataUri && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => audioRef.current?.play()}
                      className="rounded-full"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                  )}
                </div>
                <p className="text-base text-foreground/90 leading-relaxed italic">
                  "{state.feedback}"
                </p>
                {state.audioDataUri && (
                    <div className="mt-4 opacity-0 h-0 overflow-hidden">
                        <audio ref={audioRef} src={state.audioDataUri} />
                    </div>
                )}
              </div>
            </div>
          )}

          {state.message && state.errors && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
