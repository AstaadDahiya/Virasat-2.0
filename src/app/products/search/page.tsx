import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { products, artisans } from "@/lib/data";
import { ProductSearch } from "@/components/product-search";
import { Search } from "lucide-react";

export default function ProductsSearchPage() {
  const categories = [...new Set(products.map(p => p.category))];
  const artisanNames = [...new Set(artisans.map(a => a.name))];

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
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Product Search</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Find exactly what you're looking for. Filter by category, artisan, price, and more.
                </p>
            </div>
          </div>
          <ProductSearch products={products} categories={categories} artisans={artisanNames} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
