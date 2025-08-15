
"use client";

import { TrendHarmonizerForm } from "@/components/trend-harmonizer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function TrendHarmonizerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Trend Harmonizer</h1>
          <p className="text-muted-foreground">Blend market trends with your authentic style.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyze Product Trends</CardTitle>
          <CardDescription>Select one of your products to get an AI analysis of current market trends and suggestions for how you might adapt.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendHarmonizerForm />
        </CardContent>
      </Card>
    </div>
  );
}
