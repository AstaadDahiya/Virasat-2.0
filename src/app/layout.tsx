
import type { Metadata } from "next";
import { Alegreya } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DataProvider } from "@/context/data-context";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";

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
      <body className={cn("min-h-screen bg-background font-sans antialiased", alegreya.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <DataProvider>
              <LanguageProvider>
                <CartProvider>
                  {children}
                </CartartProvider>
              </LanguageProvider>
            </DataProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
