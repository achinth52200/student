
"use client";

import Link from "next/link";
import {
  BookOpen,
  HeartPulse,
  LayoutDashboard,
  Wallet,
  Bell,
  LogOut,
  Calculator,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/expenses", icon: Wallet, label: "Expenses" },
  { href: "/study-planner", icon: BookOpen, label: "Study Planner" },
  { href: "/well-being", icon: HeartPulse, label: "Well-being" },
  { href: "/reminders", icon: Bell, label: "Reminders" },
  { href: "/attendance", icon: Calculator, label: "Attendance" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();
  const { user, logout } = useAuth();
  const isActive = (href: string) => pathname === href;
  
  return (
    <Sidebar collapsible="icon" className="glass-effect">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <h1 className={cn("text-lg font-semibold font-headline whitespace-nowrap", sidebarState === 'collapsed' && 'opacity-0 hidden')}>StudentSync</h1>
          </div>
          <div className={cn(sidebarState === 'collapsed' && 'opacity-0 hidden')}>
            <NotificationCenter />
          </div>
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
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className={cn("flex items-center gap-3", sidebarState === 'collapsed' && 'justify-center')}>
             <Avatar className="h-9 w-9">
              <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", sidebarState === 'collapsed' && 'hidden')}>
                <span className="font-semibold text-sm">{user?.displayName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className={cn("ml-auto", sidebarState === 'collapsed' && 'hidden')}>
              <LogOut className="w-4 h-4"/>
            </Button>
        </div>
         <div className={cn("text-xs text-muted-foreground text-center mt-4", sidebarState === 'collapsed' && 'hidden')}>
            <p>Developed by Gowtham C N & Achinth.M</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
