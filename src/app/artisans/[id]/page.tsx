
"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { ContactArtisanForm } from "@/components/contact-artisan-form";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import { Product, Artisan } from "@/lib/types";
import { getArtisan, getProducts } from "@/services/supabase";

export default function ArtisanDetailPage({ params: { id } }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artisanData = await getArtisan(id);
        if (artisanData) {
          setArtisan(artisanData);
          const allProducts = await getProducts();
          const artisanProducts = allProducts.filter(p => p.artisanId === id);
          setProducts(artisanProducts);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch artisan data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchData();
    }
  }, [id]);

   if (loading) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 bg-secondary py-12 md:py-20 flex items-center justify-center">
                 <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </main>
            <SiteFooter />
        </div>
    )
  }

  if (!artisan) {
    notFound();
  }
  
  const artisanName = language === 'hi' ? artisan.name_hi : artisan.name;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <Card className="overflow-hidden">
            <div className="relative h-48 md:h-64 w-full">
              <Image src="https://placehold.co/1200x400.png" alt={`${artisanName}'s workshop`} fill className="object-cover" data-ai-hint="indian artisan workshop" />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 -mt-20 md:-mt-24 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 md:border-8 border-background shadow-lg shrink-0">
                  <Image
                    src={artisan.profileImage}
                    alt={artisanName}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint="indian artisan portrait"
                  />
                </div>
                <div className="pt-4">
                  <h1 className="font-headline text-3xl md:text-4xl font-bold">{artisanName}</h1>
                  <p className="text-lg text-primary font-semibold mt-1">{language === 'hi' ? artisan.craft_hi : artisan.craft}</p>
                   <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin size={14} className="mr-1" />
                    {language === 'hi' ? artisan.location_hi : artisan.location}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <h2 className="font-headline text-2xl font-bold mb-4">{t('artisanDetailAbout')} {artisanName}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{language === 'hi' ? artisan.bio_hi : artisan.bio}</p>
                </div>
                <div>
                   <h2 className="font-headline text-2xl font-bold mb-4">{t('artisanDetailContact')} {artisanName}</h2>
                   <ContactArtisanForm />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16">
            <h2 className="font-headline text-3xl font-bold mb-6">{t('artisanDetailProductsBy')} {artisanName}</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} artisans={[artisan]} />
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
