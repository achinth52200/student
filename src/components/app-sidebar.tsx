
"use client";

import Link from "next/link";
import {
  BookOpen,
  HeartPulse,
  LayoutDashboard,
  Wallet,
  Bell,
  LogOut,
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
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/expenses", icon: Wallet, label: "Expenses" },
  { href: "/study-planner", icon: BookOpen, label: "Study Planner" },
  { href: "/well-being", icon: HeartPulse, label: "Well-being" },
  { href: "/reminders", icon: Bell, label: "Reminders" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { state: sidebarState } = useSidebar();
  const isActive = (href: string) => pathname === href;
  
  const filteredMenuItems = menuItems.filter(item => {
    // Hide auth-related pages from the main sidebar navigation
    return !['/login', '/signup'].includes(item.href);
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 text-primary" />
          <h1 className={cn("text-lg font-semibold font-headline", sidebarState === 'collapsed' && 'opacity-0 hidden')}>StudentSync</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item) => (
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
              <AvatarFallback>{user?.name?.[0] ?? 'A'}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", sidebarState === 'collapsed' && 'opacity-0 hidden')}>
              <span className="text-sm font-medium">{user?.name ?? 'Alex Doe'}</span>
              <span className="text-xs text-muted-foreground">
                {user?.email ?? 'alex.doe@example.com'}
              </span>
            </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("text-muted-foreground hover:text-foreground", sidebarState === 'expanded' && 'ml-auto')}>
             <LogOut className="h-5 w-5"/>
             <span className="sr-only">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

    