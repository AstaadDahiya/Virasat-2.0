import type { Metadata } from "next";
import { Alegreya } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/language-context";
import { DataProvider } from "@/context/data-context";

export const metadata: Metadata = {
  title: "VIRASAT",
  description: "A platform for artisans to showcase and sell their handmade crafts.",
  icons: {
    icon: "/favicon.ico",
  },
};

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased", alegreya.variable)}>
        <LanguageProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
