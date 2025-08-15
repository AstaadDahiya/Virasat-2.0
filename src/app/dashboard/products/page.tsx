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
import { MoreHorizontal, PlusCircle, Loader2, Trash2 } from "lucide-react";
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
import { useData } from "@/context/data-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/services/firebase";
import { Product } from "@/lib/types";

export default function DashboardProductsPage() {
  const { t, language } = useLanguage();
  const { products, loading, refreshData } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Product Deleted",
        description: `"${language === 'hi' ? productToDelete.name_hi : productToDelete.name}" has been deleted.`,
      });
      await refreshData();
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
      setProductToDelete(null);
    }
  };


  return (
    <>
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
                             <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/edit/${product.id}`}>{t('edit')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(product)}>
                                {t('delete')}
                            </DropdownMenuItem>
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
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product "{productToDelete && (language === 'hi' ? productToDelete.name_hi : productToDelete.name)}"
                and all of its data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
            >
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4"/>}
                {isDeleting ? "Deleting..." : "Yes, delete product"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  </>
  );
}
