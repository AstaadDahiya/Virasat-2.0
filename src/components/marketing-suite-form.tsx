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
import { Input } from "@/components/ui/input";
import {
  generateMarketingContent,
  type GenerateMarketingContentOutput,
} from "@/ai/flows/generate-marketing-content";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { products } from "@/lib/data";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
  targetAudience: z.string().min(3, { message: "Target audience is required." }),
});

export function MarketingSuiteForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateMarketingContentOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetAudience: "",
    },
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

      const output = await generateMarketingContent({
          productName: product.name,
          productDescription: product.description,
          targetAudience: values.targetAudience
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate content. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="productId" render={({ field }) => (
              <FormItem><FormLabel>Product</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger></FormControl><SelectContent><SelectContent>
                {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
              </SelectContent></SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl><Input placeholder="e.g., Eco-conscious millennials, home decor enthusiasts" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Content"}
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
        <div className="pt-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Social Media Post</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.socialMediaPost)}><Copy className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.socialMediaPost}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Email Newsletter</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.emailNewsletter)}><Copy className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.emailNewsletter}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ad Copy</CardTitle>
                     <Button variant="ghost" size="icon" onClick={() => handleCopy(result.adCopy)}><Copy className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.adCopy}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
