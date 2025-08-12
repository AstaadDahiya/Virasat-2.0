"use client";

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { artisans } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ProductCard } from './product-card';
import { SearchIcon } from 'lucide-react';

interface ProductSearchProps {
  products: Product[];
  categories: string[];
  artisans: string[];
}

export function ProductSearch({ products, categories, artisans: artisanNames }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [artisan, setArtisan] = useState('all');
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 10000), [products]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productArtisan = artisans.find(a => a.id === product.artisanId);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesArtisan = artisan === 'all' || productArtisan?.name === artisan;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesArtisan && matchesPrice;
    });
  }, [products, searchTerm, category, artisan, priceRange]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-secondary rounded-lg border">
        <div className="lg:col-span-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search by product name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-16"
                />
                 <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                    <SearchIcon className="h-4 w-4 mr-2"/>
                    Search
                </Button>
            </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
           <label className="text-sm font-medium mb-2 block">Artisan</label>
           <Select value={artisan} onValueChange={setArtisan}>
            <SelectTrigger>
              <SelectValue placeholder="All Artisans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artisans</SelectItem>
              {artisanNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm font-medium mb-2 block">Price Range: <span className="font-semibold text-primary">₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span></label>
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-secondary">
          <h3 className="text-2xl font-headline font-bold">No Products Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}