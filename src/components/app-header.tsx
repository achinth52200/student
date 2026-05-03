
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, BookOpen, HeartPulse, Bell } from "lucide-react";

const pageMeta: Record<string, { title: string; desc: string; icon: any }> = {
  "/dashboard": { title: "Dashboard", desc: "Your student life at a glance", icon: LayoutDashboard },
  "/expenses": { title: "Smart Expenses", desc: "AI-powered financial tracking", icon: Wallet },
  "/study-planner": { title: "Study Planner", desc: "AI-optimized study schedules", icon: BookOpen },
  "/well-being": { title: "Well-being Hub", desc: "Your personal AI wellness mentor", icon: HeartPulse },
  "/reminders": { title: "Reminders", desc: "Stay on top of deadlines", icon: Bell },
};

export function AppHeader() {
  const pathname = usePathname();
  const page = pageMeta[pathname] || { title: "StudentSync", desc: "Student life management", icon: LayoutDashboard };
  const Icon = page.icon;

  return (
    <header className={cn(
      "flex h-14 items-center gap-4 px-5",
      "bg-[hsla(225,18%,6%,0.7)] backdrop-blur-xl",
      "border-b border-[hsla(250,20%,20%,0.3)]",
      "sticky top-0 z-30"
    )}>
      <SidebarTrigger className="hover:bg-[hsla(250,90%,65%,0.1)] transition-colors rounded-lg" />
      <div className="h-5 w-px bg-[hsla(250,20%,30%,0.3)]" />
      <div className="flex items-center gap-2.5 flex-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div>
          <h1 className="text-sm font-semibold tracking-tight leading-none">{page.title}</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{page.desc}</p>
        </div>
      </div>
    </header>
  );
}
