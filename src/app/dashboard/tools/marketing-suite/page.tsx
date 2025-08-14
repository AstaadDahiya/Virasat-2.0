"use client";

import { MarketingSuiteForm } from "@/components/marketing-suite-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function MarketingSuitePage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('marketingSuiteTitle')}</h1>
          <p className="text-muted-foreground">{t('marketingSuiteSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('generateMarketingContent')}</CardTitle>
          <CardDescription>{t('generateMarketingContentDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketingSuiteForm />
        </CardContent>
      </Card>
    </div>
  );
}
