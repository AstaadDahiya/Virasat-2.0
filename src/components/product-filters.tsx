"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product, Artisan } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from './product-card';
import { Search } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';

interface ProductFiltersProps {
  products: Product[];
}

export function ProductFilters({ products }: ProductFiltersProps) {
  const { t, language } = useLanguage();
  const { artisans } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  const maxPrice = useMemo(() => {
      if(products.length === 0) return 10000;
      return Math.max(...products.map(p => p.price), 10000)
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


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const name = language === 'hi' ? product.name_hi : product.name;
      const description = language === 'hi' ? product.description_hi : product.description;
      const productCategory = language === 'hi' ? product.category_hi : product.category;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || productCategory === category;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, category, priceRange, language]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-secondary rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchProductsPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectACategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('priceRange')}</span>
            <span className="font-medium text-primary">₹{priceRange[0]} - ₹{priceRange[1]}</span>
          </div>
          <Slider
            min={0}
            max={maxPrice}
            step={100}
            value={[priceRange[1]]}
            onValueChange={(value) => setPriceRange([0, value[0]])}
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
        <div className="text-center py-16">
          <h3 className="text-2xl font-headline">{t('noProductsFound')}</h3>
          <p className="text-muted-foreground mt-2">{t('noProductsFoundSubtitle')}</p>
        </div>
      )}
    </div>
  );
}
