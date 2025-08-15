
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
import { getLogisticsAdvice } from "@/ai/flows/logistics-advisor";
import {
  type LogisticsOutput,
  type ShippingRate,
} from "@/lib/types";
import { Loader2, Info, FileText, Bot, PackageCheck, ShieldCheck, ShipWheel, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  productId: z.string({ required_error: "Please select a product." }),
  packageWeightKg: z.coerce.number().min(0.1, { message: "Weight must be at least 0.1 kg." }),
  length: z.coerce.number().min(1, { message: "Length is required." }),
  width: z.coerce.number().min(1, { message: "Width is required." }),
  height: z.coerce.number().min(1, { message: "Height is required." }),
  destination: z.string().min(3, { message: "Destination is required." }),
  declaredValue: z.coerce.number().min(1, { message: "Declared value is required." }),
});

export function LogisticsHubForm() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { products } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LogisticsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageWeightKg: 1,
      declaredValue: 1000,
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
      
      const output = await getLogisticsAdvice({
          productName: language === 'hi' ? product.name_hi : product.name,
          productMaterial: language === 'hi' ? product.materials_hi.join(', ') : product.materials.join(', '),
          packageWeightKg: values.packageWeightKg,
          packageDimensionsCm: {
              length: values.length,
              width: values.width,
              height: values.height,
          },
          destination: values.destination,
          declaredValue: values.declaredValue,
      });
      setResult(output);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('toastErrorTitle'),
        description: t('toastLogisticsError'),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{t('shippingDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField control={form.control} name="productId" render={({ field }) => (
                            <FormItem><FormLabel>{t('product')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('selectAProduct')} /></SelectTrigger></FormControl><SelectContent><SelectContent>
                                {products.map(product => (
                                    <SelectItem key={product.id} value={product.id}>{language === 'hi' ? product.name_hi : product.name}</SelectItem>
                                ))}
                            </SelectContent></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="destination" render={({ field }) => (
                            <FormItem><FormLabel>{t('destination')}</FormLabel><FormControl><Input placeholder={t('destinationPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField control={form.control} name="packageWeightKg" render={({ field }) => (
                            <FormItem><FormLabel>{t('packageWeight')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="declaredValue" render={({ field }) => (
                            <FormItem><FormLabel>{t('declaredValue')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="lg:col-span-2">
                             <FormLabel>{t('packageDimensions')}</FormLabel>
                             <div className="flex gap-2">
                                <FormField control={form.control} name="length" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder={t('length')} {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="width" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder={t('width')} {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem className="flex-1"><FormControl><Input type="number" placeholder={t('height')} {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                             </div>
                        </div>
                    </div>
                </CardContent>
           </Card>
          
          <Button type="submit" disabled={loading} size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t('gettingAdvice') : t('getAdvice')}
          </Button>
        </form>
      </Form>
      
      {loading && (
        <div className="space-y-4 pt-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground font-semibold">{t('analyzingMarketData')}</p>
        </div>
      )}

      {result && (
        <div className="pt-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> {t('aiLogisticsAdvisor')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><PackageCheck size={16} />{t('packagingAdvice')}</h4>
                                <p className="text-sm text-muted-foreground">{result.packagingAdvice}</p>
                           </div>
                           <Separator/>
                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><ShieldCheck size={16} />{t('riskAndInsuranceAdvice')}</h4>
                                <p className="text-sm text-muted-foreground">{result.riskAndInsuranceAdvice}</p>
                           </div>
                           <Separator/>
                            <div className="space-y-1">
                                <h4 className="font-semibold flex items-center gap-2"><ShipWheel size={16} />{t('carrierChoiceAdvice')}</h4>
                                <p className="text-sm text-muted-foreground">{result.carrierChoiceAdvice}</p>
                           </div>
                           {result.customsAdvice && (
                               <>
                                <Separator/>
                                <div className="space-y-1">
                                    <h4 className="font-semibold flex items-center gap-2"><FileText size={16} />{t('customsAdvice')}</h4>
                                    <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{t('hsCode')}:</span> {result.customsAdvice.hsCode}</p>
                                    <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{t('declaration')}:</span> {result.customsAdvice.declarationText}</p>
                                </div>
                               </>
                           )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-2xl font-bold font-headline">{t('shippingOptions')}</h2>
                     {result.shippingOptions.map((option: ShippingRate, index: number) => (
                         <Card key={index}>
                            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-primary">{option.carrier}</h3>
                                        <Badge variant="secondary">{option.serviceType}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Est. Delivery: {option.estimatedDeliveryDate}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-2xl font-bold">₹{option.totalCost.toFixed(2)}</p>
                                    {index > 0 && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            ₹{(option.totalCost - result.shippingOptions[0].totalCost).toFixed(2)} more than cheapest
                                        </p>
                                    )}
                                </div>
                                <Button className="w-full md:w-auto" disabled>
                                    <Bot className="mr-2"/> {t('bookAndGenerateLabel')}
                                </Button>
                            </CardContent>
                         </Card>
                     ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
