import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArtisanCard } from "@/components/artisan-card";
import { artisans } from "@/lib/data";

export default function ArtisansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Meet Our Artisans</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              The heart and soul of Virasat. Discover the stories and crafts of the talented individuals behind our products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map(artisan => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
