import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { PersonalizedTips } from "@/components/dashboard/personalized-tips";
import { Reminders } from "@/components/dashboard/reminders";
import { WellbeingChat } from "@/components/dashboard/wellbeing-chat";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <h2 className="text-xl font-semibold">Recent Reports</h2>
                <BudgetChart />
                <WellbeingChat />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Reminders />
                <PersonalizedTips />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
