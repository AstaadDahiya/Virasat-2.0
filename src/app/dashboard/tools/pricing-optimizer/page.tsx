
"use client";

import { PricingToolForm } from "@/components/pricing-tool-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function PricingOptimizerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Pricing Optimizer</h1>
          <p className="text-muted-foreground">Get AI-powered suggestions for your product pricing.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Suggest a Price</CardTitle>
          <CardDescription>Fill in the details below to get a price suggestion from our AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <PricingToolForm />
        </CardContent>
      </Card>
    </div>
  );
}
