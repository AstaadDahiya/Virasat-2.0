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
  Sprout,
  User,
  LogOut,
  Home,
  Cog,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const menuItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: Box,
  },
];

const toolsItems = [
  {
    href: "/dashboard/tools/description-generator",
    label: "Description Generator",
    icon: WandSparkles,
  },
  {
    href: "/dashboard/tools/pricing-optimizer",
    label: "Pricing Optimizer",
    icon: DollarSign,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 text-accent">
            <Sprout className="h-6 w-6" />
          </Link>
          {state === "expanded" && (
            <Link href="/">
              <h1 className="font-bold text-lg font-headline text-accent">Virasat</h1>
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
           <p className="px-2 text-xs text-muted-foreground mb-2 group-data-[collapsible=icon]:hidden">AI Tools</p>
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
            <SidebarMenuButton asChild tooltip={{ children: 'Settings' }}>
              <Link href="#">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: 'Back to Site' }}>
              <Link href="/">
                <Home />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 flex items-center gap-2 mt-2 border-t">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="flex-1">
              <p className="text-sm font-semibold">Artisan User</p>
              <p className="text-xs text-muted-foreground">artisan@email.com</p>
            </div>
          )}
          <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
            <LogOut className="h-5 w-5"/>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
