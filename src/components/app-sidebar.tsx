
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold font-headline">StudentSync</h1>
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{user?.name?.[0] ?? 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name ?? 'Alex Doe'}</span>
              <span className="text-xs text-muted-foreground">
                {user?.email ?? 'alex.doe@example.com'}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
             <LogOut className="h-5 w-5"/>
             <span className="sr-only">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
