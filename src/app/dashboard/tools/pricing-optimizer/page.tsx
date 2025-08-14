"use client";

import { PricingToolForm } from "@/components/pricing-tool-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function PricingOptimizerPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('pricingOptimizerTitle')}</h1>
          <p className="text-muted-foreground">{t('pricingOptimizerSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('suggestPrice')}</CardTitle>
          <CardDescription>{t('suggestPriceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PricingToolForm />
        </CardContent>
      </Card>
    </div>
  );
}
