
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
        const shipmentsData = await getShipments(user.uid);
        setShipments(shipmentsData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      if (err instanceof Error) {
          setError(err);
      } else {
          setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    products,
    artisans,
    shipments,
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
