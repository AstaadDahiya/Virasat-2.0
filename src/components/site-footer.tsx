
"use client";

import { Logo } from './logo';
import Link from 'next/link';

export function SiteFooter() {

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4 text-primary">
              <Logo size={80} />
              <span className="font-bold text-2xl font-headline">VIRASAT</span>
            </Link>
            <p className="text-sm text-muted-foreground">Connecting you with the world's finest artisans.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:underline">All Products</Link></li>
              <li><Link href="/products?category=Block-Printing" className="text-sm hover:underline">Block-Printing</Link></li>
              <li><Link href="/products?category=Wood Carving" className="text-sm hover:underline">Wood Carving</Link></li>
              <li><Link href="/products?category=Embroidery" className="text-sm hover:underline">Embroidery</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">About</h3>
            <ul className="space-y-2">
              <li><Link href="/artisans" className="text-sm hover:underline">Our Artisans</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Our Story</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">For Artisans</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm hover:underline">Sell on VIRASAT</Link></li>
              <li><Link href="/handbook" className="text-sm hover:underline">Artisan Handbook</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VIRASAT. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
