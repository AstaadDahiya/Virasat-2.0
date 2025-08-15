
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
import { Loader2, Copy, Instagram, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
  targetAudience: z.string().min(3, { message: "Target audience is required." }),
});

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.81-1.77-1.8-2.55-4.16-2.4-6.6s.92-4.67 2.56-6.44c.97-1.04 2.16-1.86 3.48-2.34.01 2.05.01 4.1-.01 6.15-.3.89-.68 1.74-1.16 2.55-.47.8-.9 1.69-1.28 2.62-.43 1.07-.56 2.26-.56 3.43.01 1.43.34 2.87.97 4.18.64 1.32 1.52 2.54 2.65 3.52.99.88 2.21 1.54 3.5 1.95.84.26 1.7.42 2.58.42 1.46 0 2.9-.45 4.12-1.25.99-.64 1.87-1.5 2.58-2.54.71-1.04 1.2-2.22 1.42-3.48.01-1.02-.09-2.05-.28-3.06-.01-.01-.01-.01 0 0z"/>
    </svg>
)

export function MarketingSuiteForm() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { products } = useData();
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

  const socialPosts = result ? [
      { title: "Instagram Post", content: result.instagramPost, icon: <Instagram />},
      { title: "Facebook Post", content: result.facebookPost, icon: <Facebook />},
      { title: "Twitter Post", content: result.twitterPost, icon: <Twitter />},
      { title: "TikTok Post", content: result.tiktokPost, icon: <TikTokIcon />}
  ] : [];

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
            {socialPosts.map(post => (
                 <Card key={post.title}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">{post.icon} {post.title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(post.content)}><Copy className="h-4 w-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-secondary-foreground whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                </Card>
            ))}
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
