"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, IndianRupee, Users, Loader2 } from "lucide-react";
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

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { products, loading } = useData();
  
  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('dashboardOverviewTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboardOverviewSubtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,56,787.50</div>
            <p className="text-xs text-muted-foreground">{t('revenueLastMonth')}</p>
          </CardContent>
        </Card>
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
    </div>
  );
}
