
"use client";

import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

export default function DashboardProductsPage() {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold font-headline">{t('dashboard.myProducts.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.myProducts.subtitle')}</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> {t('dashboard.myProducts.addProduct')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>A list of all products in your shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  {t('dashboard.tableHeaders.image')}
                </TableHead>
                <TableHead>{t('dashboard.tableHeaders.name')}</TableHead>
                <TableHead>{t('dashboard.tableHeaders.category')}</TableHead>
                <TableHead className="hidden md:table-cell text-right">{t('dashboard.tableHeaders.price')}</TableHead>
                <TableHead className="hidden md:table-cell text-right">{t('dashboard.tableHeaders.stock')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('dashboard.tableHeaders.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={language === 'hi' ? product.name_hi : product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.images[0]}
                      width="64"
                      data-ai-hint="product image"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{language === 'hi' ? product.name_hi : product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{language === 'hi' ? product.category_hi : product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell text-right">{product.stock}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('nav.toggleMenu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('dashboard.tableHeaders.actions')}</DropdownMenuLabel>
                        <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">{t('common.delete')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
