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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
  targetAudience: z.string().min(3, { message: "Target audience is required." }),
});

export function MarketingSuiteForm() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
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
          toast({ variant: "destructive", title: t('toastProductNotFound') });
          setLoading(false);
          return;
      }

      const output = await generateMarketingContent({
          productName: language === 'hi' ? product.name_hi : product.name,
          productDescription: language === 'hi' ? product.description_hi : product.description,
          targetAudience: values.targetAudience
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('toastErrorTitle'),
        description: t('toastErrorDescription'),
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('toastCopied'),
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="productId" render={({ field }) => (
              <FormItem><FormLabel>{t('product')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('selectAProduct')} /></SelectTrigger></FormControl><SelectContent><SelectContent>
                {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>{language === 'hi' ? product.name_hi : product.name}</SelectItem>
                ))}
              </SelectContent></SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('targetAudience')}</FormLabel>
                <FormControl><Input placeholder={t('targetAudiencePlaceholder')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t('generating') : t('generateContent')}
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
                    <CardTitle>{t('socialMediaPost')}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.socialMediaPost)}><Copy className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.socialMediaPost}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('emailNewsletter')}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.emailNewsletter)}><Copy className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground whitespace-pre-wrap">{result.emailNewsletter}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('adCopy')}</CardTitle>
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
