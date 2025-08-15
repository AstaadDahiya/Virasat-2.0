
"use client";

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
          <p className="text-muted-foreground">Turn your spoken stories into compelling product descriptions.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Record a Story</CardTitle>
          <CardDescription>Record a voice note about your product, its inspiration, or the process. Our AI will transcribe it and write a beautiful description for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <AiStoryteller />
        </CardContent>
      </Card>
    </div>
  );
}
