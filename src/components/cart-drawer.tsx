
"use client";

import { useCart, CartItem } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { t, language } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('Shopping Cart')}</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.images[0]}
                      alt={language === 'hi' ? item.name_hi : item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{language === 'hi' ? item.name_hi : item.name}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                       <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                           <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></Button>
                           <span>{item.quantity}</span>
                           <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 size={16}/></Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                 <Separator />
                 <div className="flex justify-between font-semibold">
                    <span>{t('Subtotal')}</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                 </div>
                 <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
                    <Link href="/checkout">{t('Checkout')}</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold text-lg">{t('Your cart is empty')}</h3>
            <p className="text-muted-foreground mt-1">{t('Find something beautiful to add!')}</p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>{t('Continue Shopping')}</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
