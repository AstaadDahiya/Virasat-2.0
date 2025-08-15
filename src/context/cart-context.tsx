
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './language-context';

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
    const existingItem = cartItems.find(item => item.id === product.id);

    let canAddToCart = true;
    let toastTitle = t('Item added!');
    let toastDescription = t('Added {{name}} to your cart.', { name: productName });
    let toastVariant: 'default' | 'destructive' = 'default';

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            canAddToCart = false;
            toastTitle = t('Not enough stock');
            toastDescription = t('You cannot add more than the {{stock}} items available.', { stock: product.stock });
            toastVariant = 'destructive';
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    } else {
        if (quantity > product.stock) {
            canAddToCart = false;
            toastTitle = t('Not enough stock');
            toastDescription = t('You cannot add more than the {{stock}} items available.', { stock: product.stock });
            toastVariant = 'destructive';
        } else {
            setCartItems(prevItems => [...prevItems, { ...product, quantity }]);
        }
    }
    
    toast({
        variant: toastVariant,
        title: toastTitle,
        description: toastDescription,
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
    
    const itemToUpdate = cartItems.find(item => item.id === productId);
    if (itemToUpdate && quantity > itemToUpdate.stock) {
        toast({
            variant: 'destructive',
            title: t('Not enough stock'),
            description: t('You cannot add more than the {{stock}} items available.', { stock: itemToUpdate.stock }),
        });
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: item.stock } : item
            )
        );
        return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
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
