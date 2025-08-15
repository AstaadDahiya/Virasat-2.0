
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product, Artisan } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';

interface ProductCardProps {
  product: Product;
  artisans: Artisan[];
}

export function ProductCard({ product, artisans }: ProductCardProps) {
  const artisan = artisans.find(a => a.id === product.artisanId);
  const { t, language } = useLanguage();

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl h-full">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint="indian craft product"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{language === 'hi' ? product.category_hi : product.category}</Badge>
        <CardTitle className="text-lg font-headline leading-tight mb-1">
          <Link href={`/products/${product.id}`}>{language === 'hi' ? product.name_hi : product.name}</Link>
        </CardTitle>
        {artisan && (
          <p className="text-sm text-muted-foreground">
            {t('common.by')} <Link href={`/artisans/${artisan.id}`} className="hover:underline text-accent">{language === 'hi' ? artisan.name_hi : artisan.name}</Link>
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">₹{product.price.toFixed(2)}</p>
        <Button asChild size="sm">
          <Link href={`/products/${product.id}`}>{t('product.viewDetails')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
