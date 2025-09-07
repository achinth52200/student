
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { WellbeingSupport } from "@/components/dashboard/wellbeing-support";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function WellbeingPage() {
  return (
    <>
      <PageTransitionLoader />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              <WellbeingSupport />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
