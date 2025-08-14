"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { ProductFilters } from "@/components/product-filters";
import { useLanguage } from "@/context/language-context";

export default function ProductsPage() {
  const { t } = useLanguage();
  const categories = [...new Set(products.map(p => p.category))];

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
          <ProductFilters products={products} categories={categories} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
