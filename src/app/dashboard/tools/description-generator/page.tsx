"use client";

import { AiStoryteller } from "@/components/ai-storyteller";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AiStorytellerPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Mic className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">{t('aiStorytellerTitle')}</h1>
          <p className="text-muted-foreground">{t('aiStorytellerSubtitle')}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('recordAStory')}</CardTitle>
          <CardDescription>{t('recordAStoryDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AiStoryteller />
        </CardContent>
      </Card>
    </div>
  );
}
