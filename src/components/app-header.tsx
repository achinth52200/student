
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AppHeader() {
  const title = "StudentSync";
  const description = "Comprehensive student life management system for Christite";

  return (
    <header className={cn("flex h-16 items-center gap-4 border-b px-6", "glass-effect")}>
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <Image
          src="https://christuniversity.in/images/logo.png"
          alt="CHRIST University Logo"
          width={150}
          height={40}
          className="h-auto"
        />
      </div>
    </header>
  );
}
