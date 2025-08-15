
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArtisanCard } from "@/components/artisan-card";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, Loader2, Languages } from "lucide-react";
import { useLanguage, languages } from "@/context/language-context";
import { useData } from "@/context/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { t, setLanguage, language } = useLanguage();
  const { products, artisans, loading } = useData();

  const featuredProducts = products.slice(0, 4);
  const featuredArtisans = artisans.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full text-white">
          <Image
            src="https://image2url.com/images/1755013518302-cbc2d5b7-60d3-493c-bd70-0894129550e2.png"
            alt="Artisan crafts"
            fill
            className="absolute z-0 object-cover"
            data-ai-hint="indian market panorama"
            priority
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/50 p-4 text-center">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              {t('Handcrafted Stories, Timeless Treasures')}
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              {t('Discover unique, handmade goods from skilled artisans around the world.')}
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products">{t('Explore Products')}</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-secondary/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline flex items-center justify-center gap-3"><Languages/> {t('language_preference_title')}</CardTitle>
                    <CardDescription>{t('language_preference_description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                   <Select onValueChange={(value) => setLanguage(value as any)} defaultValue={language}>
                       <SelectTrigger className="w-full max-w-sm">
                           <SelectValue placeholder="Select a language" />
                       </SelectTrigger>
                       <SelectContent>
                           {languages.map(lang => (
                               <SelectItem key={lang.code} value={lang.code}>
                                   {lang.name} ({lang.nativeName})
                               </SelectItem>
                           ))}
                       </SelectContent>
                   </Select>
                </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
               <h2 className="font-headline text-3xl font-bold md:text-4xl">
                {t('Featured Products')}
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/products" className="flex items-center gap-2">
                  {t('View All')} <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
             {loading ? (
                <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} artisans={artisans} />
                ))}
                </div>
            )}
          </div>
        </section>
        
        <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
             <div className="flex items-center justify-between mb-8">
               <h2 className="font-headline text-3xl font-bold md:text-4xl">
                {t('Meet the Artisans')}
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/artisans" className="flex items-center gap-2">
                  {t('View All')} <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
             {loading ? (
                <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {featuredArtisans.map((artisan) => (
                    <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
                </div>
            )}
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
