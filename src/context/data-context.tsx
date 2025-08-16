

"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Artisan, Shipment } from '@/lib/types';
import { getProducts, getArtisans, getShipments } from '@/services/firebase';
import { useAuth } from './auth-context';

interface DataContextType {
  products: Product[];
  artisans: Artisan[];
  shipments: Shipment[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    // Prevent fetching if already loading
    if (loading) return;

    setLoading(true);
    try {
      setError(null);
      
      const [productsData, artisansData] = await Promise.all([
        getProducts(),
        getArtisans(),
      ]);

      setProducts(productsData);
      setArtisans(artisansData);
      
      if (user) {
        try {
            const shipmentsData = await getShipments(user.uid);
            setShipments(shipmentsData);
        } catch (shipmentError) {
            console.error("Could not fetch shipments, Firestore index might be missing:", shipmentError);
            setShipments([]); 
        }
      } else {
        // Clear shipments if user logs out
        setShipments([]);
      }
    } catch (err) {
      console.error("Failed to refresh network data:", err);
       if (err instanceof Error) {
          setError(err);
      } else {
          setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [user, loading]); // Depend on user and loading state

  useEffect(() => {
    fetchData();
  }, [user]); // Fetch data only when user changes

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);


  const value = {
    products,
    artisans,
    shipments,
    loading,
    error,
    refreshData,
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
