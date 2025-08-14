"use client";

import { useState, useEffect } from "react";
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
import { useLanguage } from "@/context/language-context";
import { Product } from "@/lib/types";
import { getProducts } from "@/services/firestore";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
});

export function TrendHarmonizerForm() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HarmonizeTrendsOutput | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
        const productsData = await getProducts();
        setProducts(productsData);
    }
    fetchProducts();
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const product = products.find(p => p.id === values.productId);
      if (!product) {
          toast({ variant: "destructive", title: t('toastProductNotFound') });
          setLoading(false);
          return;
      }

      const output = await harmonizeTrends({
          productCategory: language === 'hi' ? product.category_hi : product.category,
          productDescription: language === 'hi' ? product.description_hi : product.description,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('toastErrorTitle'),
        description: t('toastTrendAnalysisError'),
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
              <FormItem><FormLabel>{t('product')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('selectProductToAnalyze')} /></SelectTrigger></FormControl><SelectContent><SelectContent>
                {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>{language === 'hi' ? product.name_hi : product.name}</SelectItem>
                ))}
              </SelectContent></SelectContent></Select><FormMessage /></FormItem>
          )}/>
          
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t('analyzing') : t('analyzeTrends')}
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
                    <CardTitle>{t('trendAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.trendAnalysis}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('actionableSuggestions')}</CardTitle>
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
