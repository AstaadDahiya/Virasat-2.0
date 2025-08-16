

"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Artisan, Shipment } from '@/lib/types';
import { getProducts, getArtisans, getShipments } from '@/services/firebase';
import { useAuth } from './auth-context';
import { usePathname } from 'next/navigation';

interface DataContextType {
  products: Product[];
  artisans: Artisan[];
  shipments: Shipment[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  fetchInitialData: (type: 'all' | 'featured') => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasDashboardData, setHasDashboardData] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
        setProducts([]);
        setArtisans([]);
        setShipments([]);
        setHasDashboardData(false);
        setLoading(false);
        return;
    };
    
    setLoading(true);
    try {
      setError(null);
      const [productsData, artisansData, shipmentsData] = await Promise.all([
        getProducts(),
        getArtisans(),
        getShipments(user.uid),
      ]);

      setProducts(productsData);
      setArtisans(artisansData);
      setShipments(shipmentsData);
      setHasDashboardData(true);

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
       if (err instanceof Error) {
          setError(err);
      } else {
          setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchInitialData = useCallback(async (type: 'all' | 'featured' = 'all') => {
    setLoading(true);
    try {
      setError(null);
      
      const productLimit = type === 'featured' ? 4 : undefined;
      const artisanLimit = type === 'featured' ? 3 : undefined;
      
      const [productsData, artisansData] = await Promise.all([
        getProducts(productLimit),
        getArtisans(artisanLimit),
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

  const refreshData = useCallback(async () => {
      // This function will now essentially re-run the main dashboard data fetch.
      await fetchDashboardData();
  }, [fetchDashboardData]);
  
   useEffect(() => {
    // Only fetch dashboard data if we are in the dashboard, we have a user, and we haven't fetched it yet.
    if(pathname.startsWith('/dashboard') && user && !hasDashboardData && !authLoading) {
        fetchDashboardData();
    }
  }, [pathname, user, hasDashboardData, fetchDashboardData, authLoading]);


  const value = {
    products,
    artisans,
    shipments,
    loading,
    error,
    refreshData,
    fetchInitialData,
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
