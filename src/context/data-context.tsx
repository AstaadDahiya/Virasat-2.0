
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Artisan } from '@/lib/types';
import { getProducts, getArtisans, seedDatabase } from '@/services/firebase';

interface DataContextType {
  products: Product[];
  artisans: Artisan[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    // On initial load, try to get data from cache first
    if (!isRefresh) {
        try {
            const cachedProducts = localStorage.getItem('products');
            const cachedArtisans = localStorage.getItem('artisans');
            if (cachedProducts && cachedArtisans) {
                console.log("Loading data from cache.");
                setProducts(JSON.parse(cachedProducts));
                setArtisans(JSON.parse(cachedArtisans));
                setLoading(false); // Stop initial loading spinner
            }
        } catch (e) {
            console.error("Failed to read from cache", e);
            // If cache is corrupt, clear it
            localStorage.removeItem('products');
            localStorage.removeItem('artisans');
        }
    }

    // Always try to fetch fresh data from the network
    try {
      if (!isRefresh && products.length > 0) {
        // If we already have cached data, don't show a full-page loader
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Seed database if it's empty
      await seedDatabase();

      const [productsData, artisansData] = await Promise.all([
        getProducts(),
        getArtisans(),
      ]);

      setProducts(productsData);
      setArtisans(artisansData);

      // Update cache with fresh data
      localStorage.setItem('products', JSON.stringify(productsData));
      localStorage.setItem('artisans', JSON.stringify(artisansData));
      console.log("Cache updated with fresh data.");

    } catch (err) {
      console.error("Failed to fetch network data:", err);
      // If fetching fails, we'll just rely on the cached data.
      // Only set an error if we have no cached data at all.
      if (products.length === 0 && artisans.length === 0) {
          if (err instanceof Error) {
              setError(err);
          } else {
              setError(new Error('An unknown error occurred'));
          }
      }
    } finally {
      setLoading(false);
    }
  }, [products.length, artisans.length]); // Dependencies to re-evaluate the function

  useEffect(() => {
    fetchData();
    // The empty dependency array is correct here.
    // We only want this effect to run once on mount.
    // `fetchData` is wrapped in `useCallback` to be stable.
  }, [fetchData]);


  const value = {
    products,
    artisans,
    loading,
    error,
    refreshData: () => fetchData(true),
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
