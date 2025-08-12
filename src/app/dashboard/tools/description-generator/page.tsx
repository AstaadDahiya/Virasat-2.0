import { AiStoryteller } from "@/components/ai-storyteller";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function AiStorytellerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
           <Mic className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">AI Storyteller</h1>
          <p className="text-muted-foreground">Tell your product's story with your voice. We'll turn it into a captivating description.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Record a Story</CardTitle>
          <CardDescription>Share the story, inspiration, and details of your product. Our AI will transform your voice note into a compelling product description.</CardDescription>
        </CardHeader>
        <CardContent>
          <AiStoryteller />
        </CardContent>
      </Card>
    </div>
  );
}
