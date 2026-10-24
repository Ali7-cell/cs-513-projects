import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { TopProgressBar } from "@/components/layout/top-progress-bar";

export const metadata: Metadata = {
  title: "CS-513: Web Programming — Project Portal | VF. Lecturer Ramish Saleem",
  description:
    "CS-513 Web Programming BS IT 5th Semester project registration, review management, and evaluation portal. Course Instructor: VF. Lecturer Ramish Saleem.",
  icons: { icon: "/uaf-logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F7F6] text-uaf-charcoal antialiased flex flex-col relative selection:bg-emerald-600 selection:text-white">
        <TopProgressBar />
        {/* Subtle Ambient Background Gradients for Glassmorphism */}
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-uaf-green/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
