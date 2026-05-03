
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReminderProvider } from "@/hooks/use-reminders";
import { LoaderProvider } from "@/hooks/use-loader";
import { PageLoader } from "@/components/page-loader";
import { Suspense } from "react";
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "StudentSync — Smart Student Life Manager",
  description: "AI-powered platform for managing expenses, study schedules, and well-being. Seamlessly sync your student life.",
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased mesh-bg",
        fontSans.variable
      )}>
        <LoaderProvider>
          <AuthProvider>
            <ReminderProvider>
                <Suspense fallback={<PageLoader />}>
                  {children}
                </Suspense>
                <Toaster />
            </ReminderProvider>
          </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
