"use client";

import dynamic from "next/dynamic";

const ExpenseTracker = dynamic(
  () => import("@/components/dashboard/expense-tracker").then((mod) => mod.ExpenseTracker),
  { ssr: false }
);

export function ExpenseTrackerClient() {
    return <ExpenseTracker />;
}
