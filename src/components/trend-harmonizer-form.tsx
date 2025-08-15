
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  harmonizeTrends,
  type HarmonizeTrendsOutput,
} from "@/ai/flows/harmonize-trends";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useData } from "@/context/data-context";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
});

export function TrendHarmonizerForm() {
  const { toast } = useToast();
  const { products } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HarmonizeTrendsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const product = products.find(p => p.id === values.productId);
      if (!product) {
          toast({ variant: "destructive", title: "Product not found" });
          setLoading(false);
          return;
      }

      const output = await harmonizeTrends({
          productCategory: product.category,
          productDescription: product.description,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not analyze trends. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="productId" render={({ field }) => (
              <FormItem><FormLabel>Product</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a product to analyze" /></SelectTrigger></FormControl><SelectContent><SelectContent>
                {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
              </SelectContent></SelectContent></Select><FormMessage /></FormItem>
          )}/>
          
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Analyzing..." : "Analyze Trends"}
          </Button>
        </form>
      </Form>
      
      {loading && (
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded-full w-1/4 animate-pulse"></div>
                <div className="h-16 bg-muted rounded-lg w-full animate-pulse"></div>
            </div>
             <div className="space-y-2">
                <div className="h-4 bg-muted rounded-full w-1/4 animate-pulse"></div>
                <div className="h-32 bg-muted rounded-lg w-full animate-pulse"></div>
            </div>
        </div>
      )}

      {result && (
        <div className="pt-6 grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.trendAnalysis}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Actionable Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.suggestions}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
