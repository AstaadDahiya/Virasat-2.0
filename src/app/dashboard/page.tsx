
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, IndianRupee, Users, Loader2, TrendingUp, Star, ShoppingCart, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};


export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { products, artisans, loading } = useData();
  
  const recentProducts = products.slice(0, 5);
  const artisanProfile = artisans.find(a => a.id === "artisan-1"); // Example, replace with logged in artisan

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('dashboardOverviewTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboardOverviewSubtitle')}</p>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('totalRevenue')}</CardTitle>
                        <CardDescription>
                            {t('revenueLastMonth')}
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        View Report
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                         <p className="text-4xl font-bold">₹3,56,787.50</p>
                         <div className="flex items-center gap-1 text-sm text-emerald-500">
                             <TrendingUp className="h-4 w-4"/>
                             <span>+20.1%</span>
                         </div>
                    </div>
                    <div className="h-[250px] w-full mt-4">
                         <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 10
                                }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{products.length}</div>}
                <p className="text-xs text-muted-foreground">{t('productsLastMonth')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('profileViews')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1,302</div>
                <p className="text-xs text-muted-foreground">{t('viewsLastMonth')}</p>
              </CardContent>
            </Card>
        </div>
      </div>


      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                <CardTitle>{t('recentProducts')}</CardTitle>
                <CardDescription>{t('recentProductsDescription')}</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/products">{t('viewAll')}</Link>
                </Button>
            </div>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t('tableHeaderName')}</TableHead>
                        <TableHead>{t('tableHeaderCategory')}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderPrice')}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderStock')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentProducts.map((product) => (
                        <TableRow key={product.id}>
                        <TableCell className="font-medium">{language === 'hi' ? product.name_hi : product.name}</TableCell>
                        <TableCell>{language === 'hi' ? product.category_hi : product.category}</TableCell>
                        <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Updates on sales, reviews, and messages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-full">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                    <p className="font-medium">New Sale: Sheesham Wood Spice Box</p>
                    <p className="text-muted-foreground">by Rohan Mehra, 5 minutes ago</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-full">
                    <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-sm">
                    <p className="font-medium">New 5-star review</p>
                    <p className="text-muted-foreground">for "Hand-Blocked Table Runner"</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-full">
                    <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div className="text-sm">
                    <p className="font-medium">New message from a customer</p>
                    <p className="text-muted-foreground">"Inquiring about custom sizes..."</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-full">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                    <p className="font-medium">New Sale: Chikankari Cotton Kurta</p>
                    <p className="text-muted-foreground">by Aisha Begum, 2 hours ago</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

