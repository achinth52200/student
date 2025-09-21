
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReminderProvider } from "@/hooks/use-reminders";
import { LoaderProvider } from "@/hooks/use-loader";
import { PageLoader } from "@/components/page-loader";
import { Suspense } from "react";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "StudentSync",
  description: "Seamlessly sync your student life.",
  manifest: "/manifest.ts",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
         <div className="absolute top-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <LoaderProvider>
            <ReminderProvider>
                <Suspense fallback={<PageLoader />}>
                  {children}
                </Suspense>
                <Toaster />
            </ReminderProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
