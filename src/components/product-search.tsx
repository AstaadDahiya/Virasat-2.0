"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product, Artisan } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ProductCard } from './product-card';
import { SearchIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface ProductSearchProps {
  products: Product[];
  artisans: Artisan[];
}

export function ProductSearch({ products, artisans }: ProductSearchProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [artisan, setArtisan] = useState('all');
  
  const maxPrice = useMemo(() => {
      if (products.length === 0) return 10000;
      return Math.max(...products.map(p => p.price), 10000);
  }, [products]);

  const [priceRange, setPriceRange] = useState([0, maxPrice]);

   useEffect(() => {
      if (products.length > 0) {
        setPriceRange([0, maxPrice]);
      }
  }, [products, maxPrice]);


  const categories = useMemo(() => {
    return [...new Set(products.map(p => language === 'hi' ? p.category_hi : p.category))]
  }, [products, language]);

  const artisanNames = useMemo(() => {
    return [...new Set(artisans.map(a => language === 'hi' ? a.name_hi : a.name))]
  }, [artisans, language]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productArtisan = artisans.find(a => a.id === product.artisanId);
      const name = language === 'hi' ? product.name_hi : product.name;
      const description = language === 'hi' ? product.description_hi : product.description;
      const productCategory = language === 'hi' ? product.category_hi : product.category;
      const artisanName = language === 'hi' ? productArtisan?.name_hi : productArtisan?.name;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || productCategory === category;
      const matchesArtisan = artisan === 'all' || artisanName === artisan;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesArtisan && matchesPrice;
    });
  }, [products, searchTerm, category, artisan, priceRange, language, artisans]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-secondary rounded-lg border">
        <div className="lg:col-span-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder={t('productSearchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-16"
                />
                 <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                    <SearchIcon className="h-4 w-4 mr-2"/>
                    {t('search')}
                </Button>
            </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('tableHeaderCategory')}</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
           <label className="text-sm font-medium mb-2 block">{t('artisans')}</label>
           <Select value={artisan} onValueChange={setArtisan}>
            <SelectTrigger>
              <SelectValue placeholder={t('allArtisans')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allArtisans')}</SelectItem>
              {artisanNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm font-medium mb-2 block">{t('priceRange')}: <span className="font-semibold text-primary">₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span></label>
          <Slider
            min={0}
            max={maxPrice}
            step={100}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(value) => setPriceRange(value)}
            className="mt-4"
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} artisans={artisans} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-secondary">
          <h3 className="text-2xl font-headline font-bold">{t('noProductsFound')}</h3>
          <p className="text-muted-foreground mt-2">{t('noProductsFoundFilterSubtitle')}</p>
        </div>
      )}
    </div>
  );
}
