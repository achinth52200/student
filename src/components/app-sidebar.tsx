"use client";

import Link from "next/link";
import {
  BookOpen,
  HeartPulse,
  LayoutDashboard,
  Wallet,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/expenses", icon: Wallet, label: "Expenses" },
  { href: "/study-planner", icon: BookOpen, label: "Study Planner" },
  { href: "/well-being", icon: HeartPulse, label: "Well-being" },
  { href: "/reminders", icon: Bell, label: "Reminders" },
];

export function AppSidebar() {
  const pathname = usePathname();

  // For this single-page dashboard, we'll just highlight the main dashboard link.
  // In a multi-page app, you'd compare `pathname` to `item.href`.
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold font-headline">StudentSync</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={"/dashboard"}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/100" alt="User" data-ai-hint="person face" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Alex Doe</span>
            <span className="text-xs text-muted-foreground">
              alex.doe@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
