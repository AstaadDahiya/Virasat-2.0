
"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Box,
  WandSparkles,
  CircleHelp,
  User,
  LogOut,
  Home,
  Cog,
  DollarSign,
  Megaphone,
  Camera,
  TrendingUp,
  Languages,
  LineChart,
  Ship
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./logo";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();


  const menuItems = [
    {
      href: "/dashboard",
      label: t('dashboardOverviewTitle'),
      icon: LayoutGrid,
    },
    {
      href: "/dashboard/products",
      label: t('myProducts'),
      icon: Box,
    },
  ];

  const toolsItems = [
    {
      href: "/dashboard/tools/description-generator",
      label: t('aiStorytellerTitle'),
      icon: WandSparkles,
    },
    {
      href: "/dashboard/tools/pricing-optimizer",
      label: t('pricingOptimizerTitle'),
      icon: DollarSign,
    },
    {
      href: "/dashboard/tools/marketing-suite",
      label: t('marketingSuiteTitle'),
      icon: Megaphone,
    },
    {
      href: "/dashboard/tools/visual-enhancer",
      label: t('visualEnhancerTitle'),
      icon: Camera,
    },
    {
      href: "/dashboard/tools/trend-harmonizer",
      label: t('trendHarmonizerTitle'),
      icon: TrendingUp,
    },
     {
      href: "/dashboard/tools/logistics-hub",
      label: t('logisticsHubTitle'),
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
          {menuItems.map((item) => (
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
        </SidebarMenu>
        
        <SidebarMenu className="mt-4">
           <p className="px-2 text-xs text-muted-foreground mb-2 group-data-[collapsible=icon]:hidden">{t('aiTools')}</p>
           {toolsItems.map((item) => (
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
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between items-center w-full">
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={{ children: t('settings') }} className="flex-grow">
                <Link href="/dashboard/settings">
                  <Cog />
                  <span>{t('settings')}</span>
                </Link>
              </SidebarMenuButton>
               {state === 'expanded' && <ThemeToggle />}
            </div>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: t('backToSite') }}>
              <Link href="/">
                <Home />
                <span>{t('backToSite')}</span>
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
