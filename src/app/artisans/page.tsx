"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArtisanCard } from "@/components/artisan-card";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";
import { Loader2 } from "lucide-react";

export default function ArtisansPage() {
  const { t } = useLanguage();
  const { artisans, loading } = useData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{t('meetOurArtisans')}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('artisansPageSubtitle')}
            </p>
          </div>
          {loading ? (
             <div className="flex justify-center items-center p-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artisans.map(artisan => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
