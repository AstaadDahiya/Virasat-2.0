"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product-gallery";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { Product, Artisan } from "@/lib/types";
import { getProduct, getArtisan } from "@/services/supabase";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(params.id);
        if (productData) {
          setProduct(productData);
          const artisanData = await getArtisan(productData.artisanId);
          setArtisan(artisanData);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);
  
  if (loading) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-12 md:py-20 flex items-center justify-center">
                 <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </main>
            <SiteFooter />
        </div>
    )
  }

  if (!product) {
    notFound();
  }

  const productName = language === 'hi' ? product.name_hi : product.name;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <ProductGallery images={product.images} productName={productName} />
            
            <div className="flex flex-col">
              <div>
                <Badge variant="secondary">{language === 'hi' ? product.category_hi : product.category}</Badge>
                <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">{productName}</h1>
                <div className="mt-4 flex items-center gap-4">
                  <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                    <span className="text-muted-foreground text-sm ml-1">{t('productReviews')}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 leading-relaxed">{language === 'hi' ? product.description_hi : product.description}</p>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-lg font-semibold mb-2">{t('productMaterials')}</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {(language === 'hi' ? product.materials_hi : product.materials).map(material => <li key={material}>{material}</li>)}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                 <Button size="lg" className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" /> {t('addToCart')}
                  </Button>
                {artisan && (
                  <div className="mt-6 bg-secondary p-4 rounded-lg flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={artisan.profileImage} alt={artisan.name} data-ai-hint="indian artisan portrait" />
                      <AvatarFallback>{(language === 'hi' ? artisan.name_hi : artisan.name).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('soldBy')}</p>
                      <Link href={`/artisans/${artisan.id}`} className="font-semibold text-accent hover:underline font-headline text-lg">{language === 'hi' ? artisan.name_hi : artisan.name}</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
