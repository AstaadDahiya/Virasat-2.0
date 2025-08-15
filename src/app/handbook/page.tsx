
"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Settings, PackagePlus, WandSparkles, Mic, Camera, Megaphone, DollarSign, TrendingUp, BarChart2, Ship } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export default function HandbookPage() {
    const { t } = useLanguage();
    return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 space-y-12 max-w-4xl">
            <div className="text-center">
                <div className="inline-block p-4 bg-secondary rounded-lg mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline">{t('handbookTitle')}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t('handbookSubtitle')}</p>
            </div>

            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>{t('handbookWelcomeTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{t('handbookWelcomeContent')}</p>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">{t('handbookChapter1')}</span> {t('handbookChapter1Title')}</h2>
                <p className="text-muted-foreground">{t('handbookChapter1Subtitle')}</p>
                <div className="grid md:grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Settings size={20}/> {t('handbookStep1Title')}</CardTitle>
                            <CardDescription>{t('handbookStep1Content')}</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><PackagePlus size={20}/> {t('handbookStep2Title')}</CardTitle>
                             <CardDescription>{t('handbookStep2Content')}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">{t('handbookChapter2')}</span> {t('handbookChapter2Title')}</h2>
                <p className="text-muted-foreground">{t('handbookChapter2Subtitle')}</p>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Mic size={20}/> {t('aiStorytellerTitle')}</CardTitle>
                            <CardDescription>{t('handbookAiStorytellerContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Camera size={20}/> {t('visualEnhancerTitle')}</CardTitle>
                             <CardDescription>{t('handbookVisualEnhancerContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Megaphone size={20}/> {t('marketingSuiteTitle')}</CardTitle>
                             <CardDescription>{t('handbookMarketingSuiteContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><DollarSign size={20}/> {t('pricingOptimizerTitle')}</CardTitle>
                             <CardDescription>{t('handbookPricingOptimizerContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><TrendingUp size={20}/> {t('trendHarmonizerTitle')}</CardTitle>
                             <CardDescription>{t('handbookTrendHarmonizerContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                 </div>
            </div>

            <div className="space-y-6">
                 <h2 className="text-3xl font-bold font-headline flex items-center gap-3"><span className="text-primary">{t('handbookChapter3')}</span> {t('handbookChapter3Title')}</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><BarChart2 size={20}/> {t('analytics')}</CardTitle>
                             <CardDescription>{t('handbookAnalyticsContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg"><Ship size={20}/> {t('shipping')}</CardTitle>
                             <CardDescription>{t('handbookShippingContent')}</CardDescription>
                        </CardHeader>
                    </Card>
                 </div>
            </div>

             <Card className="bg-secondary/50 text-center">
                <CardHeader>
                    <CardTitle>{t('handbookReadyToJoinTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>{t('handbookReadyToJoinContent')}</p>
                    <Button asChild size="lg">
                        <Link href="/signup">{t('createArtisanAccount')}</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
    );
}
