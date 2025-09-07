import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

import { ExpenseTracker } from "@/components/dashboard/expense-tracker";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { StudyOptimizer } from "@/components/dashboard/study-optimizer";
import { WellbeingSupport } from "@/components/dashboard/wellbeing-support";
import { Reminders } from "@/components/dashboard/reminders";
import { PersonalizedTips } from "@/components/dashboard/personalized-tips";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <WellbeingSupport />
                <StudyOptimizer />
                <ExpenseTracker />
              </div>
              {/* Right column */}
              <div className="grid grid-cols-1 gap-6">
                <BudgetChart />
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
