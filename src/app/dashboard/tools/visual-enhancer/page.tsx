"use client";

import { VisualEnhancerForm } from "@/components/visual-enhancer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function VisualEnhancerPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Camera className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('visualEnhancerTitle')}</h1>
          <p className="text-muted-foreground">{t('visualEnhancerSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('generateLifestyleMockup')}</CardTitle>
          <CardDescription>{t('generateLifestyleMockupDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <VisualEnhancerForm />
        </CardContent>
      </Card>
    </div>
  );
}
