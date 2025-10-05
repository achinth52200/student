
"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { LMSContent } from "@/components/lms/lms-content";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LMSPage() {
  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              <LMSContent />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
