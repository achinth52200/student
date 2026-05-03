"use client";

import Link from "next/link";
import {
  BookOpen,
  HeartPulse,
  LayoutDashboard,
  Wallet,
  Bell,
  LogOut,
  Zap,
  Sparkles,
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
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();
  const { user, logout } = useAuth();
  const isActive = (href: string) => pathname === href;
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(250,90%,65%)] to-[hsl(280,70%,55%)] flex items-center justify-center shadow-lg shadow-[hsla(250,90%,65%,0.3)]">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div className={cn(sidebarState === 'collapsed' && 'hidden')}>
              <h1 className="text-base font-bold tracking-tight text-white">StudentSync</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI Powered
              </p>
            </div>
          </div>
          <div className={cn(sidebarState === 'collapsed' && 'hidden')}>
            <NotificationCenter />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-2 px-2">
        <p className={cn(
          "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-4 mb-2",
          sidebarState === 'collapsed' && 'hidden'
        )}>
          Menu
        </p>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon className="!w-[18px] !h-[18px]" />
                  <span className="font-medium text-[13px]">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-xl",
          "bg-gradient-to-r from-[hsla(250,90%,65%,0.08)] to-transparent",
          "border border-[hsla(250,90%,65%,0.08)]",
          sidebarState === 'collapsed' && 'justify-center p-1.5 bg-none border-0'
        )}>
          <Avatar className="h-8 w-8 ring-2 ring-[hsla(250,90%,65%,0.3)]">
            <AvatarFallback className="bg-gradient-to-br from-[hsl(250,90%,65%)] to-[hsl(280,70%,55%)] text-white text-xs font-bold">
              {user?.displayName?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0 flex-1", sidebarState === 'collapsed' && 'hidden')}>
            <span className="font-semibold text-xs truncate text-white">{user?.displayName}</span>
            <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className={cn(
              "shrink-0 h-7 w-7 hover:bg-red-500/10 hover:text-red-400 transition-all",
              sidebarState === 'collapsed' && 'hidden'
            )}
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
