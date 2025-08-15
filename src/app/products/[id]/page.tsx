
"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product-gallery";
import { ShoppingCart, Star, Loader2, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { Product, Artisan } from "@/lib/types";
import { getProduct, getArtisan } from "@/services/firebase";
import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await getProduct(id);
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
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
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
                 <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus/></Button>
                        <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-16 text-center" min="1" max={product.stock} />
                        <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.min(product.stock, q+1))}><Plus/></Button>
                    </div>
                     <p className="text-sm text-muted-foreground">{product.stock} {t('inStock')}</p>
                 </div>

                 <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock < 1}>
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
                    {product.stock > 0 ? t('addToCart') : t('outOfStock')}
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
