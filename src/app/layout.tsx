
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReminderProvider } from "@/hooks/use-reminders";
import { AuthProvider } from "@/hooks/use-auth";
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
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>
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
