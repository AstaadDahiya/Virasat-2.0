

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Globe, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { CartDrawer } from "./cart-drawer";
import { useLanguage, languages } from "@/context/language-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/artisans", label: "Artisans" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { setLanguage, language: currentLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 text-primary">
            <Logo size={80} />
            <span className="font-bold text-2xl font-headline sm:inline-block">VIRASAT</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-1">
           <ThemeToggle />
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe />
                    <span className="sr-only">Change language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(currentLanguage === lang.code && "font-bold")}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
            </DropdownMenu>
           <Button variant="ghost" size="icon" asChild>
             <Link href="/products/search">
                <Search />
                <span className="sr-only">Search</span>
             </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
             <ShoppingCart />
             <span className="sr-only">Shopping Cart</span>
             {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{cartCount}</span>
             )}
          </Button>
          <Button asChild>
            <Link href="/dashboard">Artisan Dashboard</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-6 text-primary">
                <Logo size={80} />
                <span className="font-bold text-2xl font-headline">VIRASAT</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg transition-colors hover:text-foreground/80",
                      pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
