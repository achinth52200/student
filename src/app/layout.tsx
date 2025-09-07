
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReminderProvider } from "@/hooks/use-reminders";
import { AuthProvider } from "@/hooks/use-auth";
import { LoaderProvider } from "@/hooks/use-loader";
import { PageTransitionLoader } from "@/components/page-transition-loader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "StudentSync",
  description: "Seamlessly sync your student life.",
};

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
      <body className="font-body antialiased">
        <LoaderProvider>
            <AuthProvider>
              <ReminderProvider>
                  <Suspense>
                    <PageTransitionLoader />
                  </Suspense>
                  {children}
                  <Toaster />
              </ReminderProvider>
            </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
