"use client";

import Link from "next/link";
import {
  BookOpen, HeartPulse, LayoutDashboard,
  Wallet, Bell, LogOut, Zap, Sparkles, GraduationCap,
} from "lucide-react";
import {
  Sidebar, SidebarHeader, SidebarContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-indigo-500" },
  { href: "/expenses", icon: Wallet, label: "Expenses", color: "text-blue-500" },
  { href: "/study-planner", icon: BookOpen, label: "Study Planner", color: "text-emerald-500" },
  { href: "/well-being", icon: HeartPulse, label: "Well-being", color: "text-rose-500" },
  { href: "/reminders", icon: Bell, label: "Reminders", color: "text-amber-500" },
  { href: "/gpa-calculator", icon: GraduationCap, label: "GPA Calculator", color: "text-purple-500" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState, setOpenMobile, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isActive = (href: string) => pathname === href;
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className={cn(sidebarState === 'collapsed' && 'hidden')}>
              <h1 className="text-sm font-extrabold tracking-tight gradient-text">StudentSync</h1>
              <div className="tag-gradient mt-0.5 w-fit">
                <Sparkles className="w-2.5 h-2.5" /> AI Powered
              </div>
            </div>
          </div>
          <div className={cn(sidebarState === 'collapsed' && 'hidden')}>
            <NotificationCenter />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-2 sm:mt-3 px-2">
        <p className={cn(
          "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 px-4 mb-2",
          sidebarState === 'collapsed' && 'hidden'
        )}>
          Navigation
        </p>
        <SidebarMenu className="gap-0.5 sm:gap-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right" }}
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false);
                  }
                }}
              >
                <Link href={item.href} className="py-1.5 sm:py-2">
                  <item.icon className={cn("!w-[20px] !h-[20px]", isActive(item.href) && item.color)} />
                  <span className="text-[15px] font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl",
          "bg-gradient-to-r from-indigo-50 to-purple-50/50",
          "border border-indigo-100/50",
          sidebarState === 'collapsed' && 'justify-center p-1.5 bg-none bg-transparent border-0'
        )}>
          <Avatar className="h-8 w-8 ring-2 ring-indigo-200">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
              {user?.displayName?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col min-w-0 flex-1", sidebarState === 'collapsed' && 'hidden')}>
            <span className="font-bold text-xs truncate">{user?.displayName}</span>
            <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}
            className={cn("shrink-0 h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all", sidebarState === 'collapsed' && 'hidden')}>
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
