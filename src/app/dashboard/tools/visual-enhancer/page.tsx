import { VisualEnhancerForm } from "@/components/visual-enhancer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

export default function VisualEnhancerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Camera className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Visual Enhancer & Mockup Studio</h1>
          <p className="text-muted-foreground">Create stunning, professional-looking product photos and mockups.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Lifestyle Mockup</CardTitle>
          <CardDescription>Upload a photo of your product and describe a scene. Our AI will generate a realistic lifestyle image.</CardDescription>
        </CardHeader>
        <CardContent>
          <VisualEnhancerForm />
        </CardContent>
      </Card>
    </div>
  );
}
