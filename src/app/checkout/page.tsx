
"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { CreditCard, Lock, User, Mail, Home as HomeIcon, MapPin, Building, Smartphone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { t, language } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. A confirmation has been sent to your email.",
        });
        clearCart();
        router.push('/');
    };
    
    if (!isClient) {
        return null;
    }

    if (cartItems.length === 0) {
        return (
             <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold font-headline">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mt-2 max-w-md">Looks like you haven't added anything to your cart yet. Browse our collection to find something special.</p>
                    <Button asChild className="mt-6">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </main>
                <SiteFooter />
            </div>
        )
    }

    const shippingCost = cartTotal > 0 ? 50.00 : 0;
    const total = cartTotal + shippingCost;

    return (
        <div className="flex min-h-screen flex-col bg-secondary">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-12">
                 <div className="text-center mb-10">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
                    <p className="text-muted-foreground mt-2">Complete your purchase by providing the details below.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form onSubmit={handlePlaceOrder} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-headline">Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" placeholder="Rohan Mehra" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="rohan@example.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input id="address" placeholder="123, Craft Lane" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Jaipur" required />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="Rajasthan" required />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input id="zip" placeholder="302001" required />
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                                    </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-headline">Payment Details</CardTitle>
                                <CardDescription>All transactions are secure and encrypted.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="space-y-2">
                                    <Label htmlFor="card-name">Name on Card</Label>
                                    <Input id="card-name" placeholder="Rohan Mehra" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="card-number" placeholder="1234 5678 9012 3456" className="pl-10" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry-date">Expiry Date</Label>
                                        <Input id="expiry-date" placeholder="MM / YY" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input id="cvc" placeholder="123" className="pl-10" required />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Button type="submit" size="lg" className="w-full">
                            Place Order (₹{total.toFixed(2)})
                        </Button>
                    </form>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ScrollArea className="h-64 pr-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center gap-4 py-2">
                                            <div className="flex items-center gap-4">
                                                <Image
                                                    src={item.images[0]}
                                                    alt={language === 'hi' ? item.name_hi : item.name}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold line-clamp-1">{language === 'hi' ? item.name_hi : item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>{t('subtotal')}</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{shippingCost.toFixed(2)}</span>
                                    </div>
                                     <Separator />
                                     <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

// Dummy ScrollArea component for type-checking, since the real one exists in the project
const ScrollArea = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={className}>{children}</div>
);
