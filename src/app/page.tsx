"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArtisanCard } from "@/components/artisan-card";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, Loader2 } from "lucide-react";
import { useData } from "@/context/data-context";

export default function Home() {
  const { products, artisans, loading } = useData();

  const featuredProducts = products.slice(0, 4);
  const featuredArtisans = artisans.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full text-white">
          <Image
            src="https://i.ibb.co/6g2Z3rQ/handcrafted-stories.jpg"
            alt="Artisan crafts"
            fill
            className="absolute z-0 object-cover"
            data-ai-hint="indian market panorama"
            priority
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/50 p-4 text-center">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              Handcrafted Stories, Timeless Treasures
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Discover unique, handmade goods from skilled artisans around the world.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
               <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Featured Products
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/products" className="flex items-center gap-2">
                  View All <ArrowRight size={16} />
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
                Meet the Artisans
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/artisans" className="flex items-center gap-2">
                  View All <ArrowRight size={16} />
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
