import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

const ExpenseTracker = dynamic(
  () => import("@/components/dashboard/expense-tracker").then((mod) => mod.ExpenseTracker),
  { ssr: false }
);


export default function ExpensesPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 lg:col-span-2">
                <ExpenseTracker />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <BudgetChart />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
