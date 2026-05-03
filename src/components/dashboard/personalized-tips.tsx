
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
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getCachedResponse, setCachedResponse } from "@/lib/ai-cache";

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

// Cache duration: 2 hours (saves tons of API calls)
const TIPS_CACHE_TTL = 120;

export function PersonalizedTips() {
  const { user } = useAuth();
  const [tips, setTips] = useState<Tip[]>(staticTips);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTips = React.useCallback(async (forceRefresh = false) => {
    setIsLoading(true);

    try {
      const storageKeySuffix = user ? user.uid : 'guest';
      const cacheKey = `tips_${storageKeySuffix}`;

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = getCachedResponse<Tip[]>(cacheKey);
        if (cached && cached.length > 0) {
          setTips(cached);
          setIsLoading(false);
          return;
        }
      }

      const transactionsStr = localStorage.getItem(`transactions_${storageKeySuffix}`);
      const remindersStr = localStorage.getItem(`reminders_${storageKeySuffix}`);

      const transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
      const reminders: Reminder[] = remindersStr ? JSON.parse(remindersStr) : [];

      const result = await generatePersonalizedTipsAction(transactions, reminders);

      if (result.tips && result.tips.length > 0) {
        setTips(result.tips);
        // Cache for 2 hours
        setCachedResponse(cacheKey, result.tips, TIPS_CACHE_TTL);
      } else {
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
    fetchTips(false); // Try cache first on mount
  }, [fetchTips]);

  return (
    <Card className="premium-card rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/15">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">AI Tips</CardTitle>
              <CardDescription className="text-xs">Personalized suggestions</CardDescription>
            </div>
          </div>
           <Button variant="ghost" size="icon" onClick={() => fetchTips(true)} disabled={isLoading}
             className="h-8 w-8 rounded-lg hover:bg-amber-50 hover:text-amber-600">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
           </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
            <>
                <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                 <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                 <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </>
        ) : (
            tips.map((tip, index) => {
                const TipIcon = iconMap[tip.icon] || Lightbulb;
                return (
                <div key={index} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                      <TipIcon className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 pt-0.5 leading-relaxed">
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
