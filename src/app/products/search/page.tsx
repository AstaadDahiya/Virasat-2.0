"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductSearch } from "@/components/product-search";
import { Loader2, Search } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";

export default function ProductsSearchPage() {
  const { t } = useLanguage();
  const { products, artisans, loading } = useData();
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-secondary rounded-lg">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold">{t('productSearchTitle')}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    {t('productSearchSubtitle')}
                </p>
            </div>
          </div>
          {loading ? (
             <div className="flex justify-center items-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <ProductSearch products={products} artisans={artisans} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
