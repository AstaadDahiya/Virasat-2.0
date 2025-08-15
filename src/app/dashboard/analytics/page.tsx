
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Star, ShoppingCart, IndianRupee, LineChart as LineChartIcon } from "lucide-react";
import { 
    ResponsiveContainer, 
    LineChart, 
    BarChart, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    Line, 
    Bar 
} from 'recharts';


const revenueData = [
  { date: "Mon", revenue: 5400 },
  { date: "Tue", revenue: 6100 },
  { date: "Wed", revenue: 4800 },
  { date: "Thu", revenue: 7200 },
  { date: "Fri", revenue: 9800 },
  { date: "Sat", revenue: 12300 },
  { date: "Sun", revenue: 11500 },
];

const categoryData = [
  { name: "Wood Carving", sales: 45 },
  { name: "Block-Printing", sales: 32 },
  { name: "Embroidery", sales: 28 },
  { name: "Pottery", sales: 21 },
  { name: "Textiles", sales: 15 },
];


export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <LineChartIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Analytics</h1>
          <p className="text-muted-foreground">A detailed look at your shop's performance.</p>
        </div>
      </div>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
             <IndianRupee className="h-4 w-4 text-muted-foreground"/>
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

       <div className="grid gap-6 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Daily revenue for the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`}/>
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Revenue']}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
         </Card>
          <Card>
            <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Number of sales by product category.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value) => [value, 'Sales']}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
      </div>

    </div>
  );
}
