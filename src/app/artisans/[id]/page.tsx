"use client";

import { artisans, products } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { ContactArtisanForm } from "@/components/contact-artisan-form";
import { useLanguage } from "@/context/language-context";

export default function ArtisanDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const artisan = artisans.find(a => a.id === params.id);

  if (!artisan) {
    notFound();
  }

  const artisanProducts = products.filter(p => p.artisanId === artisan.id);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <Card className="overflow-hidden">
            <div className="relative h-48 md:h-64 w-full">
              <Image src="https://placehold.co/1200x400.png" alt={`${artisan.name}'s workshop`} fill className="object-cover" data-ai-hint="indian artisan workshop" />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 -mt-20 md:-mt-24 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 md:border-8 border-background shadow-lg shrink-0">
                  <Image
                    src={artisan.profileImage}
                    alt={artisan.name}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint="indian artisan portrait"
                  />
                </div>
                <div className="pt-4">
                  <h1 className="font-headline text-3xl md:text-4xl font-bold">{artisan.name}</h1>
                  <p className="text-lg text-primary font-semibold mt-1">{artisan.craft}</p>
                   <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin size={14} className="mr-1" />
                    {artisan.location}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <h2 className="font-headline text-2xl font-bold mb-4">{t('artisanDetailAbout')} {artisan.name}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{artisan.bio}</p>
                </div>
                <div>
                   <h2 className="font-headline text-2xl font-bold mb-4">{t('artisanDetailContact')} {artisan.name}</h2>
                   <ContactArtisanForm />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16">
            <h2 className="font-headline text-3xl font-bold mb-6">{t('artisanDetailProductsBy')} {artisan.name}</h2>
            {artisanProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {artisanProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
               <p className="text-muted-foreground">{t('artisanDetailNoProducts')}</p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
