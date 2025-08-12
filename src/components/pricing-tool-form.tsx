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
  suggestOptimalPricing,
  type SuggestOptimalPricingOutput,
} from "@/ai/flows/suggest-optimal-pricing";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  productName: z.string().min(3, { message: "Product name is required." }),
  materialsCost: z.coerce.number().min(0, { message: "Materials cost must be a positive number." }),
  laborCost: z.coerce.number().min(0, { message: "Labor cost must be a positive number." }),
  marketDemand: z.string({ required_error: "Please select market demand." }),
  artisanSkillLevel: z.string({ required_error: "Please select your skill level." }),
  productQuality: z.string({ required_error: "Please select the product quality." }),
});

export function PricingToolForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalPricingOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      materialsCost: 0,
      laborCost: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await suggestOptimalPricing(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to suggest price. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input placeholder="e.g., Earthenware Serving Bowl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="materialsCost"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Materials Cost ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="15.50" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="laborCost"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Labor Cost ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="25.00" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="marketDemand" render={({ field }) => (
                <FormItem><FormLabel>Market Demand</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select demand" /></SelectTrigger></FormControl><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="artisanSkillLevel" render={({ field }) => (
                <FormItem><FormLabel>Artisan Skill Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select skill level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="productQuality" render={({ field }) => (
                <FormItem><FormLabel>Product Quality</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select quality" /></SelectTrigger></FormControl><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Optimizing..." : "Suggest Price"}
          </Button>
        </form>
      </Form>
      
      {loading && (
        <div className="space-y-4 pt-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Analyzing market data...</p>
        </div>
      )}

      {result && (
        <div className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center bg-primary text-primary-foreground p-6 rounded-lg">
                <h3 className="text-lg font-semibold font-headline mb-2">Suggested Price</h3>
                <p className="text-5xl font-bold">${result.suggestedPrice.toFixed(2)}</p>
            </div>
            <div className="p-6 rounded-md bg-secondary">
                <h3 className="text-lg font-semibold font-headline mb-2">Reasoning</h3>
                <p className="text-secondary-foreground leading-relaxed text-sm">{result.reasoning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
