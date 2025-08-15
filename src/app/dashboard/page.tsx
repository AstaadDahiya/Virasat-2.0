
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Loader2, Star, ShoppingCart, MessageSquare, ArrowUpRight } from "lucide-react";
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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const chartData = [
    { month: "Jan", sales: 186 },
    { month: "Feb", sales: 305 },
    { month: "Mar", sales: 237 },
    { month: "Apr", sales: 173 },
    { month: "May", sales: 209 },
    { month: "Jun", sales: 284 },
];


export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { products, loading } = useData();
  
  const recentProducts = products.slice(0, 5);
  
  const quickStartSteps = [
      {
          step: 1,
          title: "Complete Profile",
          description: "Tell your story and connect with customers.",
          href: "/dashboard/settings"
      },
      {
          step: 2,
          title: "Add Products",
          description: "Upload your beautiful creations.",
          href: "/dashboard/products/new"
      },
      {
          step: 3,
          title: "Market Your Shop",
          description: "Use AI to create social media buzz.",
          href: "/dashboard/tools/marketing-suite"
      },
      {
          step: 4,
          title: "Get Paid",
          description: "Set up your payment details.",
          href: "/dashboard/settings"
      }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('dashboardOverviewTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboardOverviewSubtitle')}</p>
      </div>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M15 8.502a1.5 1.5 0 0 1-2.43.832l-5.584 2.934a1.502 1.502 0 1 1-1.25-2.264l5.583-2.935a1.5 1.5 0 1 1 3.682 1.433Z"/></svg>
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

       <div>
        <h2 className="text-2xl font-bold font-headline">Quick Start Guide</h2>
        <p className="text-muted-foreground mb-4">New to Virasat? Here are some quick steps to get your shop running.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartSteps.map(step => (
                 <Card key={step.step} className="hover:bg-secondary/50 transition-colors">
                    <Link href={step.href} className="block h-full">
                       <CardContent className="p-6 h-full flex flex-col">
                         <div className="flex justify-between items-start">
                           <p className="text-lg font-bold font-headline">{step.step}. {step.title}</p>
                           <ArrowUpRight className="text-muted-foreground shrink-0"/>
                         </div>
                         <p className="text-muted-foreground text-sm mt-1 flex-grow">{step.description}</p>
                       </CardContent>
                    </Link>
                 </Card>
            ))}
        </div>
      </div>
      
       <Card>
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


      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>A look at your sales performance for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
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
