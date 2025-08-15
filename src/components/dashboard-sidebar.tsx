
"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./logo";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, signOut } = useAuth();


  const mainMenuItems = [
    {
      href: "/dashboard",
      label: "Dashboard Overview",
      icon: LayoutGrid,
    },
     {
      href: "/dashboard/analytics",
      label: 'Analytics',
      icon: LineChart,
    },
    {
      href: "/dashboard/products",
      label: "My Products",
      icon: Box,
    },
    {
      href: "/dashboard/shipments",
      label: 'Shipments',
      icon: Package,
    },
  ];
  
  const aiToolsItems = [
     {
      href: "/dashboard/tools/description-generator",
      label: 'AI Storyteller',
      icon: WandSparkles,
    },
    {
      href: "/dashboard/tools/pricing-optimizer",
      label: "Pricing Optimizer",
      icon: DollarSign,
    },
    {
      href: "/dashboard/tools/marketing-suite",
      label: 'Marketing Suite',
      icon: Megaphone,
    },
    {
      href: "/dashboard/tools/visual-enhancer",
      label: 'Visual Enhancer',
      icon: Camera,
    },
    {
      href: "/dashboard/tools/trend-harmonizer",
      label: 'Trend Harmonizer',
      icon: TrendingUp,
    },
     {
      href: "/dashboard/tools/logistics-hub",
      label: 'Logistics Hub',
      icon: Ship,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <Logo size={80}/>
          </Link>
          {state === "expanded" && (
            <Link href="/">
              <h1 className="font-bold text-2xl font-headline text-primary">VIRASAT</h1>
            </Link>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
            <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                {mainMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarGroup>
            <SidebarGroup>
                 <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
                 {aiToolsItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between items-center w-full">
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={{ children: "Settings" }} className="flex-grow">
                <Link href="/dashboard/settings">
                  <Cog />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
               {state === 'expanded' && <ThemeToggle />}
            </div>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: "Back to Site" }}>
              <Link href="/">
                <Home />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 flex items-center gap-2 mt-2 border-t">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="indian man portrait"/>
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {state === 'expanded' && user && (
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden" onClick={signOut}>
            <LogOut className="h-5 w-5"/>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
