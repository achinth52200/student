
"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Lightbulb, PiggyBank, HeartPulse, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generatePersonalizedTipsAction } from "@/app/actions";
import type { Reminder, Transaction } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type Tip = {
  icon: "PiggyBank" | "GraduationCap" | "HeartPulse" | "Lightbulb";
  text: string;
};

const iconMap = {
  PiggyBank,
  GraduationCap,
  HeartPulse,
  Lightbulb,
};

const staticTips: Tip[] = [
  {
    icon: "GraduationCap",
    text: "Use the Pomodoro Technique: study for 25 minutes, then take a 5-minute break.",
  },
  {
    icon: "PiggyBank",
    text: "Create a weekly budget to track your spending and find areas to save.",
  },
  {
    icon: "HeartPulse",
    text: "Stay hydrated! Aim to drink at least 8 glasses of water a day for better focus.",
  },
];


export function PersonalizedTips() {
  const [tips, setTips] = useState<Tip[]>(staticTips);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchTips = React.useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const transactionsStr = localStorage.getItem(`transactions_${user.email}`);
      const remindersStr = localStorage.getItem(`reminders_${user.email}`);

      const transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
      const reminders: Reminder[] = remindersStr ? JSON.parse(remindersStr) : [];

      const result = await generatePersonalizedTipsAction(transactions, reminders);

      if (result.tips && result.tips.length > 0) {
        setTips(result.tips);
      } else {
        // Fallback to static tips if AI fails or returns none
        setTips(staticTips);
      }
    } catch (error) {
      console.error("Failed to fetch personalized tips:", error);
      setTips(staticTips); // Fallback on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch tips on component mount if user is available
    if (user) {
      fetchTips();
    }
  }, [user, fetchTips]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb /> Personalized Tips
          </CardTitle>
           <Button variant="ghost" size="icon" onClick={fetchTips} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
           </Button>
        </div>
        <CardDescription>AI-generated suggestions based on your activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
            <>
                <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </>
        ) : (
            tips.map((tip, index) => {
                const TipIcon = iconMap[tip.icon] || Lightbulb;
                return (
                <div key={index} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
                    <TipIcon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 pt-1">
                    {tip.text}
                    </p>
                </div>
                );
            })
        )}
      </CardContent>
    </Card>
  );
}
