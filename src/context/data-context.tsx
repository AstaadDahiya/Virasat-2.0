
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Artisan } from '@/lib/types';
import { getProducts, getArtisans } from '@/services/supabase';

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, artisansData] = await Promise.all([
        getProducts(),
        getArtisans(),
      ]);
      setProducts(productsData);
      setArtisans(artisansData);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      if (err instanceof Error) {
          setError(err);
      } else {
          setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    products,
    artisans,
    loading,
    error,
    refreshData: fetchData,
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

    