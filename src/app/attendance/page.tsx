
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AttendanceCalculator } from "@/components/dashboard/attendance-calculator";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AttendancePage() {
  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              <AttendanceCalculator />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
