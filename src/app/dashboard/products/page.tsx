"use client";

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
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
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
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { getProducts } from "@/services/firestore";

export default function DashboardProductsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold font-headline">{t('myProducts')}</h1>
            <p className="text-muted-foreground">{t('myProductsSubtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('addProduct')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('allProducts')}</CardTitle>
          <CardDescription>{t('allProductsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                    {t('tableHeaderImage')}
                    </TableHead>
                    <TableHead>{t('tableHeaderName')}</TableHead>
                    <TableHead>{t('tableHeaderCategory')}</TableHead>
                    <TableHead className="hidden md:table-cell text-right">{t('tableHeaderPrice')}</TableHead>
                    <TableHead className="hidden md:table-cell text-right">{t('tableHeaderStock')}</TableHead>
                    <TableHead>
                    <span className="sr-only">{t('tableHeaderActions')}</span>
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
                            <span className="sr-only">{t('toggleMenu')}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('tableHeaderActions')}</DropdownMenuLabel>
                            <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">{t('delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
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
