
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export function AppHeader() {
  const title = "StudentSync";
  const description = "Comprehensive Student Life Management system";

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <NotificationCenter />
    </header>
  );
}
