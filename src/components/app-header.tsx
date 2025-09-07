
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/app-sidebar";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export function AppHeader() {
  const pathname = usePathname();
  const currentItem = menuItems.find((item) => item.href === pathname);

  const titles: { [key: string]: { title: string; description: string } } = {
    "/dashboard": {
      title: "Dashboard",
      description: "Welcome back, here's your student life at a glance.",
    },
    "/expenses": {
      title: "Expenses",
      description: "Track and manage your income and expenses.",
    },
    "/study-planner": {
      title: "Study Planner",
      description: "Optimize your study schedule with AI.",
    },
    "/well-being": {
      title: "Well-being",
      description: "Monitor and improve your mental and physical health.",
    },
    "/reminders": {
      title: "Reminders",
      description: "Manage your tasks and deadlines.",
    },
  };

  const { title, description } =
    titles[pathname] || { title: 'StudentSync', description: 'Seamlessly sync your student life.'};

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

    