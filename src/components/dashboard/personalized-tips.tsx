import { GraduationCap, Lightbulb, PiggyBank, HeartPulse } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tips = [
  {
    icon: GraduationCap,
    text: "Use the Pomodoro Technique: study for 25 minutes, then take a 5-minute break.",
  },
  {
    icon: PiggyBank,
    text: "Create a weekly budget to track your spending and find areas to save.",
  },
  {
    icon: HeartPulse,
    text: "Stay hydrated! Aim to drink at least 8 glasses of water a day for better focus.",
  },
];

export function PersonalizedTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb /> Personalized Tips
        </CardTitle>
        <CardDescription>Helpful suggestions for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/50 text-accent-foreground">
              <tip.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground flex-1 pt-1">
              {tip.text}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
