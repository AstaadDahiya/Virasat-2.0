
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, IndianRupee, Users, Loader2, TrendingUp, Star, ShoppingCart, MessageSquare, LineChart } from "lucide-react";
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

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,56,787</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+89</div>
            <p className="text-xs text-muted-foreground">32 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 / 5</div>
            <p className="text-xs text-muted-foreground">Based on 215 reviews</p>
          </CardContent>
        </Card>
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
