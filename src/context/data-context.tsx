

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
  const { user } = useAuth();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShipments = useCallback(async () => {
    if (user) {
        try {
            const shipmentsData = await getShipments(user.uid);
            setShipments(shipmentsData);
        } catch (shipmentError) {
            console.error("Could not fetch shipments, Firestore index might be missing:", shipmentError);
            setShipments([]); 
        }
      } else {
        setShipments([]);
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
      setLoading(true);
      try {
        setError(null);
        const [productsData, artisansData] = await Promise.all([
            getProducts(),
            getArtisans(),
        ]);
        setProducts(productsData);
        setArtisans(artisansData);
        await fetchShipments();
      } catch (err) {
         console.error("Failed to refresh data:", err);
         if (err instanceof Error) {
            setError(err);
        } else {
            setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
  }, [fetchShipments]);
  
   useEffect(() => {
    if(pathname.startsWith('/dashboard')) {
        refreshData();
    }
  }, [pathname, refreshData]);

  useEffect(() => {
    fetchShipments();
  }, [user, fetchShipments]);


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
