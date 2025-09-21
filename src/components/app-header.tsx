
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const title = "StudentSync";
  const description = "Comprehensive Student Life Management system";

  return (
    <header className={cn("flex h-16 items-center gap-4 border-b px-6", "glass-effect")}>
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <NotificationCenter />
    </header>
  );
}
