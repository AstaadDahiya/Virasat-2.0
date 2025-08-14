
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, translate } from './language-context';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem('cart'); // Clear corrupted cart data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const productName = language === 'hi' ? product.name_hi : product.name;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
           toast({
                variant: 'destructive',
                title: t('toastNotEnoughStockTitle'),
                description: translate('toastNotEnoughStockDescription', language, { stock: product.stock.toString() }),
           });
           return prevItems;
        }
        toast({
            title: t('toastItemAddedToCartTitle'),
            description: translate('toastItemAddedToCartDescription', language, { name: productName }),
        });
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      if (quantity > product.stock) {
           toast({
                variant: 'destructive',
                title: t('toastNotEnoughStockTitle'),
                description: translate('toastNotEnoughStockDescription', language, { stock: product.stock.toString() }),
           });
           return prevItems;
      }
       toast({
        title: t('toastItemAddedToCartTitle'),
        description: translate('toastItemAddedToCartDescription', language, { name: productName }),
      });
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => {
          if (item.id === productId) {
               if (quantity > item.stock) {
                 toast({
                    variant: 'destructive',
                    title: t('toastNotEnoughStockTitle'),
                    description: translate('toastNotEnoughStockDescription', language, { stock: item.stock.toString() }),
                 });
                 return { ...item, quantity: item.stock };
               }
               return { ...item, quantity };
          }
        return item;
      })
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
