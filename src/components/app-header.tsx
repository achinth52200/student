import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
      <SidebarTrigger className="md:hidden" />
      <div>
        <h1 className="text-xl font-semibold font-headline">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, here's your student life at a glance.
        </p>
      </div>
    </header>
  );
}
