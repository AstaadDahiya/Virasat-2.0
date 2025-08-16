
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./logo";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "./theme-toggle";
import {
  LayoutGrid,
  Box,
  WandSparkles,
  User,
  LogOut,
  Home,
  Cog,
  DollarSign,
  Megaphone,
  Camera,
  TrendingUp,
  Ship,
  Package,
  LineChart,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const mainMenuItems = [
    { href: "/dashboard", label: "Dashboard Overview", icon: LayoutGrid },
    { href: "/dashboard/analytics", label: 'Analytics', icon: LineChart },
    { href: "/dashboard/products", label: "My Products", icon: Box },
    { href: "/dashboard/shipments", label: 'Shipments', icon: Package },
  ];
  
  const aiToolsItems = [
    { href: "/dashboard/tools/description-generator", label: 'AI Storyteller', icon: WandSparkles },
    { href: "/dashboard/tools/pricing-optimizer", label: "Pricing Optimizer", icon: DollarSign },
    { href: "/dashboard/tools/marketing-suite", label: 'Marketing Suite', icon: Megaphone },
    { href: "/dashboard/tools/visual-enhancer", label: 'Visual Enhancer', icon: Camera },
    { href: "/dashboard/tools/trend-harmonizer", label: 'Trend Harmonizer', icon: TrendingUp },
    { href: "/dashboard/tools/logistics-hub", label: 'Logistics Hub', icon: Ship },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-secondary text-secondary-foreground hidden md:flex flex-col">
      <div className="p-4 border-b">
         <Link href="/" className="flex items-center space-x-2 text-primary">
            <Logo size={80}/>
            <h1 className="font-bold text-2xl font-headline text-primary">VIRASAT</h1>
          </Link>
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Dashboard</h3>
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <Button key={item.href} asChild variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start">
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
         <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">AI Tools</h3>
          <div className="space-y-1">
            {aiToolsItems.map((item) => (
              <Button key={item.href} asChild variant={isActive(item.href) ? "default" : "ghost"} className="w-full justify-start">
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      <div className="p-4 border-t mt-auto">
         <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="indian man portrait"/>
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {user && (
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5"/>
          </Button>
        </div>
        <div className="flex justify-between items-center w-full">
            <Button asChild variant="ghost" className="justify-start flex-grow">
              <Link href="/dashboard/settings">
                  <Cog />
                  <span>Settings</span>
                </Link>
            </Button>
            <ThemeToggle />
        </div>
        <Button asChild variant="ghost" className="w-full justify-start mt-1">
            <Link href="/">
                <Home />
                <span>Back to Site</span>
            </Link>
        </Button>
      </div>
    </aside>
  );
}
