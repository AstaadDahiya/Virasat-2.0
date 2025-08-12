import { MarketingSuiteForm } from "@/components/marketing-suite-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function MarketingSuitePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Smart Marketing Suite</h1>
          <p className="text-muted-foreground">Automatically generate social media posts, email newsletters, and ad copy.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Marketing Content</CardTitle>
          <CardDescription>Select a product and target audience to generate tailored marketing materials.</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketingSuiteForm />
        </CardContent>
      </Card>
    </div>
  );
}
