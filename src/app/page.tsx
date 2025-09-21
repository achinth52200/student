
"use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { PageLoader } from "@/components/page-loader";

export default function RootPage() {
  const { user } = useAuth();
  
  // If the auth state is still loading, show a loader
  if (user === undefined) {
    return <PageLoader />;
  }

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
