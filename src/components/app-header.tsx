
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, BookOpen, HeartPulse, Bell } from "lucide-react";

const pageMeta: Record<string, { title: string; desc: string; icon: any; gradient: string }> = {
  "/dashboard": { title: "Dashboard", desc: "Overview of your student life", icon: LayoutDashboard, gradient: "from-indigo-500 to-purple-500" },
  "/expenses": { title: "Smart Expenses", desc: "AI-powered financial tracking", icon: Wallet, gradient: "from-blue-500 to-cyan-500" },
  "/study-planner": { title: "Study Planner", desc: "AI-optimized study schedules", icon: BookOpen, gradient: "from-emerald-500 to-teal-500" },
  "/well-being": { title: "Well-being Hub", desc: "Your personal AI wellness mentor", icon: HeartPulse, gradient: "from-rose-500 to-pink-500" },
  "/reminders": { title: "Reminders", desc: "Stay on top of deadlines", icon: Bell, gradient: "from-amber-500 to-orange-500" },
};

export function AppHeader() {
  const pathname = usePathname();
  const page = pageMeta[pathname] || { title: "StudentSync", desc: "Student life management", icon: LayoutDashboard, gradient: "from-indigo-500 to-purple-500" };
  const Icon = page.icon;

  return (
    <header className="flex h-14 items-center gap-4 px-5 header-glass sticky top-0 z-30">
      <SidebarTrigger className="hover:bg-indigo-50 transition-colors rounded-lg" />
      <div className="h-5 w-px bg-slate-200" />
      <div className="flex items-center gap-2.5 flex-1">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${page.gradient} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight leading-none">{page.title}</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{page.desc}</p>
        </div>
      </div>
    </header>
  );
}
