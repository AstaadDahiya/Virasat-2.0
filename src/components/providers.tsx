
"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { DataProvider } from "@/context/data-context";
import { LanguageProvider } from "@/context/language-context";
import { CartProvider } from "@/context/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
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
                        </CartProvider>
                    </LanguageProvider>
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
