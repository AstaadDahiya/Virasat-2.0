
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
  const { products, loading } = useData();
  
  const recentProducts = products.slice(0, 5);
  
  const quickStartSteps = [
      {
          step: 1,
          title: 'Setup Profile',
          description: 'Fill in your artisan details and story.',
          href: "/dashboard/settings"
      },
      {
          step: 2,
          title: 'Add a Product',
          description: 'List your first handmade item for sale.',
          href: "/dashboard/products/new"
      },
      {
          step: 3,
          title: 'Generate Content',
          description: 'Use AI to create marketing materials.',
          href: "/dashboard/tools/marketing-suite"
      },
      {
          step: 4,
          title: 'Connect Payouts',
          description: 'Link your bank account to get paid.',
          href: "/dashboard/settings"
      }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's a snapshot of your shop's activity.</p>
      </div>
      
       <div>
        <h2 className="text-2xl font-bold font-headline">Quick Start Guide</h2>
        <p className="text-muted-foreground mb-4">Follow these steps to get your shop up and running.</p>
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
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>A look at your most recently added items.</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/products">View All</Link>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentProducts.map((product) => (
                        <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
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
            <CardDescription>A summary of your sales for the past 6 months.</CardDescription>
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
            <CardDescription>Latest sales, reviews, and messages.</CardDescription>
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
