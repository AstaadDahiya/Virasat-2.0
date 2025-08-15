
"use client";

import { Logo } from './logo';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4 text-primary">
              <Logo size={80} />
              <span className="font-bold text-2xl font-headline">VIRASAT</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("homepage.connecting")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">{t('footer.shop')}</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:underline">{t('footer.allProducts')}</Link></li>
              <li><Link href="/products?category=Block-Printing" className="text-sm hover:underline">{t('product.categories.blockPrinting')}</Link></li>
              <li><Link href="/products?category=Wood Carving" className="text-sm hover:underline">{t('product.categories.woodCarving')}</Link></li>
              <li><Link href="/products?category=Embroidery" className="text-sm hover:underline">{t('product.categories.embroidery')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">{t('nav.about')}</h3>
            <ul className="space-y-2">
              <li><Link href="/artisans" className="text-sm hover:underline">{t('footer.ourArtisans')}</Link></li>
              <li><Link href="#" className="text-sm hover:underline">{t('footer.ourStory')}</Link></li>
              <li><Link href="#" className="text-sm hover:underline">{t('footer.careers')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">{t('footer.forArtisans')}</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm hover:underline">{t('footer.sellOnVirasat')}</Link></li>
              <li><Link href="/handbook" className="text-sm hover:underline">{t('footer.artisanHandbook')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VIRASAT. {t('common.allRightsReserved')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:underline">{t('footer.termsOfService')}</Link>
            <Link href="#" className="hover:underline">{t('footer.privacyPolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
