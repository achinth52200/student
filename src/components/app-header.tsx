
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Your student life at a glance" },
  "/expenses": { title: "Smart Expenses", description: "AI-powered financial tracking" },
  "/study-planner": { title: "Study Planner", description: "Optimize your study schedule with AI" },
  "/well-being": { title: "Well-being", description: "Your personal AI wellness mentor" },
  "/reminders": { title: "Reminders", description: "Stay on top of your tasks" },
  "/attendance": { title: "Attendance", description: "Track your attendance records" },
};

export function AppHeader() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: "StudentSync", description: "Comprehensive student life management" };

  return (
    <header className={cn(
      "flex h-16 items-center gap-4 border-b border-border/50 px-6",
      "bg-background/80 backdrop-blur-md sticky top-0 z-30"
    )}>
      <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold tracking-tight">{page.title}</h1>
        <p className="text-xs text-muted-foreground">{page.description}</p>
      </div>
    </header>
  );
}
