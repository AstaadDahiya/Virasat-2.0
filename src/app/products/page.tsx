"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductFilters } from "@/components/product-filters";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { getProducts } from "@/services/firestore";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { t } = useLanguage();
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{t('ourCollection')}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('ourCollectionSubtitle')}
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <ProductFilters products={products} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
