
"use client";

import { LogisticsHubForm } from "@/components/logistics-hub-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship } from "lucide-react";

export default function LogisticsHubPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Ship className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Logistics Hub</h1>
          <p className="text-muted-foreground">Get expert advice on shipping and packaging.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Get Shipping Advice</CardTitle>
          <CardDescription>Fill in your shipment details to get AI-powered advice on packaging, customs, and carrier selection.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogisticsHubForm />
        </CardContent>
      </Card>
    </div>
  );
}
