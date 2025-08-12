import { DescriptionGeneratorForm } from "@/components/description-generator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WandSparkles } from "lucide-react";

export default function DescriptionGeneratorPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <WandSparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">AI Description Generator</h1>
          <p className="text-muted-foreground">Craft compelling narratives for your products with the power of AI.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate a Description</CardTitle>
          <CardDescription>Enter some details about your product and let our AI do the writing. The more details you provide, the better the result.</CardDescription>
        </CardHeader>
        <CardContent>
          <DescriptionGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}
