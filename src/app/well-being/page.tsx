import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { WellbeingChat } from "@/components/dashboard/wellbeing-chat";
import { WellbeingSupport } from "@/components/dashboard/wellbeing-support";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function WellbeingPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <WellbeingChat />
              <WellbeingSupport />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
