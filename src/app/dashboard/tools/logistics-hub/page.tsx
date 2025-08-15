
"use client";

import { LogisticsHubForm } from "@/components/logistics-hub-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function LogisticsHubPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Ship className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('logisticsHubTitle')}</h1>
          <p className="text-muted-foreground">{t('logisticsHubSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('getShippingAdvice')}</CardTitle>
          <CardDescription>{t('getShippingAdviceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LogisticsHubForm />
        </CardContent>
      </Card>
    </div>
  );
}
