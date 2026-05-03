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
  Zap,
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className={cn(
              "text-lg font-bold tracking-tight whitespace-nowrap gradient-text",
              sidebarState === 'collapsed' && 'opacity-0 hidden'
            )}>
              StudentSync
            </h1>
          </div>
          <div className={cn(sidebarState === 'collapsed' && 'opacity-0 hidden')}>
            <NotificationCenter />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right" }}
                className="transition-all duration-200"
              >
                <Link href={item.href}>
                  <item.icon className="!w-[18px] !h-[18px]" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl bg-white/5",
          sidebarState === 'collapsed' && 'justify-center p-1'
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-primary/30">
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-400/80 text-white text-sm font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0", sidebarState === 'collapsed' && 'hidden')}>
            <span className="font-semibold text-sm truncate">{user?.displayName}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className={cn(
              "ml-auto shrink-0 hover:bg-red-500/10 hover:text-red-400 transition-colors",
              sidebarState === 'collapsed' && 'hidden'
            )}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
