"use client";

import { TrendHarmonizerForm } from "@/components/trend-harmonizer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function TrendHarmonizerPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('trendHarmonizerTitle')}</h1>
          <p className="text-muted-foreground">{t('trendHarmonizerSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('analyzeProductTrends')}</CardTitle>
          <CardDescription>{t('analyzeProductTrendsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendHarmonizerForm />
        </CardContent>
      </Card>
    </div>
  );
}
