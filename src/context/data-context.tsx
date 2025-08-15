
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

  const refreshData = useCallback(async () => {
      setLoading(true);
      try {
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
        setLoading(false);
      }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const cachedProducts = localStorage.getItem('products');
            const cachedArtisans = localStorage.getItem('artisans');
            const cachedShipments = localStorage.getItem('shipments');
            if (cachedProducts && cachedArtisans) {
                setProducts(JSON.parse(cachedProducts));
                setArtisans(JSON.parse(cachedArtisans));
                if(cachedShipments) setShipments(JSON.parse(cachedShipments));
            }

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
                const shipmentsData = await getShipments(user.uid);
                setShipments(shipmentsData);
                localStorage.setItem('shipments', JSON.stringify(shipmentsData));
            }
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
    };
    fetchData();
  }, [user]);


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
