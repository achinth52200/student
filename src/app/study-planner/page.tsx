
"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { StudyOptimizer } from "@/components/dashboard/study-optimizer";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExportToPDF } from "@/components/export-to-pdf";

export default function StudyPlannerPage() {
  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              <div className="flex justify-end mb-4">
                <ExportToPDF targetId="study-export" filename="Study Schedule" title="Study Schedule" />
              </div>
              <div id="study-export">
                <StudyOptimizer />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
