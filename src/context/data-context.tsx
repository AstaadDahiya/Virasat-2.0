
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Artisan, Shipment } from '@/lib/types';
import { getProducts, getArtisans, seedDatabase, getShipments } from '@/services/firebase';
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

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
        try {
            const cachedProducts = localStorage.getItem('products');
            const cachedArtisans = localStorage.getItem('artisans');
            const cachedShipments = localStorage.getItem('shipments');
            if (cachedProducts && cachedArtisans && cachedShipments) {
                setProducts(JSON.parse(cachedProducts));
                setArtisans(JSON.parse(cachedArtisans));
                setShipments(JSON.parse(cachedShipments));
                setLoading(false);
            }
        } catch (e) {
            console.error("Failed to read from cache", e);
            localStorage.removeItem('products');
            localStorage.removeItem('artisans');
            localStorage.removeItem('shipments');
        }
    }

    try {
      if (!isRefresh && products.length > 0) {
        // Already have data, no full page load
      } else {
        setLoading(true);
      }
      setError(null);
      
      await seedDatabase();

      const [productsData, artisansData] = await Promise.all([
        getProducts(),
        getArtisans(),
      ]);

      setProducts(productsData);
      setArtisans(artisansData);

      localStorage.setItem('products', JSON.stringify(productsData));
      localStorage.setItem('artisans', JSON.stringify(artisansData));
      
      if (user) {
        try {
            const shipmentsData = await getShipments(user.uid);
            setShipments(shipmentsData);
            localStorage.setItem('shipments', JSON.stringify(shipmentsData));
        } catch (shipmentError) {
            console.error("Could not fetch shipments, Firestore index might be missing:", shipmentError);
            setShipments([]); // Set shipments to empty array on error
            localStorage.setItem('shipments', JSON.stringify([]));
        }
      }


    } catch (err) {
      console.error("Failed to fetch network data:", err);
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
  }, [products.length, artisans.length, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const value = {
    products,
    artisans,
    shipments,
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
