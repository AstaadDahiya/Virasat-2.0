
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Star, ShoppingCart, IndianRupee, LineChart as LineChartIcon, Loader2 } from "lucide-react";
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
import { useData } from "@/context/data-context";
import { useMemo } from "react";
import { Product } from "@/lib/types";

// Helper to group data by a specific time period (e.g., day, week)
const groupDataByTime = (data: any[], dateKey: string, valueKey: string, unit: 'day' | 'week' | 'month') => {
    const grouped: { [key: string]: number } = {};
    const now = new Date();
    
    data.forEach(item => {
        const itemDate = new Date(item[dateKey]);
        let key = '';

        if (unit === 'day') {
            // Check if the date is within the last 7 days
            const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
            if (diffDays <= 7) {
                key = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
            }
        }
        // Add more units like week/month if needed

        if (key) {
            if (!grouped[key]) {
                grouped[key] = 0;
            }
            grouped[key] += item[valueKey];
        }
    });

    if (unit === 'day') {
        const sortedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = sortedDays.map(day => ({
            date: day,
            revenue: grouped[day] || 0
        }));
        // Sort to show current week days in order
        const todayIndex = now.getDay();
        return [...result.slice(todayIndex + 1), ...result.slice(0, todayIndex + 1)];
    }

    return Object.entries(grouped).map(([date, value]) => ({ date, revenue: value }));
};


export default function AnalyticsPage() {
  const { shipments, products, loading } = useData();

  const analyticsData = useMemo(() => {
    if (loading || !shipments || !products) {
      return {
        totalRevenue: 0,
        totalSales: 0,
        revenueData: [],
        categoryData: [],
      };
    }

    const totalRevenue = shipments.reduce((acc, shipment) => acc + shipment.declared_value, 0);
    const totalSales = shipments.length;
    
    const revenueData = groupDataByTime(shipments, 'createdAt', 'declared_value', 'day');

    const categorySales: { [key: string]: number } = {};
    shipments.forEach(shipment => {
        const product = products.find(p => p.id === shipment.product_id);
        if (product) {
            const categoryName = product.category;
            if (!categorySales[categoryName]) {
                categorySales[categoryName] = 0;
            }
            categorySales[categoryName]++;
        }
    });

    const categoryData = Object.entries(categorySales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5); // Top 5 categories

    return { totalRevenue, totalSales, revenueData, categoryData };

  }, [shipments, products, loading]);


  if (loading) {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

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
            <div className="text-2xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Calculated from all shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalSales}</div>
            <p className="text-xs text-muted-foreground">Total shipments booked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+89</div>
            <p className="text-xs text-muted-foreground">Example data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 / 5</div>
            <p className="text-xs text-muted-foreground">Example data</p>
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
                    <LineChart data={analyticsData.revenueData}>
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
                    <BarChart data={analyticsData.categoryData} layout="vertical" margin={{ left: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
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
