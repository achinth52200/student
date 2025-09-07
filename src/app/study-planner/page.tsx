import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { StudyOptimizer } from "@/components/dashboard/study-optimizer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function StudyPlannerPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <StudyOptimizer />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
