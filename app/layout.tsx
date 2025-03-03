import type React from "react";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata = {
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <header className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">انجمن</h1>
              <ThemeToggle />
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
