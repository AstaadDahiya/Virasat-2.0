
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

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      setError(null);
      
      // We only seed the database if it's the very first load and no products exist.
      // This is a simplified check. A more robust system might use a 'version' flag.
      const productCollection = await getDocs(collection(db, 'products'));
      if (productCollection.empty) {
        await seedDatabase();
      }

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
            setShipments([]); 
            localStorage.setItem('shipments', JSON.stringify([]));
        }
      }
    } catch (err) {
      console.error("Failed to refresh network data:", err);
       if (err instanceof Error) {
          setError(err);
      } else {
          setError(new Error('An unknown error occurred'));
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    // This effect runs once on mount to load initial data.
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const cachedProducts = localStorage.getItem('products');
        const cachedArtisans = localStorage.getItem('artisans');
        const cachedShipments = localStorage.getItem('shipments');
        
        if (cachedProducts && cachedArtisans) {
          setProducts(JSON.parse(cachedProducts));
          setArtisans(JSON.parse(cachedArtisans));
          if(cachedShipments) setShipments(JSON.parse(cachedShipments));
          setLoading(false); // Stop loading indicator early with cached data
          await fetchData(false); // Then refresh data in the background
        } else {
          await fetchData(true); // Fetch data with loading indicator if no cache
        }
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData(false);
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
